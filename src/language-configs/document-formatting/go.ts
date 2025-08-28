import * as monaco from "monaco-editor";

monaco.languages.setLanguageConfiguration("go", {
	comments: {
		lineComment: "//",
		blockComment: ["/*", "*/"],
	},
	brackets: [
		["{", "}"],
		["[", "]"],
		["(", ")"],
	],
	autoClosingPairs: [
		{ open: "{", close: "}" },
		{ open: "[", close: "]" },
		{ open: "(", close: ")" },
		{ open: '"', close: '"', notIn: ["string"] },
		{ open: "'", close: "'", notIn: ["string", "comment"] },
		{ open: "`", close: "`", notIn: ["string", "comment"] },
	],
	surroundingPairs: [
		{ open: "{", close: "}" },
		{ open: "[", close: "]" },
		{ open: "(", close: ")" },
		{ open: '"', close: '"' },
		{ open: "'", close: "'" },
		{ open: "`", close: "`" },
	],
	indentationRules: {
		increaseIndentPattern: /^.*\{[^}"']*$/,
		decreaseIndentPattern: /^.*\}.*$/,
	},
	wordPattern: /(-?\d*\.\d\w*)|([^`~!@#%^&*()\-=+[{\]}\\|;:'",.<>/?\s]+)/g,
});

// Go formatter (similar to C/C++/Java but with gofmt style)
monaco.languages.registerDocumentFormattingEditProvider("go", {
	provideDocumentFormattingEdits: (model) => {
		const code = model.getValue();
		const lines = code.split("\n");
		const formattedLines: string[] = [];
		let indentLevel = 0;
		const indentChar = "\t"; // Go always uses tabs

		for (let i = 0; i < lines.length; i++) {
			const line = lines[i];
			const trimmedLine = line.trim();

			if (trimmedLine === "") {
				formattedLines.push("");
				continue;
			}

			// Decrease indent for closing braces
			if (trimmedLine.startsWith("}")) {
				indentLevel = Math.max(0, indentLevel - 1);
			}

			// Apply current indentation
			const formattedLine = indentChar.repeat(indentLevel) + trimmedLine;
			formattedLines.push(formattedLine);

			// Increase indent for opening braces
			if (trimmedLine.endsWith("{")) {
				indentLevel++;
			}
		}

		return [
			{
				range: model.getFullModelRange(),
				text: formattedLines.join("\n"),
			},
		];
	},
});
