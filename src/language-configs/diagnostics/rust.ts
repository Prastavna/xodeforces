import * as monaco from "monaco-editor";

const validateModel = (model: monaco.editor.ITextModel) => {
	const markers: monaco.editor.IMarkerData[] = [];
	const lines = model.getLinesContent();

	for (let i = 0; i < lines.length; i++) {
		const line = lines[i];
		const lineNumber = i + 1;

		// Check for missing semicolons after statements
		const trimmedLine = line.trim();
		if (
			trimmedLine.length > 0 &&
			!trimmedLine.endsWith(";") &&
			!trimmedLine.endsWith("{") &&
			!trimmedLine.endsWith("}") &&
			!trimmedLine.endsWith(",") &&
			!trimmedLine.startsWith("//") &&
			!trimmedLine.startsWith("/*") &&
			!trimmedLine.includes("if") &&
			!trimmedLine.includes("else") &&
			!trimmedLine.includes("while") &&
			!trimmedLine.includes("for") &&
			!trimmedLine.includes("loop") &&
			!trimmedLine.includes("match") &&
			!trimmedLine.includes("fn") &&
			!trimmedLine.includes("struct") &&
			!trimmedLine.includes("enum") &&
			!trimmedLine.includes("impl") &&
			(trimmedLine.includes("let") ||
				trimmedLine.includes("println!") ||
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

		// Check for unused variables (variables starting with underscore are intentionally unused)
		if (line.includes("let ") && !line.includes("let _")) {
			const varMatch = line.match(/let\s+(\w+)/);
			if (varMatch) {
				const varName = varMatch[1];
				const isUsed = lines.some((l, idx) => idx > i && l.includes(varName));
				if (!isUsed) {
					markers.push({
						severity: monaco.MarkerSeverity.Warning,
						startLineNumber: lineNumber,
						startColumn: line.indexOf(varName),
						endLineNumber: lineNumber,
						endColumn: line.indexOf(varName) + varName.length,
						message: `Variable '${varName}' might be unused. Consider prefixing with underscore: '_${varName}'`,
						code: "unused-variable",
					});
				}
			}
		}

		// Check for missing main function
		if (i === lines.length - 1 && !lines.some((l) => l.includes("fn main("))) {
			markers.push({
				severity: monaco.MarkerSeverity.Warning,
				startLineNumber: 1,
				startColumn: 1,
				endLineNumber: 1,
				endColumn: 1,
				message: "Consider adding a main function: fn main() { }",
				code: "missing-main",
			});
		}
	}

	monaco.editor.setModelMarkers(model, "rust-diagnostics", markers);
};

// Set up diagnostics for Rust models
const onModelAdd = (model: monaco.editor.ITextModel) => {
	if (model.getLanguageId() === "rust") {
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
monaco.languages.registerCodeActionProvider("rust", {
	provideCodeActions: (model, range) => {
		const actions: monaco.languages.CodeAction[] = [];
		const line = model.getLineContent(range.startLineNumber);

		// Quick fix for unused variables
		const varMatch = line.match(/let\s+(\w+)/);
		if (varMatch) {
			const varName = varMatch[1];
			actions.push({
				title: `Prefix with underscore: _${varName}`,
				kind: "quickfix",
				edit: {
					edits: [
						{
							resource: model.uri,
							versionId: model.getVersionId(),
							textEdit: {
								range: {
									startLineNumber: range.startLineNumber,
									startColumn: line.indexOf(varName) + 1,
									endLineNumber: range.startLineNumber,
									endColumn: line.indexOf(varName) + 1,
								},
								text: "_",
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
