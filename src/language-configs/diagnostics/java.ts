import * as monaco from "monaco-editor";

const validateModel = (model: monaco.editor.ITextModel) => {
	const markers: monaco.editor.IMarkerData[] = [];
	const lines = model.getLinesContent();

	// Track variables for unused variable detection
	const variables: {
		[key: string]: { line: number; used: boolean; type: string };
	} = {};
	let braceCount = 0;

	for (let i = 0; i < lines.length; i++) {
		const line = lines[i];
		const lineNumber = i + 1;
		const trimmedLine = line.trim();

		// Track brace count for method scope
		if (trimmedLine.includes("{")) braceCount++;
		if (trimmedLine.includes("}")) braceCount--;

		// Track method context (for future enhancements)

		// Check for missing imports
		if (
			line.includes("Scanner") &&
			!lines.some((l) => l.includes("import java.util.Scanner"))
		) {
			markers.push({
				severity: monaco.MarkerSeverity.Error,
				startLineNumber: lineNumber,
				startColumn: 1,
				endLineNumber: lineNumber,
				endColumn: line.length + 1,
				message: "Missing 'import java.util.Scanner;'",
				code: "missing-scanner-import",
			});
		}

		if (
			line.includes("ArrayList") &&
			!lines.some((l) => l.includes("import java.util.ArrayList"))
		) {
			markers.push({
				severity: monaco.MarkerSeverity.Error,
				startLineNumber: lineNumber,
				startColumn: 1,
				endLineNumber: lineNumber,
				endColumn: line.length + 1,
				message: "Missing 'import java.util.ArrayList;'",
				code: "missing-arraylist-import",
			});
		}

		if (
			line.includes("HashMap") &&
			!lines.some((l) => l.includes("import java.util.HashMap"))
		) {
			markers.push({
				severity: monaco.MarkerSeverity.Error,
				startLineNumber: lineNumber,
				startColumn: 1,
				endLineNumber: lineNumber,
				endColumn: line.length + 1,
				message: "Missing 'import java.util.HashMap;'",
				code: "missing-hashmap-import",
			});
		}

		if (
			line.includes("LinkedList") &&
			!lines.some((l) => l.includes("import java.util.LinkedList"))
		) {
			markers.push({
				severity: monaco.MarkerSeverity.Error,
				startLineNumber: lineNumber,
				startColumn: 1,
				endLineNumber: lineNumber,
				endColumn: line.length + 1,
				message: "Missing 'import java.util.LinkedList;'",
				code: "missing-linkedlist-import",
			});
		}

		if (
			line.includes("File") &&
			!lines.some((l) => l.includes("import java.io.File"))
		) {
			markers.push({
				severity: monaco.MarkerSeverity.Error,
				startLineNumber: lineNumber,
				startColumn: 1,
				endLineNumber: lineNumber,
				endColumn: line.length + 1,
				message: "Missing 'import java.io.File;'",
				code: "missing-file-import",
			});
		}

		if (
			line.includes("IOException") &&
			!lines.some((l) => l.includes("import java.io.IOException"))
		) {
			markers.push({
				severity: monaco.MarkerSeverity.Error,
				startLineNumber: lineNumber,
				startColumn: 1,
				endLineNumber: lineNumber,
				endColumn: line.length + 1,
				message: "Missing 'import java.io.IOException;'",
				code: "missing-ioexception-import",
			});
		}

		// Track variable declarations
		const varMatch = trimmedLine.match(/(\w+)\s+(\w+)\s*=\s*[^;]*/);
		if (
			varMatch &&
			!trimmedLine.includes("if") &&
			!trimmedLine.includes("for") &&
			!trimmedLine.includes("while")
		) {
			const type = varMatch[1];
			const varName = varMatch[2];
			if (
				type !== "int" &&
				type !== "double" &&
				type !== "String" &&
				type !== "boolean" &&
				type !== "char" &&
				type !== "float" &&
				type !== "long" &&
				type !== "short" &&
				type !== "byte"
			) {
				// Skip if it's not a primitive type (likely a class)
				variables[varName] = { line: lineNumber, used: false, type };
			}
		}

		// Mark variables as used when referenced
		Object.keys(variables).forEach((varName) => {
			if (
				line.includes(varName) &&
				!line.includes(`=`) &&
				!line.includes(varName + " ")
			) {
				variables[varName].used = true;
			}
		});

		// Check for missing semicolons
		if (
			trimmedLine.length > 0 &&
			!trimmedLine.endsWith(";") &&
			!trimmedLine.endsWith("{") &&
			!trimmedLine.endsWith("}") &&
			!trimmedLine.startsWith("//") &&
			!trimmedLine.startsWith("/*") &&
			!trimmedLine.startsWith("import") &&
			!trimmedLine.startsWith("package") &&
			!trimmedLine.includes("if") &&
			!trimmedLine.includes("else") &&
			!trimmedLine.includes("while") &&
			!trimmedLine.includes("for") &&
			!trimmedLine.includes("do") &&
			!trimmedLine.includes("switch") &&
			!trimmedLine.includes("class") &&
			!trimmedLine.includes("public") &&
			!trimmedLine.includes("private") &&
			!trimmedLine.includes("protected") &&
			(trimmedLine.includes("=") ||
				trimmedLine.includes("System.out.print") ||
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

		// Check for main method signature
		if (
			line.includes("main") &&
			line.includes("(") &&
			!line.includes("public static void main(String[] args)")
		) {
			if (line.includes("main") && !line.includes("public static void")) {
				markers.push({
					severity: monaco.MarkerSeverity.Warning,
					startLineNumber: lineNumber,
					startColumn: 1,
					endLineNumber: lineNumber,
					endColumn: line.length + 1,
					message:
						"Consider using standard main method signature: public static void main(String[] args)",
					code: "main-signature",
				});
			}
		}

		// Check for empty catch blocks
		if (
			trimmedLine.includes("catch") &&
			trimmedLine.includes("{") &&
			trimmedLine.includes("}")
		) {
			markers.push({
				severity: monaco.MarkerSeverity.Warning,
				startLineNumber: lineNumber,
				startColumn: 1,
				endLineNumber: lineNumber,
				endColumn: line.length + 1,
				message:
					"Empty catch block. Consider handling the exception or logging it.",
				code: "empty-catch",
			});
		}

		// Check for System.out.println without proper exception handling
		if (
			trimmedLine.includes("System.out.println") &&
			!lines.some((l, idx) => idx > i && l.includes("IOException"))
		) {
			// This is a basic check - in real scenarios, we'd need more sophisticated analysis
		}

		// Check for magic numbers
		const magicNumberMatch = trimmedLine.match(/=\s*(\d+)/);
		if (
			magicNumberMatch &&
			magicNumberMatch[1] !== "0" &&
			magicNumberMatch[1] !== "1" &&
			!trimmedLine.includes("final") &&
			!trimmedLine.includes("static")
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

		// Check for missing access modifiers on methods
		if (
			trimmedLine.includes("(") &&
			trimmedLine.includes(")") &&
			trimmedLine.includes("{") &&
			!trimmedLine.includes("public") &&
			!trimmedLine.includes("private") &&
			!trimmedLine.includes("protected")
		) {
			if (
				!trimmedLine.includes("class") &&
				!trimmedLine.includes("interface")
			) {
				markers.push({
					severity: monaco.MarkerSeverity.Info,
					startLineNumber: lineNumber,
					startColumn: 1,
					endLineNumber: lineNumber,
					endColumn: trimmedLine.indexOf("("),
					message:
						"Consider adding an access modifier (public, private, or protected)",
					code: "missing-access-modifier",
				});
			}
		}
	}

	// Check for unused variables
	Object.entries(variables).forEach(([varName, info]) => {
		if (!info.used && braceCount === 0) {
			// Only check if we're back at class level
			markers.push({
				severity: monaco.MarkerSeverity.Warning,
				startLineNumber: info.line,
				startColumn: lines[info.line - 1].indexOf(varName),
				endLineNumber: info.line,
				endColumn: lines[info.line - 1].indexOf(varName) + varName.length,
				message: `Unused variable: '${varName}'`,
				code: "unused-variable",
			});
		}
	});

	monaco.editor.setModelMarkers(model, "java-diagnostics", markers);
};

// Set up diagnostics for Java models
const onModelAdd = (model: monaco.editor.ITextModel) => {
	if (model.getLanguageId() === "java") {
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
monaco.languages.registerCodeActionProvider("java", {
	provideCodeActions: (model, range) => {
		const actions: monaco.languages.CodeAction[] = [];
		const line = model.getLineContent(range.startLineNumber);
		const lines = model.getLinesContent();

		// Quick fix for missing imports
		if (line.includes("Scanner")) {
			const hasScanner = lines.some((l) =>
				l.includes("import java.util.Scanner"),
			);
			if (!hasScanner) {
				actions.push({
					title: "Add 'import java.util.Scanner;'",
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
									text: "import java.util.Scanner;\n",
								},
							},
						],
					},
				});
			}
		}

		if (line.includes("ArrayList")) {
			const hasArrayList = lines.some((l) =>
				l.includes("import java.util.ArrayList"),
			);
			if (!hasArrayList) {
				actions.push({
					title: "Add 'import java.util.ArrayList;'",
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
									text: "import java.util.ArrayList;\n",
								},
							},
						],
					},
				});
			}
		}

		if (line.includes("HashMap")) {
			const hasHashMap = lines.some((l) =>
				l.includes("import java.util.HashMap"),
			);
			if (!hasHashMap) {
				actions.push({
					title: "Add 'import java.util.HashMap;'",
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
									text: "import java.util.HashMap;\n",
								},
							},
						],
					},
				});
			}
		}

		if (line.includes("LinkedList")) {
			const hasLinkedList = lines.some((l) =>
				l.includes("import java.util.LinkedList"),
			);
			if (!hasLinkedList) {
				actions.push({
					title: "Add 'import java.util.LinkedList;'",
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
									text: "import java.util.LinkedList;\n",
								},
							},
						],
					},
				});
			}
		}

		if (line.includes("File")) {
			const hasFile = lines.some((l) => l.includes("import java.io.File"));
			if (!hasFile) {
				actions.push({
					title: "Add 'import java.io.File;'",
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
									text: "import java.io.File;\n",
								},
							},
						],
					},
				});
			}
		}

		if (line.includes("IOException")) {
			const hasIOException = lines.some((l) =>
				l.includes("import java.io.IOException"),
			);
			if (!hasIOException) {
				actions.push({
					title: "Add 'import java.io.IOException;'",
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
									text: "import java.io.IOException;\n",
								},
							},
						],
					},
				});
			}
		}

		// Quick fix for empty catch blocks
		if (line.includes("catch") && line.includes("{") && line.includes("}")) {
			actions.push({
				title: "Add exception handling",
				kind: "quickfix",
				edit: {
					edits: [
						{
							resource: model.uri,
							versionId: model.getVersionId(),
							textEdit: {
								range: {
									startLineNumber: range.startLineNumber,
									startColumn: line.indexOf("{") + 1,
									endLineNumber: range.startLineNumber,
									endColumn: line.indexOf("}"),
								},
								text: "\n            // TODO: Handle exception\n            e.printStackTrace();\n        ",
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
