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
			// More collections
			{
				label: "Dictionary<TKey, TValue>",
				kind: monaco.languages.CompletionItemKind.Class,
				insertText:
					"Dictionary<${1:KeyType}, ${2:ValueType}> ${3:dict} = new Dictionary<${1:KeyType}, ${2:ValueType}>();",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Create a Dictionary",
				range: range,
			},
			{
				label: "HashSet<T>",
				kind: monaco.languages.CompletionItemKind.Class,
				insertText: "HashSet<${1:Type}> ${2:set} = new HashSet<${1:Type}>();",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Create a HashSet",
				range: range,
			},
			{
				label: "Queue<T>",
				kind: monaco.languages.CompletionItemKind.Class,
				insertText: "Queue<${1:Type}> ${2:queue} = new Queue<${1:Type}>();",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Create a Queue",
				range: range,
			},
			{
				label: "Stack<T>",
				kind: monaco.languages.CompletionItemKind.Class,
				insertText: "Stack<${1:Type}> ${2:stack} = new Stack<${1:Type}>();",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Create a Stack",
				range: range,
			},
			{
				label: "SortedList<TKey, TValue>",
				kind: monaco.languages.CompletionItemKind.Class,
				insertText:
					"SortedList<${1:KeyType}, ${2:ValueType}> ${3:sortedList} = new SortedList<${1:KeyType}, ${2:ValueType}>();",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Create a SortedList",
				range: range,
			},
			{
				label: "SortedSet<T>",
				kind: monaco.languages.CompletionItemKind.Class,
				insertText:
					"SortedSet<${1:Type}> ${2:sortedSet} = new SortedSet<${1:Type}>();",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Create a SortedSet",
				range: range,
			},
			// LINQ
			{
				label: "Where",
				kind: monaco.languages.CompletionItemKind.Method,
				insertText: ".Where(${1:x} => ${2:condition})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Filter collection elements",
				range: range,
			},
			{
				label: "Select",
				kind: monaco.languages.CompletionItemKind.Method,
				insertText: ".Select(${1:x} => ${2:transformation})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Transform collection elements",
				range: range,
			},
			{
				label: "OrderBy",
				kind: monaco.languages.CompletionItemKind.Method,
				insertText: ".OrderBy(${1:x} => ${2:keySelector})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Sort collection in ascending order",
				range: range,
			},
			{
				label: "OrderByDescending",
				kind: monaco.languages.CompletionItemKind.Method,
				insertText: ".OrderByDescending(${1:x} => ${2:keySelector})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Sort collection in descending order",
				range: range,
			},
			{
				label: "GroupBy",
				kind: monaco.languages.CompletionItemKind.Method,
				insertText: ".GroupBy(${1:x} => ${2:keySelector})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Group collection elements",
				range: range,
			},
			{
				label: "ToList",
				kind: monaco.languages.CompletionItemKind.Method,
				insertText: ".ToList()",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Convert to List",
				range: range,
			},
			{
				label: "ToArray",
				kind: monaco.languages.CompletionItemKind.Method,
				insertText: ".ToArray()",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Convert to Array",
				range: range,
			},
			{
				label: "Any",
				kind: monaco.languages.CompletionItemKind.Method,
				insertText: ".Any(${1:x => condition})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Check if any element matches condition",
				range: range,
			},
			{
				label: "All",
				kind: monaco.languages.CompletionItemKind.Method,
				insertText: ".All(${1:x => condition})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Check if all elements match condition",
				range: range,
			},
			{
				label: "Count",
				kind: monaco.languages.CompletionItemKind.Method,
				insertText: ".Count(${1:x => condition})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Count elements matching condition",
				range: range,
			},
			{
				label: "FirstOrDefault",
				kind: monaco.languages.CompletionItemKind.Method,
				insertText: ".FirstOrDefault(${1:x => condition})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Get first element or default",
				range: range,
			},
			{
				label: "Sum",
				kind: monaco.languages.CompletionItemKind.Method,
				insertText: ".Sum(${1:x => selector})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Sum elements",
				range: range,
			},
			{
				label: "Max",
				kind: monaco.languages.CompletionItemKind.Method,
				insertText: ".Max(${1:x => selector})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Get maximum element",
				range: range,
			},
			{
				label: "Min",
				kind: monaco.languages.CompletionItemKind.Method,
				insertText: ".Min(${1:x => selector})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Get minimum element",
				range: range,
			},
			// String methods
			{
				label: "string.Format",
				kind: monaco.languages.CompletionItemKind.Method,
				insertText: 'string.Format("${1:format}", ${2:args})',
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Format string with arguments",
				range: range,
			},
			{
				label: "string.Join",
				kind: monaco.languages.CompletionItemKind.Method,
				insertText: 'string.Join("${1:separator}", ${2:values})',
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Join strings with separator",
				range: range,
			},
			{
				label: "StringBuilder",
				kind: monaco.languages.CompletionItemKind.Class,
				insertText: "StringBuilder ${1:sb} = new StringBuilder();",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Create StringBuilder for efficient string operations",
				range: range,
			},
			// Math methods
			{
				label: "Math.Max",
				kind: monaco.languages.CompletionItemKind.Method,
				insertText: "Math.Max(${1:a}, ${2:b})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Return maximum of two values",
				range: range,
			},
			{
				label: "Math.Min",
				kind: monaco.languages.CompletionItemKind.Method,
				insertText: "Math.Min(${1:a}, ${2:b})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Return minimum of two values",
				range: range,
			},
			{
				label: "Math.Abs",
				kind: monaco.languages.CompletionItemKind.Method,
				insertText: "Math.Abs(${1:value})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Return absolute value",
				range: range,
			},
			{
				label: "Math.Pow",
				kind: monaco.languages.CompletionItemKind.Method,
				insertText: "Math.Pow(${1:base}, ${2:exponent})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Return base raised to exponent",
				range: range,
			},
			{
				label: "Math.Sqrt",
				kind: monaco.languages.CompletionItemKind.Method,
				insertText: "Math.Sqrt(${1:value})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Return square root",
				range: range,
			},
			{
				label: "Math.Round",
				kind: monaco.languages.CompletionItemKind.Method,
				insertText: "Math.Round(${1:value}, ${2:digits})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Round to specified digits",
				range: range,
			},
			// More control structures
			{
				label: "switch",
				kind: monaco.languages.CompletionItemKind.Keyword,
				insertText:
					"switch (${1:expression})\n{\n    case ${2:value1}:\n        ${3:// case 1}\n        break;\n    case ${4:value2}:\n        ${5:// case 2}\n        break;\n    default:\n        ${6:// default case}\n        break;\n}",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Switch statement",
				range: range,
			},
			{
				label: "while",
				kind: monaco.languages.CompletionItemKind.Keyword,
				insertText: "while (${1:condition})\n{\n    ${2:// loop body}\n}",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "While loop",
				range: range,
			},
			{
				label: "do-while",
				kind: monaco.languages.CompletionItemKind.Keyword,
				insertText: "do\n{\n    ${1:// loop body}\n}\nwhile (${2:condition});",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Do-while loop",
				range: range,
			},
			// Method declarations
			{
				label: "public method",
				kind: monaco.languages.CompletionItemKind.Snippet,
				insertText:
					"public ${1:returnType} ${2:MethodName}(${3:parameters})\n{\n    ${4:// method body}\n}",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Public method declaration",
				range: range,
			},
			{
				label: "private method",
				kind: monaco.languages.CompletionItemKind.Snippet,
				insertText:
					"private ${1:returnType} ${2:MethodName}(${3:parameters})\n{\n    ${4:// method body}\n}",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Private method declaration",
				range: range,
			},
			{
				label: "static method",
				kind: monaco.languages.CompletionItemKind.Snippet,
				insertText:
					"public static ${1:returnType} ${2:MethodName}(${3:parameters})\n{\n    ${4:// method body}\n}",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Static method declaration",
				range: range,
			},
			// Properties
			{
				label: "property",
				kind: monaco.languages.CompletionItemKind.Snippet,
				insertText: "public ${1:Type} ${2:PropertyName} { get; set; }",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Auto-implemented property",
				range: range,
			},
			{
				label: "property with backing field",
				kind: monaco.languages.CompletionItemKind.Snippet,
				insertText:
					"private ${1:Type} ${2:_field};\npublic ${1:Type} ${3:PropertyName}\n{\n    get { return ${2:_field}; }\n    set { ${2:_field} = value; }\n}",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Property with backing field",
				range: range,
			},
			// Common using statements
			{
				label: "using System.Collections.Generic",
				kind: monaco.languages.CompletionItemKind.Snippet,
				insertText: "using System.Collections.Generic;",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Import collections namespace",
				range: range,
			},
			{
				label: "using System.Linq",
				kind: monaco.languages.CompletionItemKind.Snippet,
				insertText: "using System.Linq;",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Import LINQ namespace",
				range: range,
			},
			{
				label: "using System.Text",
				kind: monaco.languages.CompletionItemKind.Snippet,
				insertText: "using System.Text;",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Import text namespace",
				range: range,
			},
			{
				label: "using System.IO",
				kind: monaco.languages.CompletionItemKind.Snippet,
				insertText: "using System.IO;",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Import IO namespace",
				range: range,
			},
			// Lambda expressions
			{
				label: "lambda",
				kind: monaco.languages.CompletionItemKind.Snippet,
				insertText: "${1:x} => ${2:expression}",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Lambda expression",
				range: range,
			},
			{
				label: "lambda block",
				kind: monaco.languages.CompletionItemKind.Snippet,
				insertText: "${1:x} => {\n    ${2:// lambda body}\n}",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Lambda expression with block body",
				range: range,
			},
			// Exception handling
			{
				label: "try-catch-finally",
				kind: monaco.languages.CompletionItemKind.Snippet,
				insertText:
					"try\n{\n    ${1:// try block}\n}\ncatch (${2:Exception} ${3:ex})\n{\n    ${4:// catch block}\n}\nfinally\n{\n    ${5:// finally block}\n}",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Try-catch-finally block",
				range: range,
			},
			{
				label: "throw",
				kind: monaco.languages.CompletionItemKind.Keyword,
				insertText: 'throw new ${1:Exception}("${2:message}");',
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Throw exception",
				range: range,
			},
			// File operations
			{
				label: "File.ReadAllText",
				kind: monaco.languages.CompletionItemKind.Method,
				insertText: "File.ReadAllText(${1:path})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Read all text from file",
				range: range,
			},
			{
				label: "File.WriteAllText",
				kind: monaco.languages.CompletionItemKind.Method,
				insertText: "File.WriteAllText(${1:path}, ${2:content})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Write all text to file",
				range: range,
			},
		];

		return { suggestions };
	},
});
