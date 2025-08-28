import * as monaco from "monaco-editor";

const validateModel = (model: monaco.editor.ITextModel) => {
	const markers: monaco.editor.IMarkerData[] = [];
	const lines = model.getLinesContent();

	for (let i = 0; i < lines.length; i++) {
		const line = lines[i];
		const lineNumber = i + 1;
		const trimmedLine = line.trim().toLowerCase();

		// Check for missing semicolons at end of statements
		if (
			trimmedLine.length > 0 &&
			!trimmedLine.endsWith(";") &&
			!trimmedLine.startsWith("--") &&
			!trimmedLine.startsWith("/*") &&
			(trimmedLine.startsWith("select") ||
				trimmedLine.startsWith("insert") ||
				trimmedLine.startsWith("update") ||
				trimmedLine.startsWith("delete") ||
				trimmedLine.startsWith("create") ||
				trimmedLine.startsWith("drop") ||
				trimmedLine.startsWith("alter"))
		) {
			markers.push({
				severity: monaco.MarkerSeverity.Warning,
				startLineNumber: lineNumber,
				startColumn: line.length,
				endLineNumber: lineNumber,
				endColumn: line.length + 1,
				message: "Consider adding semicolon at end of SQL statement",
				code: "missing-semicolon",
			});
		}

		// Check for SELECT without FROM (basic check)
		if (
			trimmedLine.includes("select") &&
			!trimmedLine.includes("from") &&
			!trimmedLine.includes("1") &&
			!trimmedLine.includes("*")
		) {
			markers.push({
				severity: monaco.MarkerSeverity.Warning,
				startLineNumber: lineNumber,
				startColumn: 1,
				endLineNumber: lineNumber,
				endColumn: line.length + 1,
				message: "SELECT statement might be missing FROM clause",
				code: "missing-from",
			});
		}

		// Check for unquoted string values in WHERE clauses
		if (trimmedLine.includes("where") && trimmedLine.includes("=")) {
			const afterEquals = trimmedLine.split("=")[1];
			if (
				afterEquals &&
				afterEquals.trim() &&
				!afterEquals.includes("'") &&
				!afterEquals.includes('"') &&
				isNaN(Number(afterEquals.trim().split(" ")[0]))
			) {
				markers.push({
					severity: monaco.MarkerSeverity.Error,
					startLineNumber: lineNumber,
					startColumn: 1,
					endLineNumber: lineNumber,
					endColumn: line.length + 1,
					message: "String values should be quoted in SQL",
					code: "unquoted-string",
				});
			}
		}
	}

	monaco.editor.setModelMarkers(model, "sql-diagnostics", markers);
};

// Set up diagnostics for SQL models
const onModelAdd = (model: monaco.editor.ITextModel) => {
	if (model.getLanguageId() === "sql") {
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
monaco.languages.registerCodeActionProvider("sql", {
	provideCodeActions: (model, range) => {
		const actions: monaco.languages.CodeAction[] = [];
		const line = model.getLineContent(range.startLineNumber);

		// Quick fix for missing semicolons
		if (
			!line.trim().endsWith(";") &&
			(line.toLowerCase().includes("select") ||
				line.toLowerCase().includes("insert") ||
				line.toLowerCase().includes("update"))
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
