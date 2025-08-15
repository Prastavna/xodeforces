import * as monaco from "monaco-editor";

monaco.languages.registerCompletionItemProvider("python", {
	provideCompletionItems: (model, position) => {
		const word = model.getWordUntilPosition(position);
		const range = {
			startLineNumber: position.lineNumber,
			endLineNumber: position.lineNumber,
			startColumn: word.startColumn,
			endColumn: word.endColumn,
		};

		const suggestions = [
			// Built-in functions
			{
				label: "print",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "print(${1:value})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Print values to stdout",
				range: range,
			},
			{
				label: "len",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "len(${1:object})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Return the length of an object",
				range: range,
			},
			{
				label: "range",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "range(${1:stop})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Return a sequence of numbers",
				range: range,
			},
			{
				label: "input",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: 'input(${1:"prompt"})',
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Read a string from stdin",
				range: range,
			},
			{
				label: "int",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "int(${1:value})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Convert to integer",
				range: range,
			},
			{
				label: "str",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "str(${1:value})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Convert to string",
				range: range,
			},
			{
				label: "float",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "float(${1:value})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Convert to float",
				range: range,
			},
			{
				label: "open",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "open(${1:filename}, ${2:mode})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Open a file",
				range: range,
			},
			// Data types
			{
				label: "list",
				kind: monaco.languages.CompletionItemKind.Class,
				insertText: "list(${1:iterable})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Create a list object",
				range: range,
			},
			{
				label: "dict",
				kind: monaco.languages.CompletionItemKind.Class,
				insertText: "dict(${1:mapping})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Create a dictionary object",
				range: range,
			},
			{
				label: "set",
				kind: monaco.languages.CompletionItemKind.Class,
				insertText: "set(${1:iterable})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Create a set object",
				range: range,
			},
			{
				label: "tuple",
				kind: monaco.languages.CompletionItemKind.Class,
				insertText: "tuple(${1:iterable})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Create a tuple object",
				range: range,
			},
			// Keywords and structures
			{
				label: "def",
				kind: monaco.languages.CompletionItemKind.Keyword,
				insertText: "def ${1:function_name}(${2:parameters}):\n    ${3:pass}",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Define a function",
				range: range,
			},
			{
				label: "class",
				kind: monaco.languages.CompletionItemKind.Keyword,
				insertText:
					"class ${1:ClassName}:\n    def __init__(self${2:, args}):\n        ${3:pass}",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Define a class",
				range: range,
			},
			{
				label: "if",
				kind: monaco.languages.CompletionItemKind.Keyword,
				insertText: "if ${1:condition}:\n    ${2:pass}",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Conditional statement",
				range: range,
			},
			{
				label: "elif",
				kind: monaco.languages.CompletionItemKind.Keyword,
				insertText: "elif ${1:condition}:\n    ${2:pass}",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Else if statement",
				range: range,
			},
			{
				label: "else",
				kind: monaco.languages.CompletionItemKind.Keyword,
				insertText: "else:\n    ${1:pass}",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Else statement",
				range: range,
			},
			{
				label: "for",
				kind: monaco.languages.CompletionItemKind.Keyword,
				insertText: "for ${1:item} in ${2:iterable}:\n    ${3:pass}",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "For loop",
				range: range,
			},
			{
				label: "while",
				kind: monaco.languages.CompletionItemKind.Keyword,
				insertText: "while ${1:condition}:\n    ${2:pass}",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "While loop",
				range: range,
			},
			{
				label: "try",
				kind: monaco.languages.CompletionItemKind.Keyword,
				insertText:
					"try:\n    ${1:code}\nexcept ${2:Exception} as ${3:e}:\n    ${4:pass}",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Try-except block",
				range: range,
			},
			{
				label: "import",
				kind: monaco.languages.CompletionItemKind.Keyword,
				insertText: "import ${1:module}",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Import module",
				range: range,
			},
			{
				label: "from",
				kind: monaco.languages.CompletionItemKind.Keyword,
				insertText: "from ${1:module} import ${2:name}",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Import from module",
				range: range,
			},
		];

		return { suggestions };
	},
});
