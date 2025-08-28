import * as monaco from "monaco-editor";

const validateModel = (model: monaco.editor.ITextModel) => {
	const markers: monaco.editor.IMarkerData[] = [];
	const lines = model.getLinesContent();

	for (let i = 0; i < lines.length; i++) {
		const line = lines[i];
		const lineNumber = i + 1;

		// Check for missing using statements
		if (
			line.includes("Console.") &&
			!lines.some((l) => l.includes("using System;"))
		) {
			markers.push({
				severity: monaco.MarkerSeverity.Error,
				startLineNumber: lineNumber,
				startColumn: 1,
				endLineNumber: lineNumber,
				endColumn: line.length + 1,
				message: "Missing 'using System;'",
				code: "missing-system-using",
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
			!trimmedLine.startsWith("using") &&
			!trimmedLine.startsWith("namespace") &&
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
				trimmedLine.includes("Console.Write") ||
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
	}

	monaco.editor.setModelMarkers(model, "csharp-diagnostics", markers);
};

// Set up diagnostics for C# models
const onModelAdd = (model: monaco.editor.ITextModel) => {
	if (model.getLanguageId() === "csharp") {
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
monaco.languages.registerCodeActionProvider("csharp", {
	provideCodeActions: (model, range) => {
		const actions: monaco.languages.CodeAction[] = [];
		const line = model.getLineContent(range.startLineNumber);

		if (line.includes("Console.")) {
			const lines = model.getLinesContent();
			const hasSystem = lines.some((l) => l.includes("using System;"));

			if (!hasSystem) {
				actions.push({
					title: "Add 'using System;'",
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
									text: "using System;\n",
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
