import * as monaco from "monaco-editor";

const validateModel = (model: monaco.editor.ITextModel) => {
	const markers: monaco.editor.IMarkerData[] = [];
	const lines = model.getLinesContent();

	// Track variables and their usage
	const variables: {
		[key: string]: { line: number; used: boolean; mutable: boolean };
	} = {};
	let inUnsafeBlock = false;
	let braceCount = 0;

	for (let i = 0; i < lines.length; i++) {
		const line = lines[i];
		const lineNumber = i + 1;
		const trimmedLine = line.trim();

		// Track unsafe blocks
		if (trimmedLine.includes("unsafe {")) {
			inUnsafeBlock = true;
		}
		if (trimmedLine.includes("}")) {
			inUnsafeBlock = false;
		}

		// Track brace count for function scope
		if (trimmedLine.includes("{")) braceCount++;
		if (trimmedLine.includes("}")) braceCount--;

		// Check for missing semicolons after statements
		if (
			trimmedLine.length > 0 &&
			!trimmedLine.endsWith(";") &&
			!trimmedLine.endsWith("{") &&
			!trimmedLine.endsWith("}") &&
			!trimmedLine.endsWith(",") &&
			!trimmedLine.startsWith("//") &&
			!trimmedLine.startsWith("/*") &&
			!trimmedLine.includes("if") &&
			!trimmedLine.includes("else") &&
			!trimmedLine.includes("while") &&
			!trimmedLine.includes("for") &&
			!trimmedLine.includes("loop") &&
			!trimmedLine.includes("match") &&
			!trimmedLine.includes("fn") &&
			!trimmedLine.includes("struct") &&
			!trimmedLine.includes("enum") &&
			!trimmedLine.includes("impl") &&
			(trimmedLine.includes("let") ||
				trimmedLine.includes("println!") ||
				trimmedLine.includes("return"))
		) {
			markers.push({
				severity: monaco.MarkerSeverity.Error,
				startLineNumber: lineNumber,
				startColumn: line.length,
				endLineNumber: lineNumber,
				endColumn: line.length + 1,
				message: "Missing semicolon",
				code: "missing-semicolon",
			});
		}

		// Track variable declarations
		const varMatch = trimmedLine.match(/let\s+(mut\s+)?(\w+)/);
		if (varMatch) {
			const varName = varMatch[2];
			const isMutable = varMatch[1] !== undefined;
			if (varName !== "_") {
				variables[varName] = {
					line: lineNumber,
					used: false,
					mutable: isMutable,
				};
			}
		}

		// Mark variables as used when referenced
		Object.keys(variables).forEach((varName) => {
			if (
				line.includes(varName) &&
				!line.includes(`let ${varName}`) &&
				!line.includes(`let mut ${varName}`)
			) {
				variables[varName].used = true;
			}
		});

		// Check for unused variables (variables starting with underscore are intentionally unused)
		if (line.includes("let ") && !line.includes("let _")) {
			const varMatch = line.match(/let\s+(?:mut\s+)?(\w+)/);
			if (varMatch) {
				const varName = varMatch[1];
				const isUsed = lines.some((l, idx) => idx > i && l.includes(varName));
				if (!isUsed) {
					markers.push({
						severity: monaco.MarkerSeverity.Warning,
						startLineNumber: lineNumber,
						startColumn: line.indexOf(varName),
						endLineNumber: lineNumber,
						endColumn: line.indexOf(varName) + varName.length,
						message: `Variable '${varName}' might be unused. Consider prefixing with underscore: '_${varName}'`,
						code: "unused-variable",
					});
				}
			}
		}

		// Check for missing main function
		if (i === lines.length - 1 && !lines.some((l) => l.includes("fn main("))) {
			markers.push({
				severity: monaco.MarkerSeverity.Warning,
				startLineNumber: 1,
				startColumn: 1,
				endLineNumber: 1,
				endColumn: 1,
				message: "Consider adding a main function: fn main() { }",
				code: "missing-main",
			});
		}

		// Check for unwrap() usage without proper error handling
		if (trimmedLine.includes(".unwrap()")) {
			markers.push({
				severity: monaco.MarkerSeverity.Warning,
				startLineNumber: lineNumber,
				startColumn: line.indexOf(".unwrap()"),
				endLineNumber: lineNumber,
				endColumn: line.indexOf(".unwrap()") + 8,
				message:
					"unwrap() can panic. Consider using proper error handling with match or ?",
				code: "unwrap-usage",
			});
		}

		// Check for expect() usage
		if (trimmedLine.includes(".expect(")) {
			const expectMatch = trimmedLine.match(/\.expect\("([^"]*)"\)/);
			if (expectMatch && expectMatch[1].length < 10) {
				markers.push({
					severity: monaco.MarkerSeverity.Info,
					startLineNumber: lineNumber,
					startColumn: line.indexOf(".expect("),
					endLineNumber: lineNumber,
					endColumn: line.indexOf(".expect(") + 7,
					message:
						"Consider providing a more descriptive error message in expect()",
					code: "expect-message",
				});
			}
		}

		// Check for clone() usage (potential performance issue)
		if (trimmedLine.includes(".clone()")) {
			markers.push({
				severity: monaco.MarkerSeverity.Info,
				startLineNumber: lineNumber,
				startColumn: line.indexOf(".clone()"),
				endLineNumber: lineNumber,
				endColumn: line.indexOf(".clone()") + 7,
				message:
					"clone() creates a copy. Consider using references (&) to avoid unnecessary allocations",
				code: "clone-usage",
			});
		}

		// Check for missing lifetime annotations in functions
		if (trimmedLine.includes("fn ") && trimmedLine.includes("&")) {
			const funcMatch = trimmedLine.match(/fn\s+\w+\s*\(([^)]*)\)/);
			if (funcMatch) {
				const params = funcMatch[1];
				if (params.includes("&") && !params.includes("'<")) {
					markers.push({
						severity: monaco.MarkerSeverity.Info,
						startLineNumber: lineNumber,
						startColumn: line.indexOf("fn"),
						endLineNumber: lineNumber,
						endColumn: line.indexOf("fn") + 2,
						message:
							"Consider adding explicit lifetime annotations for borrowed parameters",
						code: "missing-lifetimes",
					});
				}
			}
		}

		// Check for unnecessary mut keyword
		if (trimmedLine.includes("let mut ") && !line.includes("=")) {
			const varMatch = trimmedLine.match(/let\s+mut\s+(\w+)/);
			if (varMatch) {
				const varName = varMatch[1];
				const nextLine = i + 1 < lines.length ? lines[i + 1].trim() : "";
				if (!nextLine.includes(varName)) {
					markers.push({
						severity: monaco.MarkerSeverity.Info,
						startLineNumber: lineNumber,
						startColumn: line.indexOf("mut"),
						endLineNumber: lineNumber,
						endColumn: line.indexOf("mut") + 3,
						message:
							"Variable declared as mutable but never modified. Consider removing 'mut'",
						code: "unnecessary-mut",
					});
				}
			}
		}

		// Check for missing error handling in Result returns
		if (trimmedLine.includes("-> Result<")) {
			let hasErrorHandling = false;
			for (let j = i + 1; j < lines.length && j < i + 20; j++) {
				const nextLine = lines[j].trim();
				if (
					nextLine.includes("match ") ||
					nextLine.includes("if let ") ||
					nextLine.includes("?")
				) {
					hasErrorHandling = true;
					break;
				}
				if (nextLine.includes("}")) break;
			}
			if (!hasErrorHandling) {
				markers.push({
					severity: monaco.MarkerSeverity.Info,
					startLineNumber: lineNumber,
					startColumn: 1,
					endLineNumber: lineNumber,
					endColumn: line.length + 1,
					message:
						"Function returns Result but no error handling is visible. Consider using match or ? operator",
					code: "missing-error-handling",
				});
			}
		}

		// Check for unsafe code usage
		if (
			inUnsafeBlock &&
			(trimmedLine.includes("*const") || trimmedLine.includes("*mut"))
		) {
			markers.push({
				severity: monaco.MarkerSeverity.Warning,
				startLineNumber: lineNumber,
				startColumn: 1,
				endLineNumber: lineNumber,
				endColumn: line.length + 1,
				message:
					"Raw pointer usage in unsafe block. Ensure proper safety guarantees",
				code: "raw-pointer-unsafe",
			});
		}

		// Check for infinite loops without break conditions
		if (trimmedLine.includes("loop {")) {
			let hasBreak = false;
			let localBraceCount = 0;
			for (let j = i + 1; j < lines.length; j++) {
				const nextLine = lines[j].trim();
				if (nextLine.includes("{")) localBraceCount++;
				if (nextLine.includes("}")) {
					localBraceCount--;
					if (localBraceCount < 0) break;
				}
				if (nextLine.includes("break")) {
					hasBreak = true;
					break;
				}
			}
			if (!hasBreak) {
				markers.push({
					severity: monaco.MarkerSeverity.Warning,
					startLineNumber: lineNumber,
					startColumn: 1,
					endLineNumber: lineNumber,
					endColumn: line.length + 1,
					message:
						"Infinite loop detected. Consider adding break conditions or using while/for loops",
					code: "infinite-loop",
				});
			}
		}

		// Check for missing documentation
		if (
			trimmedLine.includes("pub fn ") ||
			trimmedLine.includes("pub struct ")
		) {
			const prevLine = i > 0 ? lines[i - 1].trim() : "";
			if (!prevLine.startsWith("///") && !prevLine.startsWith("//!")) {
				markers.push({
					severity: monaco.MarkerSeverity.Info,
					startLineNumber: lineNumber,
					startColumn: 1,
					endLineNumber: lineNumber,
					endColumn: line.length + 1,
					message: "Consider adding documentation comments for public APIs",
					code: "missing-docs",
				});
			}
		}

		// Check for String::new() vs string literals
		if (trimmedLine.includes("String::new()")) {
			markers.push({
				severity: monaco.MarkerSeverity.Info,
				startLineNumber: lineNumber,
				startColumn: line.indexOf("String::new()"),
				endLineNumber: lineNumber,
				endColumn: line.indexOf("String::new()") + 13,
				message:
					"Consider using string literals (&str) instead of String::new() for empty strings",
				code: "string-new",
			});
		}
	}

	// Check for unused variables at the end
	Object.entries(variables).forEach(([varName, info]) => {
		if (!info.used && braceCount === 0) {
			markers.push({
				severity: monaco.MarkerSeverity.Warning,
				startLineNumber: info.line,
				startColumn: lines[info.line - 1].indexOf(varName),
				endLineNumber: info.line,
				endColumn: lines[info.line - 1].indexOf(varName) + varName.length,
				message: `Variable '${varName}' is declared but never used`,
				code: "unused-variable-final",
			});
		}
	});

	monaco.editor.setModelMarkers(model, "rust-diagnostics", markers);
};

// Set up diagnostics for Rust models
const onModelAdd = (model: monaco.editor.ITextModel) => {
	if (model.getLanguageId() === "rust") {
		validateModel(model);
		model.onDidChangeContent(() => {
			validateModel(model);
		});
	}
};

// Validate existing models
monaco.editor.getModels().forEach(onModelAdd);

// Listen for new models
monaco.editor.onDidCreateModel(onModelAdd);

// Register code action provider
monaco.languages.registerCodeActionProvider("rust", {
	provideCodeActions: (model, range) => {
		const actions: monaco.languages.CodeAction[] = [];
		const line = model.getLineContent(range.startLineNumber);

		// Quick fix for unused variables
		const varMatch = line.match(/let\s+(?:mut\s+)?(\w+)/);
		if (varMatch) {
			const varName = varMatch[1];
			actions.push({
				title: `Prefix with underscore: _${varName}`,
				kind: "quickfix",
				edit: {
					edits: [
						{
							resource: model.uri,
							versionId: model.getVersionId(),
							textEdit: {
								range: {
									startLineNumber: range.startLineNumber,
									startColumn: line.indexOf(varName),
									endLineNumber: range.startLineNumber,
									endColumn: line.indexOf(varName),
								},
								text: "_",
							},
						},
					],
				},
			});
		}

		// Quick fix for unwrap() usage
		if (line.includes(".unwrap()")) {
			actions.push({
				title: "Replace unwrap() with proper error handling",
				kind: "quickfix",
				edit: {
					edits: [
						{
							resource: model.uri,
							versionId: model.getVersionId(),
							textEdit: {
								range: {
									startLineNumber: range.startLineNumber,
									startColumn: line.indexOf(".unwrap()"),
									endLineNumber: range.startLineNumber,
									endColumn: line.indexOf(".unwrap()") + 8,
								},
								text: '.expect("Error message")',
							},
						},
					],
				},
			});
		}

		// Quick fix for clone() usage
		if (line.includes(".clone()")) {
			actions.push({
				title: "Use reference instead of clone",
				kind: "quickfix",
				edit: {
					edits: [
						{
							resource: model.uri,
							versionId: model.getVersionId(),
							textEdit: {
								range: {
									startLineNumber: range.startLineNumber,
									startColumn: line.indexOf(".clone()"),
									endLineNumber: range.startLineNumber,
									endColumn: line.indexOf(".clone()") + 7,
								},
								text: ".as_ref()",
							},
						},
					],
				},
			});
		}

		// Quick fix for unnecessary mut
		if (line.includes("let mut ")) {
			actions.push({
				title: "Remove unnecessary mut keyword",
				kind: "quickfix",
				edit: {
					edits: [
						{
							resource: model.uri,
							versionId: model.getVersionId(),
							textEdit: {
								range: {
									startLineNumber: range.startLineNumber,
									startColumn: line.indexOf("mut "),
									endLineNumber: range.startLineNumber,
									endColumn: line.indexOf("mut ") + 4,
								},
								text: "",
							},
						},
					],
				},
			});
		}

		return {
			actions,
			dispose: () => {},
		};
	},
});
