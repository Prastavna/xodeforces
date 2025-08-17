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
