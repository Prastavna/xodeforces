import * as monaco from "monaco-editor";

const validateModel = (model: monaco.editor.ITextModel) => {
	const markers: monaco.editor.IMarkerData[] = [];
	const lines = model.getLinesContent();

	for (let i = 0; i < lines.length; i++) {
		const line = lines[i];
		const lineNumber = i + 1;

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

		// Check for missing semicolons
		const trimmedLine = line.trim();
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
	}

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

		// Quick fix for missing imports
		if (line.includes("Scanner")) {
			const lines = model.getLinesContent();
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

		return {
			actions,
			dispose: () => {},
		};
	},
});
