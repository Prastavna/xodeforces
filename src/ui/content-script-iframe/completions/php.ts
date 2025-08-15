import * as monaco from "monaco-editor";

monaco.languages.registerCompletionItemProvider("php", {
	provideCompletionItems: (model, position) => {
		const word = model.getWordUntilPosition(position);
		const range = {
			startLineNumber: position.lineNumber,
			endLineNumber: position.lineNumber,
			startColumn: word.startColumn,
			endColumn: word.endColumn,
		};

		const suggestions = [
			{
				label: "echo",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "echo ${1:value};",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Output one or more strings",
				range: range,
			},
			{
				label: "print",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "print ${1:value};",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Output a string",
				range: range,
			},
			{
				label: "var_dump",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "var_dump(${1:variable});",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Display information about a variable",
				range: range,
			},
			{
				label: "function",
				kind: monaco.languages.CompletionItemKind.Keyword,
				insertText:
					"function ${1:functionName}(${2:parameters}) {\n    ${3:// function body}\n}",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Define a function",
				range: range,
			},
			{
				label: "class",
				kind: monaco.languages.CompletionItemKind.Keyword,
				insertText: "class ${1:ClassName} {\n    ${2:// class body}\n}",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Define a class",
				range: range,
			},
			{
				label: "if",
				kind: monaco.languages.CompletionItemKind.Keyword,
				insertText: "if (${1:condition}) {\n    ${2:// if body}\n}",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "If statement",
				range: range,
			},
			{
				label: "foreach",
				kind: monaco.languages.CompletionItemKind.Keyword,
				insertText:
					"foreach (${1:$array} as ${2:$value}) {\n    ${3:// loop body}\n}",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Foreach loop",
				range: range,
			},
			{
				label: "for",
				kind: monaco.languages.CompletionItemKind.Keyword,
				insertText:
					"for (${1:$i = 0}; ${2:$i < $length}; ${3:$i++}) {\n    ${4:// loop body}\n}",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "For loop",
				range: range,
			},
			{
				label: "$_GET",
				kind: monaco.languages.CompletionItemKind.Variable,
				insertText: "$_GET[${1:'key'}]",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "HTTP GET variables",
				range: range,
			},
			{
				label: "$_POST",
				kind: monaco.languages.CompletionItemKind.Variable,
				insertText: "$_POST[${1:'key'}]",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "HTTP POST variables",
				range: range,
			},
			{
				label: "$_SESSION",
				kind: monaco.languages.CompletionItemKind.Variable,
				insertText: "$_SESSION[${1:'key'}]",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Session variables",
				range: range,
			},
			{
				label: "isset",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "isset(${1:$variable})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Check if variable is set",
				range: range,
			},
			{
				label: "array",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "array(${1:elements})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Create an array",
				range: range,
			},
		];

		return { suggestions };
	},
});
