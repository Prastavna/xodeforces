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
			// More standard library types
			{
				label: "HashMap::new",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "HashMap::new()",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Create new HashMap",
				range: range,
			},
			{
				label: "HashSet::new",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "HashSet::new()",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Create new HashSet",
				range: range,
			},
			{
				label: "BTreeMap::new",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "BTreeMap::new()",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Create new BTreeMap",
				range: range,
			},
			{
				label: "BTreeSet::new",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "BTreeSet::new()",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Create new BTreeSet",
				range: range,
			},
			{
				label: "VecDeque::new",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "VecDeque::new()",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Create new VecDeque",
				range: range,
			},
			{
				label: "String::new",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "String::new()",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Create new String",
				range: range,
			},
			{
				label: "String::from",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: 'String::from("${1:text}")',
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Create String from string literal",
				range: range,
			},
			// Option and Result
			{
				label: "Option::Some",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "Some(${1:value})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Option Some variant",
				range: range,
			},
			{
				label: "Option::None",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "None",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Option None variant",
				range: range,
			},
			{
				label: "Result::Ok",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "Ok(${1:value})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Result Ok variant",
				range: range,
			},
			{
				label: "Result::Err",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "Err(${1:error})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Result Err variant",
				range: range,
			},
			// Iterator methods
			{
				label: "map",
				kind: monaco.languages.CompletionItemKind.Method,
				insertText: ".map(|${1:x}| ${2:transformation})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Transform iterator elements",
				range: range,
			},
			{
				label: "filter",
				kind: monaco.languages.CompletionItemKind.Method,
				insertText: ".filter(|${1:x}| ${2:condition})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Filter iterator elements",
				range: range,
			},
			{
				label: "collect",
				kind: monaco.languages.CompletionItemKind.Method,
				insertText: ".collect()",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Collect iterator into collection",
				range: range,
			},
			{
				label: "fold",
				kind: monaco.languages.CompletionItemKind.Method,
				insertText: ".fold(${1:init}, |${2:acc}, ${3:x}| ${4:operation})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Fold iterator into single value",
				range: range,
			},
			{
				label: "reduce",
				kind: monaco.languages.CompletionItemKind.Method,
				insertText: ".reduce(|${1:acc}, ${2:x}| ${3:operation})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Reduce iterator to single value",
				range: range,
			},
			{
				label: "for_each",
				kind: monaco.languages.CompletionItemKind.Method,
				insertText: ".for_each(|${1:x}| ${2:action})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Execute closure for each element",
				range: range,
			},
			{
				label: "enumerate",
				kind: monaco.languages.CompletionItemKind.Method,
				insertText: ".enumerate()",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Add indices to iterator",
				range: range,
			},
			{
				label: "zip",
				kind: monaco.languages.CompletionItemKind.Method,
				insertText: ".zip(${1:other_iterator})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Zip with another iterator",
				range: range,
			},
			// Error handling
			{
				label: "unwrap",
				kind: monaco.languages.CompletionItemKind.Method,
				insertText: ".unwrap()",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Extract value, panic if None/Err",
				range: range,
			},
			{
				label: "expect",
				kind: monaco.languages.CompletionItemKind.Method,
				insertText: '.expect("${1:error message}")',
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Extract value with custom panic message",
				range: range,
			},
			{
				label: "unwrap_or",
				kind: monaco.languages.CompletionItemKind.Method,
				insertText: ".unwrap_or(${1:default})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Extract value or return default",
				range: range,
			},
			{
				label: "unwrap_or_else",
				kind: monaco.languages.CompletionItemKind.Method,
				insertText: ".unwrap_or_else(|| ${1:default_fn})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Extract value or call closure",
				range: range,
			},
			// Pattern matching
			{
				label: "if let",
				kind: monaco.languages.CompletionItemKind.Keyword,
				insertText:
					"if let ${1:pattern} = ${2:expression} {\n    ${3:// body}\n}",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Conditional pattern matching",
				range: range,
			},
			{
				label: "while let",
				kind: monaco.languages.CompletionItemKind.Keyword,
				insertText:
					"while let ${1:pattern} = ${2:expression} {\n    ${3:// body}\n}",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Loop with pattern matching",
				range: range,
			},
			// Traits
			{
				label: "trait",
				kind: monaco.languages.CompletionItemKind.Keyword,
				insertText:
					"trait ${1:TraitName} {\n    fn ${2:method}(&self) ${3:-> ReturnType};\n}",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Define a trait",
				range: range,
			},
			{
				label: "impl trait",
				kind: monaco.languages.CompletionItemKind.Keyword,
				insertText:
					"impl ${1:TraitName} for ${2:TypeName} {\n    fn ${3:method}(&self) ${4:-> ReturnType} {\n        ${5:// implementation}\n    }\n}",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Implement trait for type",
				range: range,
			},
			// Macros
			{
				label: "vec!",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "vec![${1:elements}]",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Create vector with elements",
				range: range,
			},
			{
				label: "format!",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: 'format!("${1:format}", ${2:args})',
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Format string macro",
				range: range,
			},
			{
				label: "panic!",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: 'panic!("${1:message}")',
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Panic with message",
				range: range,
			},
			{
				label: "dbg!",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "dbg!(${1:expression})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Debug print macro",
				range: range,
			},
			{
				label: "assert!",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "assert!(${1:condition});",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Assert condition",
				range: range,
			},
			{
				label: "assert_eq!",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "assert_eq!(${1:left}, ${2:right});",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Assert equality",
				range: range,
			},
			// Memory management
			{
				label: "Box::new",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "Box::new(${1:value})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Allocate value on heap",
				range: range,
			},
			{
				label: "Rc::new",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "Rc::new(${1:value})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Reference counted pointer",
				range: range,
			},
			{
				label: "Arc::new",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "Arc::new(${1:value})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Atomic reference counted pointer",
				range: range,
			},
			{
				label: "RefCell::new",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "RefCell::new(${1:value})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Interior mutability container",
				range: range,
			},
			// More control flow
			{
				label: "loop",
				kind: monaco.languages.CompletionItemKind.Keyword,
				insertText: "loop {\n    ${1:// infinite loop body}\n}",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Infinite loop",
				range: range,
			},
			{
				label: "break",
				kind: monaco.languages.CompletionItemKind.Keyword,
				insertText: "break${1: value};",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Break from loop",
				range: range,
			},
			{
				label: "continue",
				kind: monaco.languages.CompletionItemKind.Keyword,
				insertText: "continue;",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Continue to next iteration",
				range: range,
			},
			{
				label: "return",
				kind: monaco.languages.CompletionItemKind.Keyword,
				insertText: "return${1: value};",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Return from function",
				range: range,
			},
			// Modules and use
			{
				label: "use",
				kind: monaco.languages.CompletionItemKind.Keyword,
				insertText: "use ${1:std::collections::HashMap};",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Import items into scope",
				range: range,
			},
			{
				label: "mod",
				kind: monaco.languages.CompletionItemKind.Keyword,
				insertText: "mod ${1:module_name} {\n    ${2:// module content}\n}",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Define a module",
				range: range,
			},
			{
				label: "pub",
				kind: monaco.languages.CompletionItemKind.Keyword,
				insertText: "pub ${1:item}",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Make item public",
				range: range,
			},
			// Common derives
			{
				label: "#[derive(Debug)]",
				kind: monaco.languages.CompletionItemKind.Snippet,
				insertText: "#[derive(Debug)]",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Derive Debug trait",
				range: range,
			},
			{
				label: "#[derive(Clone)]",
				kind: monaco.languages.CompletionItemKind.Snippet,
				insertText: "#[derive(Clone)]",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Derive Clone trait",
				range: range,
			},
			{
				label: "#[derive(PartialEq)]",
				kind: monaco.languages.CompletionItemKind.Snippet,
				insertText: "#[derive(PartialEq)]",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Derive PartialEq trait",
				range: range,
			},
			// Main function
			{
				label: "main",
				kind: monaco.languages.CompletionItemKind.Snippet,
				insertText: "fn main() {\n    ${1:// main function body}\n}",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Main function",
				range: range,
			},
		];

		return { suggestions };
	},
});
