import * as monaco from "monaco-editor";

const validateModel = (model: monaco.editor.ITextModel) => {
	const markers: monaco.editor.IMarkerData[] = [];
	const lines = model.getLinesContent();

	for (let i = 0; i < lines.length; i++) {
		const line = lines[i];
		const lineNumber = i + 1;

		// Check for missing opening PHP tag
		if (i === 0 && !line.includes("<?php")) {
			markers.push({
				severity: monaco.MarkerSeverity.Error,
				startLineNumber: lineNumber,
				startColumn: 1,
				endLineNumber: lineNumber,
				endColumn: line.length + 1,
				message: "Missing opening PHP tag: <?php",
				code: "missing-php-tag",
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
			!trimmedLine.startsWith("<?php") &&
			!trimmedLine.includes("if") &&
			!trimmedLine.includes("else") &&
			!trimmedLine.includes("while") &&
			!trimmedLine.includes("for") &&
			!trimmedLine.includes("foreach") &&
			!trimmedLine.includes("switch") &&
			!trimmedLine.includes("function") &&
			!trimmedLine.includes("class") &&
			(trimmedLine.includes("$") ||
				trimmedLine.includes("echo") ||
				trimmedLine.includes("print") ||
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

		// Check for variables without $ prefix
		const varMatch = line.match(/\b([a-zA-Z_][a-zA-Z0-9_]*)\s*=/);
		if (
			varMatch &&
			!varMatch[0].includes("$") &&
			!line.includes("function") &&
			!line.includes("class")
		) {
			const varName = varMatch[1];
			markers.push({
				severity: monaco.MarkerSeverity.Error,
				startLineNumber: lineNumber,
				startColumn: line.indexOf(varName),
				endLineNumber: lineNumber,
				endColumn: line.indexOf(varName) + varName.length,
				message: `PHP variables must start with $: $${varName}`,
				code: "missing-dollar-sign",
			});
		}
	}

	monaco.editor.setModelMarkers(model, "php-diagnostics", markers);
};

// Set up diagnostics for PHP models
const onModelAdd = (model: monaco.editor.ITextModel) => {
	if (model.getLanguageId() === "php") {
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
monaco.languages.registerCodeActionProvider("php", {
	provideCodeActions: (model, range) => {
		const actions: monaco.languages.CodeAction[] = [];
		const line = model.getLineContent(range.startLineNumber);

		// Quick fix for missing PHP tag
		if (range.startLineNumber === 1 && !line.includes("<?php")) {
			actions.push({
				title: "Add <?php opening tag",
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
								text: "<?php\n",
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
