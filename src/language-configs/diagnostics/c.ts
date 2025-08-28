import * as monaco from "monaco-editor";

const validateModel = (model: monaco.editor.ITextModel) => {
	const markers: monaco.editor.IMarkerData[] = [];
	const lines = model.getLinesContent();

	for (let i = 0; i < lines.length; i++) {
		const line = lines[i];
		const lineNumber = i + 1;

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

		// Check for missing semicolons
		const trimmedLine = line.trim();
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
	}

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

		// Quick fix for missing includes
		if (line.includes("printf") || line.includes("scanf")) {
			const lines = model.getLinesContent();
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

		return {
			actions,
			dispose: () => {},
		};
	},
});
