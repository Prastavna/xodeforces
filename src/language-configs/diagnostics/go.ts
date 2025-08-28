import * as monaco from "monaco-editor";

const validateModel = (model: monaco.editor.ITextModel) => {
	const markers: monaco.editor.IMarkerData[] = [];
	const lines = model.getLinesContent();

	// Track variables and their usage
	const variables: { [key: string]: { line: number; used: boolean } } = {};
	const goroutines: { [key: string]: { line: number; hasWaitGroup: boolean } } =
		{};
	let inFunction = false;
	let braceCount = 0;

	for (let i = 0; i < lines.length; i++) {
		const line = lines[i];
		const lineNumber = i + 1;
		const trimmedLine = line.trim();

		// Track brace count for function scope
		if (trimmedLine.includes("{")) braceCount++;
		if (trimmedLine.includes("}")) braceCount--;

		// Check if we're in a function
		if (trimmedLine.includes("func ")) {
			inFunction = true;
		}

		// Check for missing imports
		if (
			line.includes("fmt.") &&
			!lines.some((l) => l.includes('import "fmt"'))
		) {
			markers.push({
				severity: monaco.MarkerSeverity.Error,
				startLineNumber: lineNumber,
				startColumn: 1,
				endLineNumber: lineNumber,
				endColumn: line.length + 1,
				message: "Missing 'import \"fmt\"'",
				code: "missing-fmt-import",
			});
		}

		if (line.includes("os.") && !lines.some((l) => l.includes('import "os"'))) {
			markers.push({
				severity: monaco.MarkerSeverity.Error,
				startLineNumber: lineNumber,
				startColumn: 1,
				endLineNumber: lineNumber,
				endColumn: line.length + 1,
				message: "Missing 'import \"os\"'",
				code: "missing-os-import",
			});
		}

		if (line.includes("io.") && !lines.some((l) => l.includes('import "io"'))) {
			markers.push({
				severity: monaco.MarkerSeverity.Error,
				startLineNumber: lineNumber,
				startColumn: 1,
				endLineNumber: lineNumber,
				endColumn: line.length + 1,
				message: "Missing 'import \"io\"'",
				code: "missing-io-import",
			});
		}

		if (
			line.includes("strings.") &&
			!lines.some((l) => l.includes('import "strings"'))
		) {
			markers.push({
				severity: monaco.MarkerSeverity.Error,
				startLineNumber: lineNumber,
				startColumn: 1,
				endLineNumber: lineNumber,
				endColumn: line.length + 1,
				message: "Missing 'import \"strings\"'",
				code: "missing-strings-import",
			});
		}

		if (
			line.includes("strconv.") &&
			!lines.some((l) => l.includes('import "strconv"'))
		) {
			markers.push({
				severity: monaco.MarkerSeverity.Error,
				startLineNumber: lineNumber,
				startColumn: 1,
				endLineNumber: lineNumber,
				endColumn: line.length + 1,
				message: "Missing 'import \"strconv\"'",
				code: "missing-strconv-import",
			});
		}

		if (
			line.includes("sync.") &&
			!lines.some((l) => l.includes('import "sync"'))
		) {
			markers.push({
				severity: monaco.MarkerSeverity.Error,
				startLineNumber: lineNumber,
				startColumn: 1,
				endLineNumber: lineNumber,
				endColumn: line.length + 1,
				message: "Missing 'import \"sync\"'",
				code: "missing-sync-import",
			});
		}

		if (
			line.includes("time.") &&
			!lines.some((l) => l.includes('import "time"'))
		) {
			markers.push({
				severity: monaco.MarkerSeverity.Error,
				startLineNumber: lineNumber,
				startColumn: 1,
				endLineNumber: lineNumber,
				endColumn: line.length + 1,
				message: "Missing 'import \"time\"'",
				code: "missing-time-import",
			});
		}

		if (
			line.includes("http.") &&
			!lines.some((l) => l.includes('import "net/http"'))
		) {
			markers.push({
				severity: monaco.MarkerSeverity.Error,
				startLineNumber: lineNumber,
				startColumn: 1,
				endLineNumber: lineNumber,
				endColumn: line.length + 1,
				message: "Missing 'import \"net/http\"'",
				code: "missing-http-import",
			});
		}

		// Check for missing package declaration
		if (i === 0 && !line.startsWith("package")) {
			markers.push({
				severity: monaco.MarkerSeverity.Error,
				startLineNumber: lineNumber,
				startColumn: 1,
				endLineNumber: lineNumber,
				endColumn: line.length + 1,
				message: "Missing package declaration (e.g., 'package main')",
				code: "missing-package",
			});
		}

		// Track variable declarations
		const varMatch = trimmedLine.match(/(?:var\s+)?(\w+)\s*(?::=|=)/);
		if (
			varMatch &&
			!trimmedLine.includes("func ") &&
			!trimmedLine.includes("const ")
		) {
			const varName = varMatch[1];
			if (varName !== "_" && varName !== "err") {
				variables[varName] = { line: lineNumber, used: false };
			}
		}

		// Mark variables as used when referenced
		Object.keys(variables).forEach((varName) => {
			if (
				line.includes(varName) &&
				!line.includes(`:= ${varName}`) &&
				!line.includes(`= ${varName}`)
			) {
				variables[varName].used = true;
			}
		});

		// Check for unused variables (basic check for := assignment)
		if (line.includes(":=") && !line.includes("_")) {
			const varName = line.split(":=")[0].trim();
			const isUsed = lines.some((l, idx) => idx > i && l.includes(varName));
			if (!isUsed && varName.length > 0 && varName !== "err") {
				markers.push({
					severity: monaco.MarkerSeverity.Warning,
					startLineNumber: lineNumber,
					startColumn: 1,
					endLineNumber: lineNumber,
					endColumn: line.length + 1,
					message: `Variable '${varName}' might be unused`,
					code: "unused-variable",
				});
			}
		}

		// Check for error handling
		if (trimmedLine.includes("err") && trimmedLine.includes(":=")) {
			const nextLine = i + 1 < lines.length ? lines[i + 1].trim() : "";
			const nextNextLine = i + 2 < lines.length ? lines[i + 2].trim() : "";
			if (
				!nextLine.includes("if err != nil") &&
				!nextNextLine.includes("if err != nil")
			) {
				markers.push({
					severity: monaco.MarkerSeverity.Warning,
					startLineNumber: lineNumber,
					startColumn: 1,
					endLineNumber: lineNumber,
					endColumn: line.length + 1,
					message: "Error not checked. Consider adding 'if err != nil' check",
					code: "unchecked-error",
				});
			}
		}

		// Check for goroutine usage without proper synchronization
		if (trimmedLine.includes("go ")) {
			const funcMatch = trimmedLine.match(/go\s+(\w+)/);
			if (funcMatch) {
				const funcName = funcMatch[1];
				goroutines[funcName] = { line: lineNumber, hasWaitGroup: false };
			}
		}

		// Check for defer usage in functions that open resources
		if (
			trimmedLine.includes("os.Open") ||
			trimmedLine.includes("os.Create") ||
			trimmedLine.includes("http.Get")
		) {
			let hasDefer = false;
			for (let j = i + 1; j < lines.length && j < i + 10; j++) {
				if (lines[j].includes("defer ")) {
					hasDefer = true;
					break;
				}
			}
			if (!hasDefer) {
				markers.push({
					severity: monaco.MarkerSeverity.Info,
					startLineNumber: lineNumber,
					startColumn: 1,
					endLineNumber: lineNumber,
					endColumn: line.length + 1,
					message: "Consider using defer to close resources",
					code: "missing-defer",
				});
			}
		}

		// Check for naked returns
		if (trimmedLine === "return" && inFunction) {
			markers.push({
				severity: monaco.MarkerSeverity.Info,
				startLineNumber: lineNumber,
				startColumn: 1,
				endLineNumber: lineNumber,
				endColumn: line.length + 1,
				message:
					"Naked return detected. Consider explicit return values for clarity",
				code: "naked-return",
			});
		}

		// Check for missing main function
		if (
			i === lines.length - 1 &&
			lines.some((l) => l.includes("package main")) &&
			!lines.some((l) => l.includes("func main("))
		) {
			markers.push({
				severity: monaco.MarkerSeverity.Warning,
				startLineNumber: 1,
				startColumn: 1,
				endLineNumber: 1,
				endColumn: 1,
				message: "Package main should have a main function",
				code: "missing-main",
			});
		}

		// Check for inefficient string concatenation
		if (trimmedLine.includes("+=") && trimmedLine.includes(`"`)) {
			markers.push({
				severity: monaco.MarkerSeverity.Info,
				startLineNumber: lineNumber,
				startColumn: 1,
				endLineNumber: lineNumber,
				endColumn: line.length + 1,
				message:
					"String concatenation in loop can be inefficient. Consider using strings.Builder",
				code: "string-concatenation",
			});
		}

		// Check for missing recover in goroutines
		if (trimmedLine.includes("go func()")) {
			let hasRecover = false;
			let localBraceCount = 0;
			for (let j = i + 1; j < lines.length; j++) {
				const nextLine = lines[j].trim();
				if (nextLine.includes("{")) localBraceCount++;
				if (nextLine.includes("}")) {
					localBraceCount--;
					if (localBraceCount === 0) break;
				}
				if (nextLine.includes("recover()")) {
					hasRecover = true;
					break;
				}
			}
			if (!hasRecover) {
				markers.push({
					severity: monaco.MarkerSeverity.Info,
					startLineNumber: lineNumber,
					startColumn: 1,
					endLineNumber: lineNumber,
					endColumn: line.length + 1,
					message:
						"Goroutine without recover() can crash the program. Consider adding panic recovery",
					code: "missing-recover",
				});
			}
		}
	}

	// Check for unused variables
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

	monaco.editor.setModelMarkers(model, "go-diagnostics", markers);
};

// Set up diagnostics for Go models
const onModelAdd = (model: monaco.editor.ITextModel) => {
	if (model.getLanguageId() === "go") {
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
monaco.languages.registerCodeActionProvider("go", {
	provideCodeActions: (model, range) => {
		const actions: monaco.languages.CodeAction[] = [];
		const line = model.getLineContent(range.startLineNumber);
		const lines = model.getLinesContent();

		if (line.includes("fmt.")) {
			const hasFmt = lines.some((l) => l.includes('import "fmt"'));
			if (!hasFmt) {
				actions.push({
					title: "Add 'import \"fmt\"'",
					kind: "quickfix",
					edit: {
						edits: [
							{
								resource: model.uri,
								versionId: model.getVersionId(),
								textEdit: {
									range: {
										startLineNumber: 2,
										startColumn: 1,
										endLineNumber: 2,
										endColumn: 1,
									},
									text: 'import "fmt"\n',
								},
							},
						],
					},
				});
			}
		}

		if (line.includes("os.")) {
			const hasOs = lines.some((l) => l.includes('import "os"'));
			if (!hasOs) {
				actions.push({
					title: "Add 'import \"os\"'",
					kind: "quickfix",
					edit: {
						edits: [
							{
								resource: model.uri,
								versionId: model.getVersionId(),
								textEdit: {
									range: {
										startLineNumber: 2,
										startColumn: 1,
										endLineNumber: 2,
										endColumn: 1,
									},
									text: 'import "os"\n',
								},
							},
						],
					},
				});
			}
		}

		if (line.includes("io.")) {
			const hasIo = lines.some((l) => l.includes('import "io"'));
			if (!hasIo) {
				actions.push({
					title: "Add 'import \"io\"'",
					kind: "quickfix",
					edit: {
						edits: [
							{
								resource: model.uri,
								versionId: model.getVersionId(),
								textEdit: {
									range: {
										startLineNumber: 2,
										startColumn: 1,
										endLineNumber: 2,
										endColumn: 1,
									},
									text: 'import "io"\n',
								},
							},
						],
					},
				});
			}
		}

		if (line.includes("strings.")) {
			const hasStrings = lines.some((l) => l.includes('import "strings"'));
			if (!hasStrings) {
				actions.push({
					title: "Add 'import \"strings\"'",
					kind: "quickfix",
					edit: {
						edits: [
							{
								resource: model.uri,
								versionId: model.getVersionId(),
								textEdit: {
									range: {
										startLineNumber: 2,
										startColumn: 1,
										endLineNumber: 2,
										endColumn: 1,
									},
									text: 'import "strings"\n',
								},
							},
						],
					},
				});
			}
		}

		if (line.includes("strconv.")) {
			const hasStrconv = lines.some((l) => l.includes('import "strconv"'));
			if (!hasStrconv) {
				actions.push({
					title: "Add 'import \"strconv\"'",
					kind: "quickfix",
					edit: {
						edits: [
							{
								resource: model.uri,
								versionId: model.getVersionId(),
								textEdit: {
									range: {
										startLineNumber: 2,
										startColumn: 1,
										endLineNumber: 2,
										endColumn: 1,
									},
									text: 'import "strconv"\n',
								},
							},
						],
					},
				});
			}
		}

		if (line.includes("sync.")) {
			const hasSync = lines.some((l) => l.includes('import "sync"'));
			if (!hasSync) {
				actions.push({
					title: "Add 'import \"sync\"'",
					kind: "quickfix",
					edit: {
						edits: [
							{
								resource: model.uri,
								versionId: model.getVersionId(),
								textEdit: {
									range: {
										startLineNumber: 2,
										startColumn: 1,
										endLineNumber: 2,
										endColumn: 1,
									},
									text: 'import "sync"\n',
								},
							},
						],
					},
				});
			}
		}

		if (line.includes("time.")) {
			const hasTime = lines.some((l) => l.includes('import "time"'));
			if (!hasTime) {
				actions.push({
					title: "Add 'import \"time\"'",
					kind: "quickfix",
					edit: {
						edits: [
							{
								resource: model.uri,
								versionId: model.getVersionId(),
								textEdit: {
									range: {
										startLineNumber: 2,
										startColumn: 1,
										endLineNumber: 2,
										endColumn: 1,
									},
									text: 'import "time"\n',
								},
							},
						],
					},
				});
			}
		}

		if (line.includes("http.")) {
			const hasHttp = lines.some((l) => l.includes('import "net/http"'));
			if (!hasHttp) {
				actions.push({
					title: "Add 'import \"net/http\"'",
					kind: "quickfix",
					edit: {
						edits: [
							{
								resource: model.uri,
								versionId: model.getVersionId(),
								textEdit: {
									range: {
										startLineNumber: 2,
										startColumn: 1,
										endLineNumber: 2,
										endColumn: 1,
									},
									text: 'import "net/http"\n',
								},
							},
						],
					},
				});
			}
		}

		// Quick fix for error handling
		if (line.includes("err") && line.includes(":=")) {
			actions.push({
				title: "Add error check",
				kind: "quickfix",
				edit: {
					edits: [
						{
							resource: model.uri,
							versionId: model.getVersionId(),
							textEdit: {
								range: {
									startLineNumber: range.startLineNumber + 1,
									startColumn: 1,
									endLineNumber: range.startLineNumber + 1,
									endColumn: 1,
								},
								text: "if err != nil {\n\t\treturn err\n\t}\n",
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
