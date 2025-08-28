import * as monaco from "monaco-editor";

const validateModel = (model: monaco.editor.ITextModel) => {
	const markers: monaco.editor.IMarkerData[] = [];
	const lines = model.getLinesContent();

	for (let i = 0; i < lines.length; i++) {
		const line = lines[i];
		const lineNumber = i + 1;

		// Check for missing includes
		if (
			line.includes("cout") ||
			line.includes("cin") ||
			line.includes("endl")
		) {
			const includeExists = lines.some((l) =>
				l.includes("#include <iostream>"),
			);
			if (!includeExists) {
				markers.push({
					severity: monaco.MarkerSeverity.Error,
					startLineNumber: lineNumber,
					startColumn: 1,
					endLineNumber: lineNumber,
					endColumn: line.length + 1,
					message: "Missing #include <iostream> for cout/cin/endl",
					code: "missing-iostream",
				});
			}
		}

		if (line.includes("vector") || line.includes("string")) {
			const hasVector = lines.some((l) => l.includes("#include <vector>"));
			const hasString = lines.some((l) => l.includes("#include <string>"));
			if (line.includes("vector") && !hasVector) {
				markers.push({
					severity: monaco.MarkerSeverity.Error,
					startLineNumber: lineNumber,
					startColumn: line.indexOf("vector"),
					endLineNumber: lineNumber,
					endColumn: line.indexOf("vector") + 6,
					message: "Missing #include <vector>",
					code: "missing-vector",
				});
			}
			if (line.includes("string") && !hasString) {
				markers.push({
					severity: monaco.MarkerSeverity.Error,
					startLineNumber: lineNumber,
					startColumn: line.indexOf("string"),
					endLineNumber: lineNumber,
					endColumn: line.indexOf("string") + 6,
					message: "Missing #include <string>",
					code: "missing-string",
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
				trimmedLine.includes("cout") ||
				trimmedLine.includes("cin") ||
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

	monaco.editor.setModelMarkers(model, "cpp-diagnostics", markers);
};

// Set up diagnostics for C++ models
const onModelAdd = (model: monaco.editor.ITextModel) => {
	if (model.getLanguageId() === "cpp") {
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
monaco.languages.registerCodeActionProvider("cpp", {
	provideCodeActions: (model, range) => {
		const actions: monaco.languages.CodeAction[] = [];
		const line = model.getLineContent(range.startLineNumber);

		if (
			line.includes("cout") ||
			line.includes("cin") ||
			line.includes("endl")
		) {
			const lines = model.getLinesContent();
			const hasIostream = lines.some((l) => l.includes("#include <iostream>"));

			if (!hasIostream) {
				actions.push({
					title: "Add #include <iostream>",
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
									text: "#include <iostream>\n",
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
