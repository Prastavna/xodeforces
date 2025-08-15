import * as monaco from "monaco-editor";

monaco.languages.registerCompletionItemProvider("java", {
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
				label: "public class",
				kind: monaco.languages.CompletionItemKind.Snippet,
				insertText: "public class ${1:ClassName} {\n    ${2:// class body}\n}",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Create a public class",
				range: range,
			},
			{
				label: "public static void main",
				kind: monaco.languages.CompletionItemKind.Snippet,
				insertText:
					"public static void main(String[] args) {\n    ${1:// main method body}\n}",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Main method",
				range: range,
			},
			{
				label: "System.out.println",
				kind: monaco.languages.CompletionItemKind.Method,
				insertText: "System.out.println(${1:message});",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Print line to console",
				range: range,
			},
			{
				label: "System.out.print",
				kind: monaco.languages.CompletionItemKind.Method,
				insertText: "System.out.print(${1:message});",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Print to console without newline",
				range: range,
			},
			{
				label: "for loop",
				kind: monaco.languages.CompletionItemKind.Snippet,
				insertText:
					"for (${1:int i = 0}; ${2:i < length}; ${3:i++}) {\n    ${4:// loop body}\n}",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "For loop",
				range: range,
			},
			{
				label: "enhanced for",
				kind: monaco.languages.CompletionItemKind.Snippet,
				insertText:
					"for (${1:Type} ${2:item} : ${3:collection}) {\n    ${4:// loop body}\n}",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Enhanced for loop",
				range: range,
			},
			{
				label: "while",
				kind: monaco.languages.CompletionItemKind.Keyword,
				insertText: "while (${1:condition}) {\n    ${2:// loop body}\n}",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "While loop",
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
				label: "try-catch",
				kind: monaco.languages.CompletionItemKind.Snippet,
				insertText:
					"try {\n    ${1:// try block}\n} catch (${2:Exception} ${3:e}) {\n    ${4:// catch block}\n}",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Try-catch block",
				range: range,
			},
			{
				label: "Scanner",
				kind: monaco.languages.CompletionItemKind.Class,
				insertText: "Scanner ${1:scanner} = new Scanner(System.in);",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Create Scanner for input",
				range: range,
			},
			{
				label: "ArrayList",
				kind: monaco.languages.CompletionItemKind.Class,
				insertText: "ArrayList<${1:Type}> ${2:list} = new ArrayList<>();",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Create ArrayList",
				range: range,
			},
		];

		return { suggestions };
	},
});
