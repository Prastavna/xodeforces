import * as monaco from "monaco-editor";

monaco.languages.registerCompletionItemProvider("rust", {
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
				label: "println!",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: 'println!("${1:message}");',
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Print line macro",
				range: range,
			},
			{
				label: "print!",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: 'print!("${1:message}");',
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Print macro",
				range: range,
			},
			{
				label: "fn",
				kind: monaco.languages.CompletionItemKind.Keyword,
				insertText:
					"fn ${1:function_name}(${2:parameters}) ${3:-> return_type} {\n    ${4:// function body}\n}",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Define a function",
				range: range,
			},
			{
				label: "let",
				kind: monaco.languages.CompletionItemKind.Keyword,
				insertText: "let ${1:variable_name} = ${2:value};",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Variable binding",
				range: range,
			},
			{
				label: "let mut",
				kind: monaco.languages.CompletionItemKind.Keyword,
				insertText: "let mut ${1:variable_name} = ${2:value};",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Mutable variable binding",
				range: range,
			},
			{
				label: "struct",
				kind: monaco.languages.CompletionItemKind.Keyword,
				insertText:
					"struct ${1:StructName} {\n    ${2:field1}: ${3:Type},\n    ${4:field2}: ${5:Type},\n}",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Define a struct",
				range: range,
			},
			{
				label: "impl",
				kind: monaco.languages.CompletionItemKind.Keyword,
				insertText: "impl ${1:StructName} {\n    ${2:// methods}\n}",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Implementation block",
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
					"for ${1:item} in ${2:iterator} {\n    ${3:// loop body}\n}",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "For loop",
				range: range,
			},
			{
				label: "while",
				kind: monaco.languages.CompletionItemKind.Keyword,
				insertText: "while ${1:condition} {\n    ${2:// loop body}\n}",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "While loop",
				range: range,
			},
			{
				label: "match",
				kind: monaco.languages.CompletionItemKind.Keyword,
				insertText:
					"match ${1:expression} {\n    ${2:pattern} => ${3:result},\n    _ => ${4:default},\n}",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Match expression",
				range: range,
			},
			{
				label: "enum",
				kind: monaco.languages.CompletionItemKind.Keyword,
				insertText:
					"enum ${1:EnumName} {\n    ${2:Variant1},\n    ${3:Variant2},\n}",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Define an enum",
				range: range,
			},
			{
				label: "Vec::new",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "Vec::new()",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Create new vector",
				range: range,
			},
		];

		return { suggestions };
	},
});
