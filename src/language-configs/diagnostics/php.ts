import * as monaco from "monaco-editor";

const validateModel = (model: monaco.editor.ITextModel) => {
	const markers: monaco.editor.IMarkerData[] = [];
	const lines = model.getLinesContent();

	// Track security-related patterns

	for (let i = 0; i < lines.length; i++) {
		const line = lines[i];
		const lineNumber = i + 1;
		const trimmedLine = line.trim();

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

		// Check for deprecated functions
		const deprecatedFunctions = [
			"mysql_connect",
			"mysql_query",
			"mysql_fetch_array",
			"mysql_close",
			"ereg",
			"eregi",
			"ereg_replace",
			"eregi_replace",
			"split",
			"spliti",
			"session_register",
			"session_unregister",
			"session_is_registered",
		];

		for (const func of deprecatedFunctions) {
			if (trimmedLine.includes(func + "(")) {
				markers.push({
					severity: monaco.MarkerSeverity.Warning,
					startLineNumber: lineNumber,
					startColumn: line.indexOf(func),
					endLineNumber: lineNumber,
					endColumn: line.indexOf(func) + func.length,
					message: `Function '${func}' is deprecated. Consider using modern alternatives.`,
					code: "deprecated-function",
				});
			}
		}

		// Check for SQL injection vulnerabilities
		if (
			trimmedLine.includes("mysql_query(") ||
			trimmedLine.includes("mysqli_query(")
		) {
			const queryMatch = trimmedLine.match(
				/(mysql_query|mysqli_query)\s*\(\s*([^)]*)\)/,
			);
			if (queryMatch) {
				const queryContent = queryMatch[2];
				if (
					queryContent.includes("$_") &&
					!queryContent.includes("mysqli_real_escape_string") &&
					!queryContent.includes("PDO::prepare")
				) {
					markers.push({
						severity: monaco.MarkerSeverity.Error,
						startLineNumber: lineNumber,
						startColumn: 1,
						endLineNumber: lineNumber,
						endColumn: line.length + 1,
						message:
							"Potential SQL injection vulnerability. Use prepared statements or escape user input.",
						code: "sql-injection-risk",
					});
				}
			}
		}

		// Check for XSS vulnerabilities
		if (trimmedLine.includes("echo") || trimmedLine.includes("print")) {
			const outputMatch = trimmedLine.match(/(echo|print)\s+(.+)/);
			if (outputMatch) {
				const outputContent = outputMatch[2];
				if (
					outputContent.includes("$_") &&
					!outputContent.includes("htmlspecialchars") &&
					!outputContent.includes("htmlentities")
				) {
					markers.push({
						severity: monaco.MarkerSeverity.Warning,
						startLineNumber: lineNumber,
						startColumn: 1,
						endLineNumber: lineNumber,
						endColumn: line.length + 1,
						message:
							"Potential XSS vulnerability. Use htmlspecialchars() to escape output.",
						code: "xss-risk",
					});
				}
			}
		}

		// Check for missing error reporting
		if (i === 0 && !lines.some((l) => l.includes("error_reporting"))) {
			markers.push({
				severity: monaco.MarkerSeverity.Info,
				startLineNumber: 1,
				startColumn: 1,
				endLineNumber: 1,
				endColumn: 1,
				message: "Consider setting error_reporting for better debugging",
				code: "missing-error-reporting",
			});
		}

		// Check for functions without type declarations (PHP 7+)
		if (trimmedLine.includes("function ")) {
			const funcMatch = trimmedLine.match(/function\s+(\w+)\s*\(([^)]*)\)/);
			if (funcMatch) {
				const params = funcMatch[2];

				// Check for return type hint
				const nextLine = i + 1 < lines.length ? lines[i + 1].trim() : "";
				if (!trimmedLine.includes(":") && !nextLine.includes(":")) {
					markers.push({
						severity: monaco.MarkerSeverity.Info,
						startLineNumber: lineNumber,
						startColumn: line.indexOf("function"),
						endLineNumber: lineNumber,
						endColumn: line.indexOf("function") + 8,
						message:
							"Consider adding return type declaration for better type safety",
						code: "missing-return-type",
					});
				}

				// Check for parameter type hints
				if (params && !params.includes("$") === false) {
					const paramList = params.split(",");
					for (const param of paramList) {
						if (param.trim() && !param.includes(":")) {
							markers.push({
								severity: monaco.MarkerSeverity.Info,
								startLineNumber: lineNumber,
								startColumn: line.indexOf(params),
								endLineNumber: lineNumber,
								endColumn: line.indexOf(params) + params.length,
								message: "Consider adding parameter type declarations",
								code: "missing-param-types",
							});
							break;
						}
					}
				}
			}
		}

		// Check for global variables usage
		if (trimmedLine.includes("global ")) {
			markers.push({
				severity: monaco.MarkerSeverity.Warning,
				startLineNumber: lineNumber,
				startColumn: 1,
				endLineNumber: lineNumber,
				endColumn: line.length + 1,
				message:
					"Avoid using global variables. Consider dependency injection or class properties.",
				code: "global-variable",
			});
		}

		// Check for extract() usage (security risk)
		if (trimmedLine.includes("extract(")) {
			markers.push({
				severity: monaco.MarkerSeverity.Warning,
				startLineNumber: lineNumber,
				startColumn: line.indexOf("extract"),
				endLineNumber: lineNumber,
				endColumn: line.indexOf("extract") + 7,
				message:
					"extract() can be dangerous. Avoid using it with untrusted data.",
				code: "extract-usage",
			});
		}

		// Check for eval() usage (security risk)
		if (trimmedLine.includes("eval(")) {
			markers.push({
				severity: monaco.MarkerSeverity.Error,
				startLineNumber: lineNumber,
				startColumn: line.indexOf("eval"),
				endLineNumber: lineNumber,
				endColumn: line.indexOf("eval") + 4,
				message:
					"eval() is dangerous and should be avoided. It can execute malicious code.",
				code: "eval-usage",
			});
		}

		// Check for missing isset() for array access
		const arrayAccessMatch = trimmedLine.match(
			/\$([a-zA-Z_][a-zA-Z0-9_]*)\s*\[/,
		);
		if (arrayAccessMatch) {
			const varName = arrayAccessMatch[1];
			const prevLine = i > 0 ? lines[i - 1].trim() : "";
			if (
				!prevLine.includes(`isset($${varName})`) &&
				!trimmedLine.includes("isset")
			) {
				markers.push({
					severity: monaco.MarkerSeverity.Info,
					startLineNumber: lineNumber,
					startColumn: line.indexOf("$" + varName),
					endLineNumber: lineNumber,
					endColumn: line.indexOf("$" + varName) + varName.length + 1,
					message:
						"Consider using isset() to check if array key exists before accessing",
					code: "array-access-check",
				});
			}
		}

		// Check for short open tags
		if (
			trimmedLine.includes("<?") &&
			!trimmedLine.includes("<?php") &&
			!trimmedLine.includes("<?=")
		) {
			markers.push({
				severity: monaco.MarkerSeverity.Warning,
				startLineNumber: lineNumber,
				startColumn: 1,
				endLineNumber: lineNumber,
				endColumn: line.length + 1,
				message: "Short open tags (<?) are not recommended. Use <?php instead.",
				code: "short-open-tag",
			});
		}

		// Check for magic quotes usage (deprecated)
		if (trimmedLine.includes("magic_quotes")) {
			markers.push({
				severity: monaco.MarkerSeverity.Warning,
				startLineNumber: lineNumber,
				startColumn: 1,
				endLineNumber: lineNumber,
				endColumn: line.length + 1,
				message:
					"Magic quotes are deprecated and removed in PHP 5.4+. Use proper escaping instead.",
				code: "magic-quotes",
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
		const lines = model.getLinesContent();

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

		// Quick fix for SQL injection
		if (line.includes("mysql_query(") || line.includes("mysqli_query(")) {
			const queryMatch = line.match(
				/(mysql_query|mysqli_query)\s*\(\s*([^)]*)\)/,
			);
			if (queryMatch) {
				const queryContent = queryMatch[2];
				if (
					queryContent.includes("$_") &&
					!queryContent.includes("mysqli_real_escape_string")
				) {
					actions.push({
						title: "Use prepared statement",
						kind: "quickfix",
						edit: {
							edits: [
								{
									resource: model.uri,
									versionId: model.getVersionId(),
									textEdit: {
										range: {
											startLineNumber: range.startLineNumber,
											startColumn: line.indexOf(queryMatch[1]),
											endLineNumber: range.startLineNumber,
											endColumn: line.length,
										},
										text: "// TODO: Use prepared statement instead of direct query\n// $stmt = $mysqli->prepare($query);\n// $stmt->bind_param('s', $userInput);\n// $stmt->execute();",
									},
								},
							],
						},
					});
				}
			}
		}

		// Quick fix for XSS
		if (line.includes("echo") || line.includes("print")) {
			const outputMatch = line.match(/(echo|print)\s+(.+)/);
			if (outputMatch) {
				const outputContent = outputMatch[2];
				if (
					outputContent.includes("$_") &&
					!outputContent.includes("htmlspecialchars")
				) {
					actions.push({
						title: "Escape output with htmlspecialchars",
						kind: "quickfix",
						edit: {
							edits: [
								{
									resource: model.uri,
									versionId: model.getVersionId(),
									textEdit: {
										range: {
											startLineNumber: range.startLineNumber,
											startColumn: line.indexOf(outputMatch[2]),
											endLineNumber: range.startLineNumber,
											endColumn:
												line.indexOf(outputMatch[2]) + outputMatch[2].length,
										},
										text: `htmlspecialchars(${outputMatch[2].trim()}, ENT_QUOTES, 'UTF-8')`,
									},
								},
							],
						},
					});
				}
			}
		}

		// Quick fix for deprecated mysql functions
		if (line.includes("mysql_")) {
			actions.push({
				title: "Replace with mysqli or PDO",
				kind: "quickfix",
				edit: {
					edits: [
						{
							resource: model.uri,
							versionId: model.getVersionId(),
							textEdit: {
								range: {
									startLineNumber: range.startLineNumber,
									startColumn: 1,
									endLineNumber: range.startLineNumber,
									endColumn: line.length + 1,
								},
								text:
									"// TODO: Replace mysql_ functions with mysqli_ or PDO\n" +
									line,
							},
						},
					],
				},
			});
		}

		// Quick fix for error reporting
		if (
			range.startLineNumber === 1 &&
			!lines.some((l) => l.includes("error_reporting"))
		) {
			actions.push({
				title: "Add error reporting",
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
								text: "<?php\nerror_reporting(E_ALL);\nini_set('display_errors', 1);\n\n",
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
