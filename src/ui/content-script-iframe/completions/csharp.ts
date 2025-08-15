import * as monaco from "monaco-editor";

monaco.languages.registerCompletionItemProvider("csharp", {
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
				label: "Console.WriteLine",
				kind: monaco.languages.CompletionItemKind.Method,
				insertText: "Console.WriteLine(${1:message});",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Write line to console",
				range: range,
			},
			{
				label: "Console.Write",
				kind: monaco.languages.CompletionItemKind.Method,
				insertText: "Console.Write(${1:message});",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Write to console without newline",
				range: range,
			},
			{
				label: "Console.ReadLine",
				kind: monaco.languages.CompletionItemKind.Method,
				insertText: "Console.ReadLine()",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Read line from console",
				range: range,
			},
			{
				label: "public class",
				kind: monaco.languages.CompletionItemKind.Snippet,
				insertText: "public class ${1:ClassName}\n{\n    ${2:// class body}\n}",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Create a public class",
				range: range,
			},
			{
				label: "Main method",
				kind: monaco.languages.CompletionItemKind.Snippet,
				insertText:
					"static void Main(string[] args)\n{\n    ${1:// main method body}\n}",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Main method",
				range: range,
			},
			{
				label: "using",
				kind: monaco.languages.CompletionItemKind.Keyword,
				insertText: "using ${1:System};",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Using directive",
				range: range,
			},
			{
				label: "for",
				kind: monaco.languages.CompletionItemKind.Keyword,
				insertText:
					"for (${1:int i = 0}; ${2:i < length}; ${3:i++})\n{\n    ${4:// loop body}\n}",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "For loop",
				range: range,
			},
			{
				label: "foreach",
				kind: monaco.languages.CompletionItemKind.Keyword,
				insertText:
					"foreach (${1:var} ${2:item} in ${3:collection})\n{\n    ${4:// loop body}\n}",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Foreach loop",
				range: range,
			},
			{
				label: "if",
				kind: monaco.languages.CompletionItemKind.Keyword,
				insertText: "if (${1:condition})\n{\n    ${2:// if body}\n}",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "If statement",
				range: range,
			},
			{
				label: "try-catch",
				kind: monaco.languages.CompletionItemKind.Snippet,
				insertText:
					"try\n{\n    ${1:// try block}\n}\ncatch (${2:Exception} ${3:ex})\n{\n    ${4:// catch block}\n}",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Try-catch block",
				range: range,
			},
			{
				label: "List<T>",
				kind: monaco.languages.CompletionItemKind.Class,
				insertText: "List<${1:Type}> ${2:list} = new List<${1:Type}>();",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Create a List",
				range: range,
			},
		];

		return { suggestions };
	},
});
