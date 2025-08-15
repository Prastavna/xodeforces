import * as monaco from "monaco-editor";

monaco.languages.registerCompletionItemProvider("cpp", {
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
				label: "#include <iostream>",
				kind: monaco.languages.CompletionItemKind.Snippet,
				insertText: "#include <iostream>",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Include iostream header",
				range: range,
			},
			{
				label: "#include <vector>",
				kind: monaco.languages.CompletionItemKind.Snippet,
				insertText: "#include <vector>",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Include vector header",
				range: range,
			},
			{
				label: "#include <string>",
				kind: monaco.languages.CompletionItemKind.Snippet,
				insertText: "#include <string>",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Include string header",
				range: range,
			},
			{
				label: "std::cout",
				kind: monaco.languages.CompletionItemKind.Method,
				insertText: "std::cout << ${1:value} << std::endl;",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Output to console",
				range: range,
			},
			{
				label: "std::cin",
				kind: monaco.languages.CompletionItemKind.Method,
				insertText: "std::cin >> ${1:variable};",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Input from console",
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
				label: "class",
				kind: monaco.languages.CompletionItemKind.Keyword,
				insertText:
					"class ${1:ClassName} {\npublic:\n    ${2:// public members}\nprivate:\n    ${3:// private members}\n};",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Define a class",
				range: range,
			},
			{
				label: "for loop",
				kind: monaco.languages.CompletionItemKind.Snippet,
				insertText:
					"for (${1:int i = 0}; ${2:i < size}; ${3:++i}) {\n    ${4:// loop body}\n}",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "For loop",
				range: range,
			},
			{
				label: "range-based for",
				kind: monaco.languages.CompletionItemKind.Snippet,
				insertText:
					"for (${1:const auto&} ${2:item} : ${3:container}) {\n    ${4:// loop body}\n}",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Range-based for loop",
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
					"try {\n    ${1:// try block}\n} catch (${2:const std::exception&} ${3:e}) {\n    ${4:// catch block}\n}",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Try-catch block",
				range: range,
			},
			{
				label: "std::vector",
				kind: monaco.languages.CompletionItemKind.Class,
				insertText: "std::vector<${1:Type}> ${2:vectorName};",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Create a vector",
				range: range,
			},
			{
				label: "std::string",
				kind: monaco.languages.CompletionItemKind.Class,
				insertText: 'std::string ${1:stringName} = "${2:value}";',
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Create a string",
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
				label: "namespace",
				kind: monaco.languages.CompletionItemKind.Keyword,
				insertText:
					"namespace ${1:namespaceName} {\n    ${2:// namespace content}\n}",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Define a namespace",
				range: range,
			},
			{
				label: "using namespace std",
				kind: monaco.languages.CompletionItemKind.Snippet,
				insertText: "using namespace std;",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Use standard namespace",
				range: range,
			},
			{
				label: "template",
				kind: monaco.languages.CompletionItemKind.Keyword,
				insertText:
					"template<${1:typename T}>\n${2:returnType} ${3:functionName}(${4:parameters}) {\n    ${5:// template function body}\n}",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Template function",
				range: range,
			},
			{
				label: "std::shared_ptr",
				kind: monaco.languages.CompletionItemKind.Class,
				insertText:
					"std::shared_ptr<${1:Type}> ${2:ptrName} = std::make_shared<${1:Type}>(${3:args});",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Smart pointer",
				range: range,
			},
			{
				label: "std::unique_ptr",
				kind: monaco.languages.CompletionItemKind.Class,
				insertText:
					"std::unique_ptr<${1:Type}> ${2:ptrName} = std::make_unique<${1:Type}>(${3:args});",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Unique pointer",
				range: range,
			},
		];

		return { suggestions };
	},
});
