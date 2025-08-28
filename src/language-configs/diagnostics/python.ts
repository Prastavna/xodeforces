import * as monaco from "monaco-editor";

const validateModel = (model: monaco.editor.ITextModel) => {
	const markers: monaco.editor.IMarkerData[] = [];
	const lines = model.getLinesContent();

	// Collect all imports for unused import checking
	const imports: { [key: string]: { line: number; used: boolean } } = {};
	const importLines: number[] = [];

	for (let i = 0; i < lines.length; i++) {
		const line = lines[i];
		const lineNumber = i + 1;
		const trimmedLine = line.trim();

		// Collect import statements
		if (trimmedLine.startsWith("import ") || trimmedLine.startsWith("from ")) {
			importLines.push(i);
			const importMatch = trimmedLine.match(
				/(?:import|from)\s+([a-zA-Z_][a-zA-Z0-9_]*(?:\.[a-zA-Z_][a-zA-Z0-9_]*)*)/,
			);
			if (importMatch) {
				const moduleName = importMatch[1].split(".")[0];
				imports[moduleName] = { line: lineNumber, used: false };
			}
		}

		// Check for missing imports
		if (
			line.includes("math.") &&
			!lines.some((l) => l.includes("import math"))
		) {
			markers.push({
				severity: monaco.MarkerSeverity.Error,
				startLineNumber: lineNumber,
				startColumn: 1,
				endLineNumber: lineNumber,
				endColumn: line.length + 1,
				message: "Missing 'import math'",
				code: "missing-math-import",
			});
		}

		if (line.includes("sys.") && !lines.some((l) => l.includes("import sys"))) {
			markers.push({
				severity: monaco.MarkerSeverity.Error,
				startLineNumber: lineNumber,
				startColumn: 1,
				endLineNumber: lineNumber,
				endColumn: line.length + 1,
				message: "Missing 'import sys'",
				code: "missing-sys-import",
			});
		}

		if (line.includes("os.") && !lines.some((l) => l.includes("import os"))) {
			markers.push({
				severity: monaco.MarkerSeverity.Error,
				startLineNumber: lineNumber,
				startColumn: 1,
				endLineNumber: lineNumber,
				endColumn: line.length + 1,
				message: "Missing 'import os'",
				code: "missing-os-import",
			});
		}

		if (
			line.includes("json.") &&
			!lines.some((l) => l.includes("import json"))
		) {
			markers.push({
				severity: monaco.MarkerSeverity.Error,
				startLineNumber: lineNumber,
				startColumn: 1,
				endLineNumber: lineNumber,
				endColumn: line.length + 1,
				message: "Missing 'import json'",
				code: "missing-json-import",
			});
		}

		if (
			line.includes("datetime.") &&
			!lines.some((l) => l.includes("import datetime"))
		) {
			markers.push({
				severity: monaco.MarkerSeverity.Error,
				startLineNumber: lineNumber,
				startColumn: 1,
				endLineNumber: lineNumber,
				endColumn: line.length + 1,
				message: "Missing 'import datetime'",
				code: "missing-datetime-import",
			});
		}

		// Mark imports as used when referenced
		Object.keys(imports).forEach((module) => {
			if (
				line.includes(`${module}.`) &&
				!line.includes(`import ${module}`) &&
				!line.includes(`from ${module}`)
			) {
				imports[module].used = true;
			}
		});

		// Check for incorrect indentation (basic check)
		if (
			line.startsWith(" ") &&
			!line.startsWith("    ") &&
			line.trim().length > 0
		) {
			const spaceCount = line.length - line.trimStart().length;
			if (spaceCount % 4 !== 0) {
				markers.push({
					severity: monaco.MarkerSeverity.Warning,
					startLineNumber: lineNumber,
					startColumn: 1,
					endLineNumber: lineNumber,
					endColumn: spaceCount + 1,
					message: "Indentation should be 4 spaces",
					code: "incorrect-indentation",
				});
			}
		}

		// Check for missing colon after control structures
		if (
			(trimmedLine.startsWith("if ") ||
				trimmedLine.startsWith("elif ") ||
				trimmedLine.startsWith("else") ||
				trimmedLine.startsWith("for ") ||
				trimmedLine.startsWith("while ") ||
				trimmedLine.startsWith("def ") ||
				trimmedLine.startsWith("class ") ||
				trimmedLine.startsWith("try") ||
				trimmedLine.startsWith("except") ||
				trimmedLine.startsWith("finally") ||
				trimmedLine.startsWith("with ")) &&
			!trimmedLine.endsWith(":")
		) {
			markers.push({
				severity: monaco.MarkerSeverity.Error,
				startLineNumber: lineNumber,
				startColumn: line.length,
				endLineNumber: lineNumber,
				endColumn: line.length + 1,
				message: "Missing colon (:)",
				code: "missing-colon",
			});
		}

		// Check for bare except clauses
		if (
			trimmedLine.startsWith("except:") ||
			trimmedLine.startsWith("except ")
		) {
			if (trimmedLine === "except:" || trimmedLine === "except :") {
				markers.push({
					severity: monaco.MarkerSeverity.Warning,
					startLineNumber: lineNumber,
					startColumn: 1,
					endLineNumber: lineNumber,
					endColumn: line.length + 1,
					message:
						"Avoid bare 'except:' clauses. Catch specific exceptions instead.",
					code: "bare-except",
				});
			}
		}

		// Check for print statements in Python 3 (suggest f-strings or .format())
		if (trimmedLine.includes("print(") && trimmedLine.includes("%")) {
			markers.push({
				severity: monaco.MarkerSeverity.Info,
				startLineNumber: lineNumber,
				startColumn: 1,
				endLineNumber: lineNumber,
				endColumn: line.length + 1,
				message:
					"Consider using f-strings or .format() instead of % formatting",
				code: "old-string-formatting",
			});
		}

		// Check for function definitions without docstrings
		if (trimmedLine.startsWith("def ")) {
			const nextLine = i + 1 < lines.length ? lines[i + 1].trim() : "";
			const nextNextLine = i + 2 < lines.length ? lines[i + 2].trim() : "";
			if (
				!nextLine.startsWith('"""') &&
				!nextLine.startsWith("'''") &&
				!nextNextLine.startsWith('"""') &&
				!nextNextLine.startsWith("'''")
			) {
				markers.push({
					severity: monaco.MarkerSeverity.Info,
					startLineNumber: lineNumber,
					startColumn: 1,
					endLineNumber: lineNumber,
					endColumn: line.length + 1,
					message: "Consider adding a docstring to document this function",
					code: "missing-docstring",
				});
			}
		}

		// Check for variable naming conventions
		const varMatch = trimmedLine.match(/^\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*=/);
		if (
			varMatch &&
			!trimmedLine.includes("def ") &&
			!trimmedLine.includes("class ")
		) {
			const varName = varMatch[1];
			if (varName.includes("__") && !varName.startsWith("__")) {
				markers.push({
					severity: monaco.MarkerSeverity.Warning,
					startLineNumber: lineNumber,
					startColumn: line.indexOf(varName),
					endLineNumber: lineNumber,
					endColumn: line.indexOf(varName) + varName.length,
					message:
						"Variable names with double underscores are typically reserved for special methods",
					code: "reserved-name",
				});
			}
		}
	}

	// Check for unused imports
	Object.entries(imports).forEach(([module, info]) => {
		if (!info.used) {
			markers.push({
				severity: monaco.MarkerSeverity.Warning,
				startLineNumber: info.line,
				startColumn: 1,
				endLineNumber: info.line,
				endColumn: lines[info.line - 1].length + 1,
				message: `Unused import: '${module}'`,
				code: "unused-import",
			});
		}
	});

	monaco.editor.setModelMarkers(model, "python-diagnostics", markers);
};

// Set up diagnostics for Python models
const onModelAdd = (model: monaco.editor.ITextModel) => {
	if (model.getLanguageId() === "python") {
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
monaco.languages.registerCodeActionProvider("python", {
	provideCodeActions: (model, range) => {
		const actions: monaco.languages.CodeAction[] = [];
		const line = model.getLineContent(range.startLineNumber);
		const lines = model.getLinesContent();

		// Quick fix for missing imports
		if (line.includes("math.")) {
			const hasMath = lines.some((l) => l.includes("import math"));
			if (!hasMath) {
				actions.push({
					title: "Add 'import math'",
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
									text: "import math\n",
								},
							},
						],
					},
				});
			}
		}

		if (line.includes("sys.")) {
			const hasSys = lines.some((l) => l.includes("import sys"));
			if (!hasSys) {
				actions.push({
					title: "Add 'import sys'",
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
									text: "import sys\n",
								},
							},
						],
					},
				});
			}
		}

		if (line.includes("os.")) {
			const hasOs = lines.some((l) => l.includes("import os"));
			if (!hasOs) {
				actions.push({
					title: "Add 'import os'",
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
									text: "import os\n",
								},
							},
						],
					},
				});
			}
		}

		if (line.includes("json.")) {
			const hasJson = lines.some((l) => l.includes("import json"));
			if (!hasJson) {
				actions.push({
					title: "Add 'import json'",
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
									text: "import json\n",
								},
							},
						],
					},
				});
			}
		}

		if (line.includes("datetime.")) {
			const hasDatetime = lines.some((l) => l.includes("import datetime"));
			if (!hasDatetime) {
				actions.push({
					title: "Add 'import datetime'",
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
									text: "import datetime\n",
								},
							},
						],
					},
				});
			}
		}

		// Quick fix for bare except
		if (line.trim() === "except:" || line.trim() === "except :") {
			actions.push({
				title: "Add Exception type",
				kind: "quickfix",
				edit: {
					edits: [
						{
							resource: model.uri,
							versionId: model.getVersionId(),
							textEdit: {
								range: {
									startLineNumber: range.startLineNumber,
									startColumn: line.indexOf("except") + 6,
									endLineNumber: range.startLineNumber,
									endColumn: line.indexOf("except") + 7,
								},
								text: " Exception",
							},
						},
					],
				},
			});
		}

		// Quick fix for old string formatting
		if (line.includes("print(") && line.includes("%")) {
			const printMatch = line.match(
				/print\s*\(\s*["']([^"']*?)["']\s*%\s*([^)]+)\)/,
			);
			if (printMatch) {
				const formatStr = printMatch[1];
				const args = printMatch[2];
				const fString = `f"${formatStr.replace(/%[sd]/g, (match) => {
					return match === "%s" ? `{${args.trim()}}` : `{${args.trim()}}`;
				})}"`;
				actions.push({
					title: "Convert to f-string",
					kind: "quickfix",
					edit: {
						edits: [
							{
								resource: model.uri,
								versionId: model.getVersionId(),
								textEdit: {
									range: {
										startLineNumber: range.startLineNumber,
										startColumn:
											line.indexOf('"') !== -1
												? line.indexOf('"')
												: line.indexOf("'"),
										endLineNumber: range.startLineNumber,
										endColumn: line.lastIndexOf(")") + 1,
									},
									text: fString,
								},
							},
						],
					},
				});
			}
		}

		return {
			actions,
			dispose: () => {},
		};
	},
});
