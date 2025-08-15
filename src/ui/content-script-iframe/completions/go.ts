import * as monaco from "monaco-editor";

monaco.languages.registerCompletionItemProvider("go", {
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
				label: "fmt.Println",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "fmt.Println(${1:value})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Print line to stdout",
				range: range,
			},
			{
				label: "fmt.Printf",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: 'fmt.Printf("${1:format}", ${2:args})',
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Formatted print",
				range: range,
			},
			{
				label: "fmt.Sprintf",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: 'fmt.Sprintf("${1:format}", ${2:args})',
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Formatted string",
				range: range,
			},
			{
				label: "func",
				kind: monaco.languages.CompletionItemKind.Keyword,
				insertText:
					"func ${1:functionName}(${2:parameters}) ${3:returnType} {\n    ${4:// function body}\n}",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Define a function",
				range: range,
			},
			{
				label: "package main",
				kind: monaco.languages.CompletionItemKind.Snippet,
				insertText:
					'package main\n\nimport "fmt"\n\nfunc main() {\n    ${1:// main function body}\n}',
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Main package template",
				range: range,
			},
			{
				label: "if",
				kind: monaco.languages.CompletionItemKind.Keyword,
				insertText: "if ${1:condition} {\n    ${2:// if body}\n}",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "If statement",
				range: range,
			},
			{
				label: "for",
				kind: monaco.languages.CompletionItemKind.Keyword,
				insertText:
					"for ${1:i := 0}; ${2:i < length}; ${3:i++} {\n    ${4:// loop body}\n}",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "For loop",
				range: range,
			},
			{
				label: "for range",
				kind: monaco.languages.CompletionItemKind.Keyword,
				insertText:
					"for ${1:key}, ${2:value} := range ${3:collection} {\n    ${4:// loop body}\n}",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "For range loop",
				range: range,
			},
			{
				label: "struct",
				kind: monaco.languages.CompletionItemKind.Keyword,
				insertText:
					"type ${1:StructName} struct {\n    ${2:Field1} ${3:string}\n    ${4:Field2} ${5:int}\n}",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Define a struct",
				range: range,
			},
			{
				label: "interface",
				kind: monaco.languages.CompletionItemKind.Keyword,
				insertText:
					"type ${1:InterfaceName} interface {\n    ${2:MethodName}(${3:parameters}) ${4:returnType}\n}",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Define an interface",
				range: range,
			},
			{
				label: "make",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "make(${1:[]Type}, ${2:length})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Make slice, map, or channel",
				range: range,
			},
		];

		return { suggestions };
	},
});
