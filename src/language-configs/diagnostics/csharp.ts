import * as monaco from "monaco-editor";

const validateModel = (model: monaco.editor.ITextModel) => {
	const markers: monaco.editor.IMarkerData[] = [];
	const lines = model.getLinesContent();

	// Track async methods and their usage
	const asyncMethods: { [key: string]: { line: number; hasAwait: boolean } } =
		{};
	let braceCount = 0;

	for (let i = 0; i < lines.length; i++) {
		const line = lines[i];
		const lineNumber = i + 1;
		const trimmedLine = line.trim();

		// Track brace count for method scope
		if (trimmedLine.includes("{")) braceCount++;
		if (trimmedLine.includes("}")) braceCount--;

		// Track async methods
		if (trimmedLine.includes("async")) {
			const methodMatch = trimmedLine.match(/async\s+\w+\s+(\w+)\s*\(/);
			if (methodMatch) {
				const methodName = methodMatch[1];
				asyncMethods[methodName] = { line: lineNumber, hasAwait: false };
			}
		}

		// Check for await usage in async methods
		if (trimmedLine.includes("await")) {
			// Mark that this method uses await (simplified check)
			Object.keys(asyncMethods).forEach((method) => {
				if (
					lines
						.slice(asyncMethods[method].line - 1, i + 1)
						.some((l) => l.includes(method) && l.includes("("))
				) {
					asyncMethods[method].hasAwait = true;
				}
			});
		}

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

		if (
			line.includes("List<") &&
			!lines.some((l) => l.includes("using System.Collections.Generic;"))
		) {
			markers.push({
				severity: monaco.MarkerSeverity.Error,
				startLineNumber: lineNumber,
				startColumn: 1,
				endLineNumber: lineNumber,
				endColumn: line.length + 1,
				message: "Missing 'using System.Collections.Generic;' for List<T>",
				code: "missing-generic-using",
			});
		}

		if (
			line.includes("Dictionary<") &&
			!lines.some((l) => l.includes("using System.Collections.Generic;"))
		) {
			markers.push({
				severity: monaco.MarkerSeverity.Error,
				startLineNumber: lineNumber,
				startColumn: 1,
				endLineNumber: lineNumber,
				endColumn: line.length + 1,
				message:
					"Missing 'using System.Collections.Generic;' for Dictionary<TKey, TValue>",
				code: "missing-generic-using",
			});
		}

		if (
			line.includes("Task") &&
			!lines.some((l) => l.includes("using System.Threading.Tasks;"))
		) {
			markers.push({
				severity: monaco.MarkerSeverity.Error,
				startLineNumber: lineNumber,
				startColumn: 1,
				endLineNumber: lineNumber,
				endColumn: line.length + 1,
				message: "Missing 'using System.Threading.Tasks;' for Task",
				code: "missing-tasks-using",
			});
		}

		if (
			line.includes("File.") &&
			!lines.some((l) => l.includes("using System.IO;"))
		) {
			markers.push({
				severity: monaco.MarkerSeverity.Error,
				startLineNumber: lineNumber,
				startColumn: 1,
				endLineNumber: lineNumber,
				endColumn: line.length + 1,
				message: "Missing 'using System.IO;' for File operations",
				code: "missing-io-using",
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

		// Check for async methods without await
		if (trimmedLine.includes("async") && trimmedLine.includes("(")) {
			const methodMatch = trimmedLine.match(/async\s+\w+\s+(\w+)\s*\(/);
			if (methodMatch) {
				const methodName = methodMatch[1];
				// Check if this method has any await calls in its body
				let methodEndLine = i + 1;
				let localBraceCount = 0;
				for (let j = i + 1; j < lines.length; j++) {
					if (lines[j].includes("{")) localBraceCount++;
					if (lines[j].includes("}")) localBraceCount--;
					if (localBraceCount === 0) {
						methodEndLine = j;
						break;
					}
				}

				const methodBody = lines.slice(i, methodEndLine + 1);
				const hasAwait = methodBody.some((l) => l.includes("await"));

				if (!hasAwait) {
					markers.push({
						severity: monaco.MarkerSeverity.Warning,
						startLineNumber: lineNumber,
						startColumn: 1,
						endLineNumber: lineNumber,
						endColumn: line.length + 1,
						message: `Async method '${methodName}' doesn't use await. Consider making it synchronous or adding await.`,
						code: "async-without-await",
					});
				}
			}
		}

		// Check for LINQ queries without using System.Linq
		if (
			(trimmedLine.includes(".Where(") ||
				trimmedLine.includes(".Select(") ||
				trimmedLine.includes(".OrderBy(")) &&
			!lines.some((l) => l.includes("using System.Linq;"))
		) {
			markers.push({
				severity: monaco.MarkerSeverity.Error,
				startLineNumber: lineNumber,
				startColumn: 1,
				endLineNumber: lineNumber,
				endColumn: line.length + 1,
				message: "Missing 'using System.Linq;' for LINQ extension methods",
				code: "missing-linq-using",
			});
		}

		// Check for potential null reference issues
		if (trimmedLine.includes(".") && !trimmedLine.includes("?.")) {
			const dotIndex = trimmedLine.indexOf(".");
			const beforeDot = trimmedLine.substring(0, dotIndex).trim();
			if (
				beforeDot &&
				!beforeDot.includes("this.") &&
				!beforeDot.includes("base.")
			) {
				markers.push({
					severity: monaco.MarkerSeverity.Info,
					startLineNumber: lineNumber,
					startColumn: dotIndex + 1,
					endLineNumber: lineNumber,
					endColumn: dotIndex + 2,
					message:
						"Consider using null-conditional operator (?.) for safer property access",
					code: "null-check",
				});
			}
		}

		// Check for empty catch blocks
		if (
			trimmedLine.includes("catch") &&
			trimmedLine.includes("{") &&
			trimmedLine.includes("}")
		) {
			markers.push({
				severity: monaco.MarkerSeverity.Warning,
				startLineNumber: lineNumber,
				startColumn: 1,
				endLineNumber: lineNumber,
				endColumn: line.length + 1,
				message:
					"Empty catch block. Consider handling the exception or logging it.",
				code: "empty-catch",
			});
		}

		// Check for magic numbers
		const magicNumberMatch = trimmedLine.match(/=\s*(\d+)/);
		if (
			magicNumberMatch &&
			magicNumberMatch[1] !== "0" &&
			magicNumberMatch[1] !== "1" &&
			!trimmedLine.includes("const") &&
			!trimmedLine.includes("readonly")
		) {
			const number = magicNumberMatch[1];
			if (parseInt(number) > 1) {
				markers.push({
					severity: monaco.MarkerSeverity.Info,
					startLineNumber: lineNumber,
					startColumn: line.indexOf(number),
					endLineNumber: lineNumber,
					endColumn: line.indexOf(number) + number.length,
					message: "Consider using a named constant instead of magic number",
					code: "magic-number",
				});
			}
		}

		// Check for string concatenation in loops
		if (
			trimmedLine.includes("+=") &&
			trimmedLine.includes('"') &&
			(lines[i - 1]?.includes("for") || lines[i - 1]?.includes("while"))
		) {
			markers.push({
				severity: monaco.MarkerSeverity.Warning,
				startLineNumber: lineNumber,
				startColumn: 1,
				endLineNumber: lineNumber,
				endColumn: line.length + 1,
				message:
					"String concatenation in loop can be inefficient. Consider using StringBuilder.",
				code: "string-concatenation-loop",
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
		const lines = model.getLinesContent();

		if (line.includes("Console.")) {
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

		if (line.includes("List<")) {
			const hasGeneric = lines.some((l) =>
				l.includes("using System.Collections.Generic;"),
			);
			if (!hasGeneric) {
				actions.push({
					title: "Add 'using System.Collections.Generic;'",
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
									text: "using System.Collections.Generic;\n",
								},
							},
						],
					},
				});
			}
		}

		if (line.includes("Dictionary<")) {
			const hasGeneric = lines.some((l) =>
				l.includes("using System.Collections.Generic;"),
			);
			if (!hasGeneric) {
				actions.push({
					title: "Add 'using System.Collections.Generic;'",
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
									text: "using System.Collections.Generic;\n",
								},
							},
						],
					},
				});
			}
		}

		if (line.includes("Task")) {
			const hasTasks = lines.some((l) =>
				l.includes("using System.Threading.Tasks;"),
			);
			if (!hasTasks) {
				actions.push({
					title: "Add 'using System.Threading.Tasks;'",
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
									text: "using System.Threading.Tasks;\n",
								},
							},
						],
					},
				});
			}
		}

		if (line.includes("File.")) {
			const hasIO = lines.some((l) => l.includes("using System.IO;"));
			if (!hasIO) {
				actions.push({
					title: "Add 'using System.IO;'",
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
									text: "using System.IO;\n",
								},
							},
						],
					},
				});
			}
		}

		if (
			line.includes(".Where(") ||
			line.includes(".Select(") ||
			line.includes(".OrderBy(")
		) {
			const hasLinq = lines.some((l) => l.includes("using System.Linq;"));
			if (!hasLinq) {
				actions.push({
					title: "Add 'using System.Linq;'",
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
									text: "using System.Linq;\n",
								},
							},
						],
					},
				});
			}
		}

		// Quick fix for empty catch blocks
		if (line.includes("catch") && line.includes("{") && line.includes("}")) {
			actions.push({
				title: "Add exception handling",
				kind: "quickfix",
				edit: {
					edits: [
						{
							resource: model.uri,
							versionId: model.getVersionId(),
							textEdit: {
								range: {
									startLineNumber: range.startLineNumber,
									startColumn: line.indexOf("{") + 1,
									endLineNumber: range.startLineNumber,
									endColumn: line.indexOf("}"),
								},
								text: '\n            // TODO: Handle exception\n            Console.WriteLine($"Error: {ex.Message}");\n        ',
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
