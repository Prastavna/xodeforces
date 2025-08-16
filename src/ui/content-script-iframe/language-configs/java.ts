import * as monaco from "monaco-editor";

monaco.languages.setLanguageConfiguration("java", {
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
		{ open: '"', close: '"' },
		{ open: "'", close: "'" },
	],
	surroundingPairs: [
		{ open: "{", close: "}" },
		{ open: "[", close: "]" },
		{ open: "(", close: ")" },
		{ open: '"', close: '"' },
		{ open: "'", close: "'" },
	],
	indentationRules: {
		increaseIndentPattern: /^.*\{[^}"']*$/,
		decreaseIndentPattern: /^.*\}.*$/,
	},
	wordPattern:
		/(-?\d*\.\d\w*)|([^\`\~\!\@\#\%\^\&\*\(\)\-\=\+\[\{\]\}\\\|\;\:\'\"\,\.\<\>\/\?\s]+)/g,
});
