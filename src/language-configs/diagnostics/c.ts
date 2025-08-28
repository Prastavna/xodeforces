import * as monaco from "monaco-editor";

const validateModel = (model: monaco.editor.ITextModel) => {
	const markers: monaco.editor.IMarkerData[] = [];
	const lines = model.getLinesContent();

	// Track memory allocations and deallocations
	const allocations: {
		[key: string]: { line: number; freed: boolean; type: string };
	} = {};
	const pointers: { [key: string]: { line: number; type: string } } = {};

	for (let i = 0; i < lines.length; i++) {
		const line = lines[i];
		const lineNumber = i + 1;
		const trimmedLine = line.trim();

		// Check for missing includes
		if (line.includes("printf") || line.includes("scanf")) {
			const includeExists = lines.some((l) => l.includes("#include <stdio.h>"));
			if (!includeExists) {
				markers.push({
					severity: monaco.MarkerSeverity.Error,
					startLineNumber: lineNumber,
					startColumn: 1,
					endLineNumber: lineNumber,
					endColumn: line.length + 1,
					message: "Missing #include <stdio.h> for printf/scanf functions",
					code: "missing-include",
				});
			}
		}

		if (
			line.includes("malloc") ||
			line.includes("calloc") ||
			line.includes("realloc")
		) {
			const includeExists = lines.some((l) =>
				l.includes("#include <stdlib.h>"),
			);
			if (!includeExists) {
				markers.push({
					severity: monaco.MarkerSeverity.Error,
					startLineNumber: lineNumber,
					startColumn: 1,
					endLineNumber: lineNumber,
					endColumn: line.length + 1,
					message:
						"Missing #include <stdlib.h> for malloc/calloc/realloc functions",
					code: "missing-stdlib",
				});
			}
		}

		if (
			line.includes("strlen") ||
			line.includes("strcpy") ||
			line.includes("strcmp")
		) {
			const includeExists = lines.some((l) =>
				l.includes("#include <string.h>"),
			);
			if (!includeExists) {
				markers.push({
					severity: monaco.MarkerSeverity.Error,
					startLineNumber: lineNumber,
					startColumn: 1,
					endLineNumber: lineNumber,
					endColumn: line.length + 1,
					message: "Missing #include <string.h> for string functions",
					code: "missing-string-h",
				});
			}
		}

		if (line.includes("sin") || line.includes("cos") || line.includes("sqrt")) {
			const includeExists = lines.some((l) => l.includes("#include <math.h>"));
			if (!includeExists) {
				markers.push({
					severity: monaco.MarkerSeverity.Error,
					startLineNumber: lineNumber,
					startColumn: 1,
					endLineNumber: lineNumber,
					endColumn: line.length + 1,
					message: "Missing #include <math.h> for math functions",
					code: "missing-math-h",
				});
			}
		}

		if (
			line.includes("fopen") ||
			line.includes("fclose") ||
			line.includes("fread")
		) {
			const includeExists = lines.some((l) => l.includes("#include <stdio.h>"));
			if (!includeExists) {
				markers.push({
					severity: monaco.MarkerSeverity.Error,
					startLineNumber: lineNumber,
					startColumn: 1,
					endLineNumber: lineNumber,
					endColumn: line.length + 1,
					message: "Missing #include <stdio.h> for file operations",
					code: "missing-file-include",
				});
			}
		}

		// Track memory allocations
		const mallocMatch = trimmedLine.match(
			/(\w+)\s*=\s*(malloc|calloc|realloc)\s*\(/,
		);
		if (mallocMatch) {
			const varName = mallocMatch[1];
			const funcName = mallocMatch[2];
			allocations[varName] = { line: lineNumber, freed: false, type: funcName };
		}

		// Track memory deallocations
		const freeMatch = trimmedLine.match(/free\s*\(\s*(\w+)\s*\)/);
		if (freeMatch) {
			const varName = freeMatch[1];
			if (allocations[varName]) {
				allocations[varName].freed = true;
			}
		}

		// Track pointer declarations
		const pointerMatch = trimmedLine.match(/(\w+)\s*\*\s*(\w+)/);
		if (pointerMatch) {
			const type = pointerMatch[1];
			const varName = pointerMatch[2];
			pointers[varName] = { line: lineNumber, type };
		}

		// Check for missing semicolons
		if (
			trimmedLine.length > 0 &&
			!trimmedLine.endsWith(";") &&
			!trimmedLine.endsWith("{") &&
			!trimmedLine.endsWith("}") &&
			!trimmedLine.startsWith("#") &&
			!trimmedLine.startsWith("//") &&
			!trimmedLine.startsWith("/*") &&
			!trimmedLine.includes("if") &&
			!trimmedLine.includes("else") &&
			!trimmedLine.includes("while") &&
			!trimmedLine.includes("for") &&
			!trimmedLine.includes("do") &&
			!trimmedLine.includes("switch") &&
			(trimmedLine.includes("=") ||
				trimmedLine.includes("printf") ||
				trimmedLine.includes("scanf") ||
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

		// Check for main function signature
		if (
			line.includes("main") &&
			line.includes("(") &&
			!line.includes("int main")
		) {
			markers.push({
				severity: monaco.MarkerSeverity.Warning,
				startLineNumber: lineNumber,
				startColumn: 1,
				endLineNumber: lineNumber,
				endColumn: line.length + 1,
				message: "Consider using standard main function signature: int main()",
				code: "main-signature",
			});
		}

		// Check for potential buffer overflow with strcpy
		if (trimmedLine.includes("strcpy")) {
			markers.push({
				severity: monaco.MarkerSeverity.Warning,
				startLineNumber: lineNumber,
				startColumn: 1,
				endLineNumber: lineNumber,
				endColumn: line.length + 1,
				message:
					"strcpy can cause buffer overflow. Consider using strncpy or strlcpy.",
				code: "buffer-overflow-risk",
			});
		}

		// Check for gets usage (inherently unsafe)
		if (trimmedLine.includes("gets(")) {
			markers.push({
				severity: monaco.MarkerSeverity.Error,
				startLineNumber: lineNumber,
				startColumn: 1,
				endLineNumber: lineNumber,
				endColumn: line.length + 1,
				message:
					"gets() is inherently unsafe and should never be used. Use fgets() instead.",
				code: "unsafe-gets",
			});
		}

		// Check for scanf without width specifier
		if (
			trimmedLine.includes("scanf") &&
			trimmedLine.includes("%s") &&
			!trimmedLine.includes("%")
		) {
			const scanfMatch = trimmedLine.match(/scanf\s*\(\s*["']([^"']*)["']/);
			if (
				scanfMatch &&
				scanfMatch[1].includes("%s") &&
				!scanfMatch[1].includes("%")
			) {
				markers.push({
					severity: monaco.MarkerSeverity.Warning,
					startLineNumber: lineNumber,
					startColumn: 1,
					endLineNumber: lineNumber,
					endColumn: line.length + 1,
					message:
						"scanf with %s without width specifier can cause buffer overflow. Use %Ns where N is buffer size.",
					code: "scanf-buffer-overflow",
				});
			}
		}

		// Check for missing return statements in non-void functions
		if (
			trimmedLine.includes("int ") &&
			trimmedLine.includes("(") &&
			trimmedLine.includes(")")
		) {
			const funcNameMatch = trimmedLine.match(/int\s+(\w+)\s*\(/);
			if (funcNameMatch) {
				const funcName = funcNameMatch[1];
				// Look for return statements in the function body
				let braceCount = 0;
				let hasReturn = false;
				for (let j = i + 1; j < lines.length; j++) {
					const nextLine = lines[j].trim();
					if (nextLine.includes("{")) braceCount++;
					if (nextLine.includes("}")) {
						braceCount--;
						if (braceCount === 0) break;
					}
					if (nextLine.includes("return")) {
						hasReturn = true;
						break;
					}
				}
				if (!hasReturn && funcName !== "main") {
					markers.push({
						severity: monaco.MarkerSeverity.Warning,
						startLineNumber: lineNumber,
						startColumn: 1,
						endLineNumber: lineNumber,
						endColumn: line.length + 1,
						message: `Function '${funcName}' has no return statement`,
						code: "missing-return",
					});
				}
			}
		}

		// Check for magic numbers
		const magicNumberMatch = trimmedLine.match(/=\s*(\d+)/);
		if (
			magicNumberMatch &&
			magicNumberMatch[1] !== "0" &&
			magicNumberMatch[1] !== "1" &&
			!trimmedLine.includes("#define") &&
			!trimmedLine.includes("const")
		) {
			const number = magicNumberMatch[1];
			if (parseInt(number) > 1) {
				markers.push({
					severity: monaco.MarkerSeverity.Info,
					startLineNumber: lineNumber,
					startColumn: line.indexOf(number),
					endLineNumber: lineNumber,
					endColumn: line.indexOf(number) + number.length,
					message: "Consider using a named constant instead of magic number",
					code: "magic-number",
				});
			}
		}

		// Check for uninitialized variables
		const varMatch = trimmedLine.match(/int\s+(\w+)\s*;/);
		if (varMatch && !trimmedLine.includes("=")) {
			const varName = varMatch[1];
			markers.push({
				severity: monaco.MarkerSeverity.Info,
				startLineNumber: lineNumber,
				startColumn: line.indexOf(varName),
				endLineNumber: lineNumber,
				endColumn: line.indexOf(varName) + varName.length,
				message: `Variable '${varName}' is declared but not initialized`,
				code: "uninitialized-variable",
			});
		}
	}

	// Check for unfreed memory allocations
	Object.entries(allocations).forEach(([varName, info]) => {
		if (!info.freed) {
			markers.push({
				severity: monaco.MarkerSeverity.Warning,
				startLineNumber: info.line,
				startColumn: lines[info.line - 1].indexOf(varName),
				endLineNumber: info.line,
				endColumn: lines[info.line - 1].indexOf(varName) + varName.length,
				message: `Memory allocated with ${info.type}() but never freed. Consider calling free().`,
				code: "memory-leak",
			});
		}
	});

	monaco.editor.setModelMarkers(model, "c-diagnostics", markers);
};

// Set up diagnostics for C models
const onModelAdd = (model: monaco.editor.ITextModel) => {
	if (model.getLanguageId() === "c") {
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
monaco.languages.registerCodeActionProvider("c", {
	provideCodeActions: (model, range) => {
		const actions: monaco.languages.CodeAction[] = [];
		const line = model.getLineContent(range.startLineNumber);
		const lines = model.getLinesContent();

		// Quick fix for missing includes
		if (line.includes("printf") || line.includes("scanf")) {
			const hasStdio = lines.some((l) => l.includes("#include <stdio.h>"));
			if (!hasStdio) {
				actions.push({
					title: "Add #include <stdio.h>",
					kind: "quickfix",
					edit: {
						edits: [
							{
								resource: model.uri,
								versionId: model.getVersionId(),
								textEdit: {
									range: {
										startLineNumber: 1,
										startColumn: 1,
										endLineNumber: 1,
										endColumn: 1,
									},
									text: "#include <stdio.h>\n",
								},
							},
						],
					},
				});
			}
		}

		if (
			line.includes("malloc") ||
			line.includes("calloc") ||
			line.includes("realloc")
		) {
			const hasStdlib = lines.some((l) => l.includes("#include <stdlib.h>"));
			if (!hasStdlib) {
				actions.push({
					title: "Add #include <stdlib.h>",
					kind: "quickfix",
					edit: {
						edits: [
							{
								resource: model.uri,
								versionId: model.getVersionId(),
								textEdit: {
									range: {
										startLineNumber: 1,
										startColumn: 1,
										endLineNumber: 1,
										endColumn: 1,
									},
									text: "#include <stdlib.h>\n",
								},
							},
						],
					},
				});
			}
		}

		if (
			line.includes("strlen") ||
			line.includes("strcpy") ||
			line.includes("strcmp")
		) {
			const hasString = lines.some((l) => l.includes("#include <string.h>"));
			if (!hasString) {
				actions.push({
					title: "Add #include <string.h>",
					kind: "quickfix",
					edit: {
						edits: [
							{
								resource: model.uri,
								versionId: model.getVersionId(),
								textEdit: {
									range: {
										startLineNumber: 1,
										startColumn: 1,
										endLineNumber: 1,
										endColumn: 1,
									},
									text: "#include <string.h>\n",
								},
							},
						],
					},
				});
			}
		}

		if (line.includes("sin") || line.includes("cos") || line.includes("sqrt")) {
			const hasMath = lines.some((l) => l.includes("#include <math.h>"));
			if (!hasMath) {
				actions.push({
					title: "Add #include <math.h>",
					kind: "quickfix",
					edit: {
						edits: [
							{
								resource: model.uri,
								versionId: model.getVersionId(),
								textEdit: {
									range: {
										startLineNumber: 1,
										startColumn: 1,
										endLineNumber: 1,
										endColumn: 1,
									},
									text: "#include <math.h>\n",
								},
							},
						],
					},
				});
			}
		}

		if (
			line.includes("fopen") ||
			line.includes("fclose") ||
			line.includes("fread")
		) {
			const hasStdio = lines.some((l) => l.includes("#include <stdio.h>"));
			if (!hasStdio) {
				actions.push({
					title: "Add #include <stdio.h>",
					kind: "quickfix",
					edit: {
						edits: [
							{
								resource: model.uri,
								versionId: model.getVersionId(),
								textEdit: {
									range: {
										startLineNumber: 1,
										startColumn: 1,
										endLineNumber: 1,
										endColumn: 1,
									},
									text: "#include <stdio.h>\n",
								},
							},
						],
					},
				});
			}
		}

		// Quick fix for missing semicolons
		if (
			!line.trim().endsWith(";") &&
			(line.includes("=") || line.includes("printf") || line.includes("return"))
		) {
			actions.push({
				title: "Add semicolon",
				kind: "quickfix",
				edit: {
					edits: [
						{
							resource: model.uri,
							versionId: model.getVersionId(),
							textEdit: {
								range: {
									startLineNumber: range.startLineNumber,
									startColumn: line.length + 1,
									endLineNumber: range.startLineNumber,
									endColumn: line.length + 1,
								},
								text: ";",
							},
						},
					],
				},
			});
		}

		// Quick fix for gets() replacement
		if (line.includes("gets(")) {
			actions.push({
				title: "Replace gets() with fgets()",
				kind: "quickfix",
				edit: {
					edits: [
						{
							resource: model.uri,
							versionId: model.getVersionId(),
							textEdit: {
								range: {
									startLineNumber: range.startLineNumber,
									startColumn: line.indexOf("gets("),
									endLineNumber: range.startLineNumber,
									endColumn: line.indexOf(")") + 1,
								},
								text: "fgets(buffer, sizeof(buffer), stdin)",
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
