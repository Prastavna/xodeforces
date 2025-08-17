import * as monaco from "monaco-editor";

monaco.languages.setLanguageConfiguration("cpp", {
	comments: {
		lineComment: "//",
		blockComment: ["/*", "*/"],
	},
	brackets: [
		["{", "}"],
		["[", "]"],
		["(", ")"],
		["<", ">"],
	],
	autoClosingPairs: [
		{ open: "{", close: "}" },
		{ open: "[", close: "]" },
		{ open: "(", close: ")" },
		{ open: "<", close: ">" },
		{ open: '"', close: '"' },
		{ open: "'", close: "'" },
	],
	surroundingPairs: [
		{ open: "{", close: "}" },
		{ open: "[", close: "]" },
		{ open: "(", close: ")" },
		{ open: "<", close: ">" },
		{ open: '"', close: '"' },
		{ open: "'", close: "'" },
	],
	indentationRules: {
		increaseIndentPattern: /^.*\{[^}"']*$/,
		decreaseIndentPattern: /^.*\}.*$/,
	},
});

// C++ formatter
monaco.languages.registerDocumentFormattingEditProvider("cpp", {
	provideDocumentFormattingEdits: (model, options) => {
		const code = model.getValue();
		const lines = code.split("\n");
		const formattedLines: string[] = [];
		let indentLevel = 0;
		const indentSize = options.tabSize;
		const useSpaces = options.insertSpaces;
		const indentChar = useSpaces ? " ".repeat(indentSize) : "\t";

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
