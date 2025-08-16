import * as monaco from "monaco-editor";

monaco.languages.setLanguageConfiguration("php", {
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
