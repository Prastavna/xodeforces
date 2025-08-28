import * as monaco from "monaco-editor";

const validateModel = (model: monaco.editor.ITextModel) => {
	const markers: monaco.editor.IMarkerData[] = [];
	const lines = model.getLinesContent();

	for (let i = 0; i < lines.length; i++) {
		const line = lines[i];
		const lineNumber = i + 1;

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

		// Check for unused variables (basic check for := assignment)
		if (line.includes(":=") && !line.includes("_")) {
			const varName = line.split(":=")[0].trim();
			const isUsed = lines.some((l, idx) => idx > i && l.includes(varName));
			if (!isUsed && varName.length > 0) {
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
	}

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

		if (line.includes("fmt.")) {
			const lines = model.getLinesContent();
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

		return {
			actions,
			dispose: () => {},
		};
	},
});
