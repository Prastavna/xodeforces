import * as monaco from "monaco-editor";

const validateModel = (model: monaco.editor.ITextModel) => {
	const markers: monaco.editor.IMarkerData[] = [];
	const lines = model.getLinesContent();

	// Track table aliases and their usage
	const tableAliases: { [key: string]: { line: number; table: string } } = {};

	for (let i = 0; i < lines.length; i++) {
		const line = lines[i];
		const lineNumber = i + 1;
		const trimmedLine = line.trim().toLowerCase();
		const originalLine = line.trim();

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

		// Check for SELECT * usage
		if (trimmedLine.includes("select *")) {
			markers.push({
				severity: monaco.MarkerSeverity.Info,
				startLineNumber: lineNumber,
				startColumn: line.toLowerCase().indexOf("select *"),
				endLineNumber: lineNumber,
				endColumn: line.toLowerCase().indexOf("select *") + 8,
				message:
					"Consider specifying column names instead of SELECT *. Improves performance and maintainability.",
				code: "select-star",
			});
		}

		// Check for implicit JOINs (comma-separated tables)
		if (
			trimmedLine.includes("from") &&
			trimmedLine.includes(",") &&
			!trimmedLine.includes("join")
		) {
			const fromIndex = trimmedLine.indexOf("from");
			const commaIndex = trimmedLine.indexOf(",", fromIndex);
			if (commaIndex !== -1) {
				markers.push({
					severity: monaco.MarkerSeverity.Warning,
					startLineNumber: lineNumber,
					startColumn: commaIndex,
					endLineNumber: lineNumber,
					endColumn: commaIndex + 1,
					message:
						"Consider using explicit JOIN syntax instead of implicit joins",
					code: "implicit-join",
				});
			}
		}

		// Check for missing WHERE clause in UPDATE/DELETE
		if (
			(trimmedLine.startsWith("update") || trimmedLine.startsWith("delete")) &&
			!trimmedLine.includes("where")
		) {
			markers.push({
				severity: monaco.MarkerSeverity.Warning,
				startLineNumber: lineNumber,
				startColumn: 1,
				endLineNumber: lineNumber,
				endColumn: line.length + 1,
				message:
					"UPDATE/DELETE without WHERE clause will affect all rows. Add WHERE clause to be safe.",
				code: "missing-where",
			});
		}

		// Check for subqueries without aliases
		if (
			trimmedLine.includes("select") &&
			trimmedLine.includes("(") &&
			trimmedLine.includes(")")
		) {
			const subqueryMatch = trimmedLine.match(/\(select[^)]*\)/);
			if (
				subqueryMatch &&
				!trimmedLine.includes(" as ") &&
				!trimmedLine.includes(") as")
			) {
				markers.push({
					severity: monaco.MarkerSeverity.Info,
					startLineNumber: lineNumber,
					startColumn: trimmedLine.indexOf(subqueryMatch[0]),
					endLineNumber: lineNumber,
					endColumn:
						trimmedLine.indexOf(subqueryMatch[0]) + subqueryMatch[0].length,
					message:
						"Consider adding an alias to the subquery for better readability",
					code: "subquery-alias",
				});
			}
		}

		// Check for NOT IN with NULL values
		if (trimmedLine.includes("not in") && trimmedLine.includes("null")) {
			markers.push({
				severity: monaco.MarkerSeverity.Warning,
				startLineNumber: lineNumber,
				startColumn: trimmedLine.indexOf("not in"),
				endLineNumber: lineNumber,
				endColumn: trimmedLine.indexOf("not in") + 6,
				message:
					"NOT IN with NULL values can produce unexpected results. Consider using NOT EXISTS instead.",
				code: "not-in-null",
			});
		}

		// Check for ORDER BY without LIMIT
		if (
			trimmedLine.includes("order by") &&
			!trimmedLine.includes("limit") &&
			!trimmedLine.includes("top")
		) {
			markers.push({
				severity: monaco.MarkerSeverity.Info,
				startLineNumber: lineNumber,
				startColumn: trimmedLine.indexOf("order by"),
				endLineNumber: lineNumber,
				endColumn: trimmedLine.indexOf("order by") + 8,
				message:
					"ORDER BY without LIMIT can be slow on large tables. Consider adding LIMIT or using indexed columns.",
				code: "orderby-performance",
			});
		}

		// Check for LIKE without wildcards
		if (trimmedLine.includes(" like ")) {
			const likeMatch = trimmedLine.match(/like\s+['"]([^'%"]*)['"]/);
			if (
				likeMatch &&
				!likeMatch[1].includes("%") &&
				!likeMatch[1].includes("_")
			) {
				markers.push({
					severity: monaco.MarkerSeverity.Info,
					startLineNumber: lineNumber,
					startColumn: trimmedLine.indexOf("like"),
					endLineNumber: lineNumber,
					endColumn: trimmedLine.indexOf("like") + 4,
					message:
						"LIKE without wildcards (%) performs exact match. Consider using = instead.",
					code: "like-without-wildcard",
				});
			}
		}

		// Check for UNION without ALL when duplicates are expected
		if (
			trimmedLine.includes(" union ") &&
			!trimmedLine.includes(" union all ")
		) {
			markers.push({
				severity: monaco.MarkerSeverity.Info,
				startLineNumber: lineNumber,
				startColumn: trimmedLine.indexOf("union"),
				endLineNumber: lineNumber,
				endColumn: trimmedLine.indexOf("union") + 5,
				message:
					"UNION removes duplicates. Use UNION ALL if duplicates are acceptable for better performance.",
				code: "union-vs-union-all",
			});
		}

		// Check for GROUP BY without aggregate functions
		if (trimmedLine.includes("group by")) {
			const selectPart = trimmedLine.split("from")[0];
			const hasAggregate =
				selectPart.includes("count(") ||
				selectPart.includes("sum(") ||
				selectPart.includes("avg(") ||
				selectPart.includes("min(") ||
				selectPart.includes("max(");
			if (!hasAggregate) {
				markers.push({
					severity: monaco.MarkerSeverity.Warning,
					startLineNumber: lineNumber,
					startColumn: trimmedLine.indexOf("group by"),
					endLineNumber: lineNumber,
					endColumn: trimmedLine.indexOf("group by") + 8,
					message:
						"GROUP BY without aggregate functions. Each group will return only one row.",
					code: "groupby-without-aggregate",
				});
			}
		}

		// Check for DISTINCT without ORDER BY
		if (
			trimmedLine.includes("select distinct") &&
			!trimmedLine.includes("order by")
		) {
			markers.push({
				severity: monaco.MarkerSeverity.Info,
				startLineNumber: lineNumber,
				startColumn: trimmedLine.indexOf("distinct"),
				endLineNumber: lineNumber,
				endColumn: trimmedLine.indexOf("distinct") + 8,
				message:
					"DISTINCT without ORDER BY can return results in unpredictable order.",
				code: "distinct-without-order",
			});
		}

		// Check for table aliases
		const aliasMatch = originalLine.match(
			/(\w+)\s+(\w+)\s*($|on|where|group|order|having|limit)/i,
		);
		if (aliasMatch && aliasMatch[2].length <= 3) {
			tableAliases[aliasMatch[2]] = { line: lineNumber, table: aliasMatch[1] };
		}

		// Check for magic numbers in SQL
		const numberMatch = trimmedLine.match(/\b(\d{2,})\b/);
		if (
			numberMatch &&
			!trimmedLine.includes("limit") &&
			!trimmedLine.includes("top")
		) {
			const number = numberMatch[1];
			if (parseInt(number) > 10) {
				markers.push({
					severity: monaco.MarkerSeverity.Info,
					startLineNumber: lineNumber,
					startColumn: trimmedLine.indexOf(number),
					endLineNumber: lineNumber,
					endColumn: trimmedLine.indexOf(number) + number.length,
					message:
						"Consider using named constants or parameters instead of magic numbers",
					code: "magic-number-sql",
				});
			}
		}
	}

	// Check for unused table aliases
	Object.entries(tableAliases).forEach(([alias, info]) => {
		let aliasUsed = false;
		for (let i = info.line; i < lines.length; i++) {
			if (lines[i].includes(alias + ".") || lines[i].includes(alias + " ")) {
				aliasUsed = true;
				break;
			}
		}
		if (!aliasUsed) {
			markers.push({
				severity: monaco.MarkerSeverity.Warning,
				startLineNumber: info.line,
				startColumn: lines[info.line - 1].indexOf(alias),
				endLineNumber: info.line,
				endColumn: lines[info.line - 1].indexOf(alias) + alias.length,
				message: `Table alias '${alias}' is defined but never used`,
				code: "unused-alias",
			});
		}
	});

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
		const trimmedLine = line.trim().toLowerCase();

		// Quick fix for missing semicolons
		if (
			!line.trim().endsWith(";") &&
			(trimmedLine.includes("select") ||
				trimmedLine.includes("insert") ||
				trimmedLine.includes("update"))
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

		// Quick fix for implicit joins
		if (
			trimmedLine.includes("from") &&
			trimmedLine.includes(",") &&
			!trimmedLine.includes("join")
		) {
			const fromIndex = trimmedLine.indexOf("from");
			const commaIndex = trimmedLine.indexOf(",", fromIndex);
			if (commaIndex !== -1) {
				actions.push({
					title: "Convert to explicit JOIN",
					kind: "quickfix",
					edit: {
						edits: [
							{
								resource: model.uri,
								versionId: model.getVersionId(),
								textEdit: {
									range: {
										startLineNumber: range.startLineNumber,
										startColumn: commaIndex,
										endLineNumber: range.startLineNumber,
										endColumn: commaIndex + 1,
									},
									text: " JOIN",
								},
							},
						],
					},
				});
			}
		}

		// Quick fix for UNION vs UNION ALL
		if (
			trimmedLine.includes(" union ") &&
			!trimmedLine.includes(" union all ")
		) {
			const unionIndex = trimmedLine.indexOf("union");
			actions.push({
				title: "Use UNION ALL for better performance",
				kind: "quickfix",
				edit: {
					edits: [
						{
							resource: model.uri,
							versionId: model.getVersionId(),
							textEdit: {
								range: {
									startLineNumber: range.startLineNumber,
									startColumn: unionIndex + 5,
									endLineNumber: range.startLineNumber,
									endColumn: unionIndex + 5,
								},
								text: " ALL",
							},
						},
					],
				},
			});
		}

		// Quick fix for LIKE without wildcards
		if (trimmedLine.includes(" like ")) {
			const likeMatch = trimmedLine.match(/like\s+['"]([^'%"]*)['"]/);
			if (
				likeMatch &&
				!likeMatch[1].includes("%") &&
				!likeMatch[1].includes("_")
			) {
				const likeIndex = trimmedLine.indexOf("like");
				actions.push({
					title: "Replace LIKE with = for exact match",
					kind: "quickfix",
					edit: {
						edits: [
							{
								resource: model.uri,
								versionId: model.getVersionId(),
								textEdit: {
									range: {
										startLineNumber: range.startLineNumber,
										startColumn: likeIndex,
										endLineNumber: range.startLineNumber,
										endColumn: likeIndex + 4,
									},
									text: "=",
								},
							},
						],
					},
				});
			}
		}

		// Quick fix for NOT IN with NULL
		if (trimmedLine.includes("not in") && trimmedLine.includes("null")) {
			const notInIndex = trimmedLine.indexOf("not in");
			actions.push({
				title: "Replace NOT IN with NOT EXISTS",
				kind: "quickfix",
				edit: {
					edits: [
						{
							resource: model.uri,
							versionId: model.getVersionId(),
							textEdit: {
								range: {
									startLineNumber: range.startLineNumber,
									startColumn: notInIndex,
									endLineNumber: range.startLineNumber,
									endColumn: notInIndex + 6,
								},
								text: "NOT EXISTS (SELECT 1 FROM",
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
