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
	wordPattern:
		/(-?\d*\.\d\w*)|([^\`\~\!\@\#\%\^\&\*\(\)\-\=\+\[\{\]\}\\\|\;\:\'\"\,\.\<\>\/\?\s]+)/g,
});
