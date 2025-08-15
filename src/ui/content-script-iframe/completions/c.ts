import * as monaco from "monaco-editor";

monaco.languages.registerCompletionItemProvider("c", {
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
				label: "#include <stdio.h>",
				kind: monaco.languages.CompletionItemKind.Snippet,
				insertText: "#include <stdio.h>",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Include standard I/O header",
				range: range,
			},
			{
				label: "#include <stdlib.h>",
				kind: monaco.languages.CompletionItemKind.Snippet,
				insertText: "#include <stdlib.h>",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Include standard library header",
				range: range,
			},
			{
				label: "#include <string.h>",
				kind: monaco.languages.CompletionItemKind.Snippet,
				insertText: "#include <string.h>",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Include string header",
				range: range,
			},
			{
				label: "printf",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: 'printf("${1:format}", ${2:args});',
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Print formatted output",
				range: range,
			},
			{
				label: "scanf",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: 'scanf("${1:format}", ${2:&variable});',
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Read formatted input",
				range: range,
			},
			{
				label: "main function",
				kind: monaco.languages.CompletionItemKind.Snippet,
				insertText:
					"int main() {\n    ${1:// main function body}\n    return 0;\n}",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Main function",
				range: range,
			},
			{
				label: "main with args",
				kind: monaco.languages.CompletionItemKind.Snippet,
				insertText:
					"int main(int argc, char *argv[]) {\n    ${1:// main function body}\n    return 0;\n}",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Main function with arguments",
				range: range,
			},
			{
				label: "for loop",
				kind: monaco.languages.CompletionItemKind.Snippet,
				insertText:
					"for (${1:int i = 0}; ${2:i < size}; ${3:i++}) {\n    ${4:// loop body}\n}",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "For loop",
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
				label: "switch",
				kind: monaco.languages.CompletionItemKind.Keyword,
				insertText:
					"switch (${1:expression}) {\n    case ${2:value1}:\n        ${3:// case body}\n        break;\n    case ${4:value2}:\n        ${5:// case body}\n        break;\n    default:\n        ${6:// default case}\n        break;\n}",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Switch statement",
				range: range,
			},
			{
				label: "function",
				kind: monaco.languages.CompletionItemKind.Keyword,
				insertText:
					"${1:returnType} ${2:functionName}(${3:parameters}) {\n    ${4:// function body}\n}",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Define a function",
				range: range,
			},
			{
				label: "struct",
				kind: monaco.languages.CompletionItemKind.Keyword,
				insertText: "struct ${1:StructName} {\n    ${2:// struct members}\n};",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Define a struct",
				range: range,
			},
			{
				label: "typedef struct",
				kind: monaco.languages.CompletionItemKind.Snippet,
				insertText:
					"typedef struct {\n    ${1:// struct members}\n} ${2:TypeName};",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Define a typedef struct",
				range: range,
			},
			{
				label: "malloc",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "malloc(${1:size} * sizeof(${2:type}))",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Allocate memory",
				range: range,
			},
			{
				label: "free",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "free(${1:pointer});",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Free allocated memory",
				range: range,
			},
			{
				label: "strlen",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "strlen(${1:string})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Get string length",
				range: range,
			},
			{
				label: "strcpy",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "strcpy(${1:dest}, ${2:src});",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Copy string",
				range: range,
			},
			{
				label: "strcmp",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "strcmp(${1:str1}, ${2:str2})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Compare strings",
				range: range,
			},
			{
				label: "FILE pointer",
				kind: monaco.languages.CompletionItemKind.Snippet,
				insertText: 'FILE *${1:fp} = fopen("${2:filename}", "${3:mode}");',
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Open file",
				range: range,
			},
			{
				label: "fprintf",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: 'fprintf(${1:fp}, "${2:format}", ${3:args});',
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Write formatted output to file",
				range: range,
			},
			{
				label: "fclose",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "fclose(${1:fp});",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Close file",
				range: range,
			},
		];

		return { suggestions };
	},
});
