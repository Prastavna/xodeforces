import * as monaco from "monaco-editor";

monaco.languages.setLanguageConfiguration("python", {
	comments: {
		lineComment: "#",
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
		{ open: '"""', close: '"""' },
		{ open: "'''", close: "'''" },
	],
	surroundingPairs: [
		{ open: "{", close: "}" },
		{ open: "[", close: "]" },
		{ open: "(", close: ")" },
		{ open: '"', close: '"' },
		{ open: "'", close: "'" },
	],
	indentationRules: {
		increaseIndentPattern:
			/^\s*(if|elif|else|for|while|try|except|finally|def|class|with|async\s+(def|with|for)).*:\s*$/,
		decreaseIndentPattern: /^\s*(return|break|continue|pass|raise)\b.*$/,
	},
	onEnterRules: [
		{
			beforeText:
				/^\s*(?:def|class|if|elif|else|while|for|try|except|finally|with|async\s+(?:def|with|for)).*:\s*$/,
			action: { indentAction: monaco.languages.IndentAction.Indent },
		},
	],
	wordPattern: /(-?\d*\.\d\w*)|([^`~!@#%^&*()\-=+[{\]}\\|;:'",.<>/?\s]+)/g,
});

// Python formatter
monaco.languages.registerDocumentFormattingEditProvider("python", {
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

			// Decrease indent for certain patterns
			if (
				/^\s*(except|elif|else|finally):/.test(trimmedLine) ||
				/^\s*(return|break|continue|pass|raise)\b/.test(trimmedLine)
			) {
				indentLevel = Math.max(0, indentLevel - 1);
			}

			// Apply current indentation
			const formattedLine = indentChar.repeat(indentLevel) + trimmedLine;
			formattedLines.push(formattedLine);

			// Increase indent for lines ending with ':'
			if (trimmedLine.endsWith(":")) {
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
