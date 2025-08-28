import * as monaco from "monaco-editor";

const validateModel = (model: monaco.editor.ITextModel) => {
	const markers: monaco.editor.IMarkerData[] = [];
	const lines = model.getLinesContent();

	// Track variables for potential memory issues
	const pointers: { [key: string]: { line: number; freed: boolean } } = {};
	let hasStdNamespace = false;

	// Check for bits/stdc++.h include at the beginning (common in competitive programming)
	const hasBitsStdcxx = lines.some((l) =>
		l.includes("#include <bits/stdc++.h>"),
	);

	for (let i = 0; i < lines.length; i++) {
		const line = lines[i];
		const lineNumber = i + 1;
		const trimmedLine = line.trim();

		// Check for using namespace std
		if (trimmedLine.includes("using namespace std")) {
			hasStdNamespace = true;
		}

		// Check for bits/stdc++.h include (common in competitive programming)
		if (trimmedLine.includes("#include <bits/stdc++.h>")) {
			// Add a warning about using bits/stdc++.h in production code
			markers.push({
				severity: monaco.MarkerSeverity.Info,
				startLineNumber: lineNumber,
				startColumn: 1,
				endLineNumber: lineNumber,
				endColumn: line.length + 1,
				message:
					"Using <bits/stdc++.h> is convenient for competitive programming but includes unnecessary headers in production code. Consider using specific includes.",
				code: "bits-stdcxx-usage",
			});
		}

		// Check for missing includes
		if (
			line.includes("cout") ||
			line.includes("cin") ||
			line.includes("endl")
		) {
			const hasIostream = lines.some((l) => l.includes("#include <iostream>"));
			if (!hasIostream && !hasBitsStdcxx) {
				markers.push({
					severity: monaco.MarkerSeverity.Error,
					startLineNumber: lineNumber,
					startColumn: 1,
					endLineNumber: lineNumber,
					endColumn: line.length + 1,
					message:
						"Missing #include <iostream> for cout/cin/endl (or use #include <bits/stdc++.h>)",
					code: "missing-iostream",
				});
			}
		}

		if (line.includes("vector") || line.includes("string")) {
			const hasVector = lines.some((l) => l.includes("#include <vector>"));
			const hasString = lines.some((l) => l.includes("#include <string>"));
			if (line.includes("vector") && !hasVector && !hasBitsStdcxx) {
				markers.push({
					severity: monaco.MarkerSeverity.Error,
					startLineNumber: lineNumber,
					startColumn: line.indexOf("vector"),
					endLineNumber: lineNumber,
					endColumn: line.indexOf("vector") + 6,
					message:
						"Missing #include <vector> (or use #include <bits/stdc++.h>)",
					code: "missing-vector",
				});
			}
			if (line.includes("string") && !hasString && !hasBitsStdcxx) {
				markers.push({
					severity: monaco.MarkerSeverity.Error,
					startLineNumber: lineNumber,
					startColumn: line.indexOf("string"),
					endLineNumber: lineNumber,
					endColumn: line.indexOf("string") + 6,
					message:
						"Missing #include <string> (or use #include <bits/stdc++.h>)",
					code: "missing-string",
				});
			}
		}

		if (line.includes("map") || line.includes("unordered_map")) {
			const hasMap = lines.some((l) => l.includes("#include <map>"));
			if (!hasMap && !hasBitsStdcxx) {
				markers.push({
					severity: monaco.MarkerSeverity.Error,
					startLineNumber: lineNumber,
					startColumn: 1,
					endLineNumber: lineNumber,
					endColumn: line.length + 1,
					message:
						"Missing #include <map> for map/unordered_map (or use #include <bits/stdc++.h>)",
					code: "missing-map",
				});
			}
		}

		if (line.includes("set") || line.includes("unordered_set")) {
			const hasSet = lines.some((l) => l.includes("#include <set>"));
			if (!hasSet && !hasBitsStdcxx) {
				markers.push({
					severity: monaco.MarkerSeverity.Error,
					startLineNumber: lineNumber,
					startColumn: 1,
					endLineNumber: lineNumber,
					endColumn: line.length + 1,
					message:
						"Missing #include <set> for set/unordered_set (or use #include <bits/stdc++.h>)",
					code: "missing-set",
				});
			}
		}

		if (line.includes("algorithm")) {
			const hasAlgorithm = lines.some((l) =>
				l.includes("#include <algorithm>"),
			);
			if (!hasAlgorithm && !hasBitsStdcxx) {
				markers.push({
					severity: monaco.MarkerSeverity.Error,
					startLineNumber: lineNumber,
					startColumn: 1,
					endLineNumber: lineNumber,
					endColumn: line.length + 1,
					message:
						"Missing #include <algorithm> (or use #include <bits/stdc++.h>)",
					code: "missing-algorithm",
				});
			}
		}

		if (line.includes("set") || line.includes("unordered_set")) {
			const hasSet = lines.some((l) => l.includes("#include <set>"));
			if (!hasSet) {
				markers.push({
					severity: monaco.MarkerSeverity.Error,
					startLineNumber: lineNumber,
					startColumn: 1,
					endLineNumber: lineNumber,
					endColumn: line.length + 1,
					message: "Missing #include <set> for set/unordered_set",
					code: "missing-set",
				});
			}
		}

		if (line.includes("algorithm")) {
			const hasAlgorithm = lines.some((l) =>
				l.includes("#include <algorithm>"),
			);
			if (!hasAlgorithm) {
				markers.push({
					severity: monaco.MarkerSeverity.Error,
					startLineNumber: lineNumber,
					startColumn: 1,
					endLineNumber: lineNumber,
					endColumn: line.length + 1,
					message: "Missing #include <algorithm>",
					code: "missing-algorithm",
				});
			}
		}

		// Track pointer allocations
		const newMatch = trimmedLine.match(/(\w+)\s*=\s*new\s+\w+/);
		if (newMatch) {
			const varName = newMatch[1];
			pointers[varName] = { line: lineNumber, freed: false };
		}

		// Track pointer deallocations
		const deleteMatch = trimmedLine.match(/delete\s+(\w+)/);
		if (deleteMatch) {
			const varName = deleteMatch[1];
			if (pointers[varName]) {
				pointers[varName].freed = true;
			}
		}

		// Check for missing semicolons
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

		// Check for using namespace std
		if (
			!hasStdNamespace &&
			(line.includes("cout") || line.includes("cin") || line.includes("endl"))
		) {
			markers.push({
				severity: monaco.MarkerSeverity.Info,
				startLineNumber: lineNumber,
				startColumn: 1,
				endLineNumber: lineNumber,
				endColumn: line.length + 1,
				message: "Consider adding 'using namespace std;' or use 'std::' prefix",
				code: "missing-namespace",
			});
		}

		// Check for raw pointers without smart pointers
		if (
			trimmedLine.includes("*") &&
			trimmedLine.includes("=") &&
			trimmedLine.includes("new")
		) {
			markers.push({
				severity: monaco.MarkerSeverity.Info,
				startLineNumber: lineNumber,
				startColumn: 1,
				endLineNumber: lineNumber,
				endColumn: line.length + 1,
				message:
					"Consider using smart pointers (unique_ptr, shared_ptr) instead of raw pointers",
				code: "raw-pointer",
			});
		}

		// Check for C-style arrays
		const arrayMatch = trimmedLine.match(/(\w+)\s*\[\s*\d+\s*\]/);
		if (arrayMatch && !trimmedLine.includes("const")) {
			markers.push({
				severity: monaco.MarkerSeverity.Info,
				startLineNumber: lineNumber,
				startColumn: line.indexOf(arrayMatch[1]),
				endLineNumber: lineNumber,
				endColumn: line.indexOf(arrayMatch[1]) + arrayMatch[1].length,
				message:
					"Consider using std::array or std::vector instead of C-style arrays",
				code: "c-style-array",
			});
		}

		// Check for magic numbers
		const magicNumberMatch = trimmedLine.match(/=\s*(\d+)/);
		if (
			magicNumberMatch &&
			magicNumberMatch[1] !== "0" &&
			magicNumberMatch[1] !== "1" &&
			!trimmedLine.includes("const") &&
			!trimmedLine.includes("constexpr")
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

		// Check for header guards in header files
		if (model.getLanguageId() === "cpp" && i === 0) {
			const fileName = model.uri.path.split("/").pop() || "";
			if (fileName.endsWith(".h") || fileName.endsWith(".hpp")) {
				if (!line.includes("#ifndef") && !line.includes("#pragma once")) {
					markers.push({
						severity: monaco.MarkerSeverity.Warning,
						startLineNumber: 1,
						startColumn: 1,
						endLineNumber: 1,
						endColumn: line.length + 1,
						message:
							"Consider adding header guards (#ifndef/#define/#endif) or #pragma once",
						code: "missing-header-guard",
					});
				}
			}
		}
	}

	// Check for unfreed pointers
	Object.entries(pointers).forEach(([varName, info]) => {
		if (!info.freed) {
			markers.push({
				severity: monaco.MarkerSeverity.Warning,
				startLineNumber: info.line,
				startColumn: lines[info.line - 1].indexOf(varName),
				endLineNumber: info.line,
				endColumn: lines[info.line - 1].indexOf(varName) + varName.length,
				message: `Pointer '${varName}' allocated but never freed. Consider using smart pointers.`,
				code: "memory-leak",
			});
		}
	});

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
		const lines = model.getLinesContent();

		if (
			line.includes("cout") ||
			line.includes("cin") ||
			line.includes("endl")
		) {
			const hasIostream = lines.some((l) => l.includes("#include <iostream>"));
			const hasBitsStdcxx = lines.some((l) =>
				l.includes("#include <bits/stdc++.h>"),
			);
			if (!hasIostream && !hasBitsStdcxx) {
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
				actions.push({
					title:
						"Add #include <bits/stdc++.h> (includes all standard libraries)",
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
									text: "#include <bits/stdc++.h>\n",
								},
							},
						],
					},
				});
			}
		}

		if (line.includes("vector")) {
			const hasVector = lines.some((l) => l.includes("#include <vector>"));
			const hasBitsStdcxx = lines.some((l) =>
				l.includes("#include <bits/stdc++.h>"),
			);
			if (!hasVector && !hasBitsStdcxx) {
				actions.push({
					title: "Add #include <vector>",
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
									text: "#include <vector>\n",
								},
							},
						],
					},
				});
				actions.push({
					title:
						"Add #include <bits/stdc++.h> (includes all standard libraries)",
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
									text: "#include <bits/stdc++.h>\n",
								},
							},
						],
					},
				});
			}
		}

		if (line.includes("string")) {
			const hasString = lines.some((l) => l.includes("#include <string>"));
			const hasBitsStdcxx = lines.some((l) =>
				l.includes("#include <bits/stdc++.h>"),
			);
			if (!hasString && !hasBitsStdcxx) {
				actions.push({
					title: "Add #include <string>",
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
									text: "#include <string>\n",
								},
							},
						],
					},
				});
				actions.push({
					title:
						"Add #include <bits/stdc++.h> (includes all standard libraries)",
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
									text: "#include <bits/stdc++.h>\n",
								},
							},
						],
					},
				});
			}
		}

		if (line.includes("map") || line.includes("unordered_map")) {
			const hasMap = lines.some((l) => l.includes("#include <map>"));
			const hasBitsStdcxx = lines.some((l) =>
				l.includes("#include <bits/stdc++.h>"),
			);
			if (!hasMap && !hasBitsStdcxx) {
				actions.push({
					title: "Add #include <map>",
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
									text: "#include <map>\n",
								},
							},
						],
					},
				});
				actions.push({
					title:
						"Add #include <bits/stdc++.h> (includes all standard libraries)",
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
									text: "#include <bits/stdc++.h>\n",
								},
							},
						],
					},
				});
			}
		}

		if (line.includes("set") || line.includes("unordered_set")) {
			const hasSet = lines.some((l) => l.includes("#include <set>"));
			const hasBitsStdcxx = lines.some((l) =>
				l.includes("#include <bits/stdc++.h>"),
			);
			if (!hasSet && !hasBitsStdcxx) {
				actions.push({
					title: "Add #include <set>",
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
									text: "#include <set>\n",
								},
							},
						],
					},
				});
				actions.push({
					title:
						"Add #include <bits/stdc++.h> (includes all standard libraries)",
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
									text: "#include <bits/stdc++.h>\n",
								},
							},
						],
					},
				});
			}
		}

		if (line.includes("algorithm")) {
			const hasAlgorithm = lines.some((l) =>
				l.includes("#include <algorithm>"),
			);
			const hasBitsStdcxx = lines.some((l) =>
				l.includes("#include <bits/stdc++.h>"),
			);
			if (!hasAlgorithm && !hasBitsStdcxx) {
				actions.push({
					title: "Add #include <algorithm>",
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
									text: "#include <algorithm>\n",
								},
							},
						],
					},
				});
				actions.push({
					title:
						"Add #include <bits/stdc++.h> (includes all standard libraries)",
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
									text: "#include <bits/stdc++.h>\n",
								},
							},
						],
					},
				});
			}
		}

		if (line.includes("set") || line.includes("unordered_set")) {
			const hasSet = lines.some((l) => l.includes("#include <set>"));
			if (!hasSet) {
				actions.push({
					title: "Add #include <set>",
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
									text: "#include <set>\n",
								},
							},
						],
					},
				});
			}
		}

		if (line.includes("algorithm")) {
			const hasAlgorithm = lines.some((l) =>
				l.includes("#include <algorithm>"),
			);
			if (!hasAlgorithm) {
				actions.push({
					title: "Add #include <algorithm>",
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
									text: "#include <algorithm>\n",
								},
							},
						],
					},
				});
			}
		}

		// Quick fix for using namespace std
		if (
			(line.includes("cout") ||
				line.includes("cin") ||
				line.includes("endl")) &&
			!lines.some((l) => l.includes("using namespace std"))
		) {
			actions.push({
				title: "Add 'using namespace std;'",
				kind: "quickfix",
				edit: {
					edits: [
						{
							resource: model.uri,
							versionId: model.getVersionId(),
							textEdit: {
								range: {
									startLineNumber: lines.length,
									startColumn: 1,
									endLineNumber: lines.length,
									endColumn: 1,
								},
								text: "\nusing namespace std;",
							},
						},
					],
				},
			});
		}

		// Quick fix for header guards
		const fileName = model.uri.path.split("/").pop() || "";
		if (
			(fileName.endsWith(".h") || fileName.endsWith(".hpp")) &&
			range.startLineNumber === 1
		) {
			const guardName = fileName.toUpperCase().replace(/[^A-Z0-9]/g, "_") + "_";
			actions.push({
				title: "Add header guards",
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
								text: `#ifndef ${guardName}\n#define ${guardName}\n\n`,
							},
						},
						{
							resource: model.uri,
							versionId: model.getVersionId(),
							textEdit: {
								range: {
									startLineNumber: lines.length + 1,
									startColumn: 1,
									endLineNumber: lines.length + 1,
									endColumn: 1,
								},
								text: `\n#endif // ${guardName}`,
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
