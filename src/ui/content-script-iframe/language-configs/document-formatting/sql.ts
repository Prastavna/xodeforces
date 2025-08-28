import * as monaco from "monaco-editor";

monaco.languages.setLanguageConfiguration("sql", {
	comments: {
		lineComment: "--",
		blockComment: ["/*", "*/"],
	},
	brackets: [["(", ")"]],
	autoClosingPairs: [
		{ open: "(", close: ")" },
		{ open: '"', close: '"', notIn: ["string"] },
		{ open: "'", close: "'", notIn: ["string", "comment"] },
	],
	surroundingPairs: [
		{ open: "(", close: ")" },
		{ open: '"', close: '"' },
		{ open: "'", close: "'" },
	],
	wordPattern: /(-?\d*\.\d\w*)|([^`~!@#%^&*()\-=+[{\]}\\|;:'",.<>/?\s]+)/g,
});

// SQL formatter
monaco.languages.registerDocumentFormattingEditProvider("sql", {
	provideDocumentFormattingEdits: (model, options) => {
		const code = model.getValue();
		const lines = code.split("\n");
		const formattedLines: string[] = [];
		let indentLevel = 0;
		const indentSize = options.tabSize;
		const useSpaces = options.insertSpaces;
		const indentChar = useSpaces ? " ".repeat(indentSize) : "\t";

		// SQL keywords that should increase indentation
		const increaseIndentKeywords =
			/^\s*(SELECT|FROM|WHERE|GROUP BY|HAVING|ORDER BY|JOIN|LEFT JOIN|RIGHT JOIN|INNER JOIN|OUTER JOIN|UNION|CASE|WHEN|THEN|ELSE|BEGIN|IF|WHILE|FOR)\b/i;
		const decreaseIndentKeywords = /^\s*(END|ELSE|WHEN)\b/i;

		for (let i = 0; i < lines.length; i++) {
			const line = lines[i];
			const trimmedLine = line.trim();

			if (trimmedLine === "") {
				formattedLines.push("");
				continue;
			}

			// Decrease indent for certain SQL keywords
			if (decreaseIndentKeywords.test(trimmedLine)) {
				indentLevel = Math.max(0, indentLevel - 1);
			}

			// Apply current indentation
			const formattedLine = indentChar.repeat(indentLevel) + trimmedLine;
			formattedLines.push(formattedLine);

			// Increase indent for certain SQL keywords
			if (increaseIndentKeywords.test(trimmedLine)) {
				indentLevel++;
			}

			// Handle parentheses
			const openParens = (trimmedLine.match(/\(/g) || []).length;
			const closeParens = (trimmedLine.match(/\)/g) || []).length;
			indentLevel += openParens - closeParens;
			indentLevel = Math.max(0, indentLevel);
		}

		return [
			{
				range: model.getFullModelRange(),
				text: formattedLines.join("\n"),
			},
		];
	},
});
