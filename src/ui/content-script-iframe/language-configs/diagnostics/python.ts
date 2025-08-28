import * as monaco from "monaco-editor";

const validateModel = (model: monaco.editor.ITextModel) => {
	const markers: monaco.editor.IMarkerData[] = [];
	const lines = model.getLinesContent();

	for (let i = 0; i < lines.length; i++) {
		const line = lines[i];
		const lineNumber = i + 1;

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
		const trimmedLine = line.trim();
		if (
			(trimmedLine.startsWith("if ") ||
				trimmedLine.startsWith("elif ") ||
				trimmedLine.startsWith("else") ||
				trimmedLine.startsWith("for ") ||
				trimmedLine.startsWith("while ") ||
				trimmedLine.startsWith("def ") ||
				trimmedLine.startsWith("class ")) &&
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
	}

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

		// Quick fix for missing imports
		if (line.includes("math.")) {
			const lines = model.getLinesContent();
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

		return {
			actions,
			dispose: () => {},
		};
	},
});
