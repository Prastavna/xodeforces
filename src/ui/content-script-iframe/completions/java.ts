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
			// More Collections
			{
				label: "HashMap",
				kind: monaco.languages.CompletionItemKind.Class,
				insertText:
					"HashMap<${1:KeyType}, ${2:ValueType}> ${3:map} = new HashMap<>();",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Create HashMap",
				range: range,
			},
			{
				label: "HashSet",
				kind: monaco.languages.CompletionItemKind.Class,
				insertText: "HashSet<${1:Type}> ${2:set} = new HashSet<>();",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Create HashSet",
				range: range,
			},
			{
				label: "LinkedList",
				kind: monaco.languages.CompletionItemKind.Class,
				insertText: "LinkedList<${1:Type}> ${2:list} = new LinkedList<>();",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Create LinkedList",
				range: range,
			},
			{
				label: "TreeMap",
				kind: monaco.languages.CompletionItemKind.Class,
				insertText:
					"TreeMap<${1:KeyType}, ${2:ValueType}> ${3:map} = new TreeMap<>();",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Create TreeMap (sorted)",
				range: range,
			},
			{
				label: "TreeSet",
				kind: monaco.languages.CompletionItemKind.Class,
				insertText: "TreeSet<${1:Type}> ${2:set} = new TreeSet<>();",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Create TreeSet (sorted)",
				range: range,
			},
			{
				label: "Stack",
				kind: monaco.languages.CompletionItemKind.Class,
				insertText: "Stack<${1:Type}> ${2:stack} = new Stack<>();",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Create Stack",
				range: range,
			},
			{
				label: "Queue",
				kind: monaco.languages.CompletionItemKind.Class,
				insertText: "Queue<${1:Type}> ${2:queue} = new LinkedList<>();",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Create Queue using LinkedList",
				range: range,
			},
			{
				label: "PriorityQueue",
				kind: monaco.languages.CompletionItemKind.Class,
				insertText: "PriorityQueue<${1:Type}> ${2:pq} = new PriorityQueue<>();",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Create PriorityQueue",
				range: range,
			},
			{
				label: "ArrayDeque",
				kind: monaco.languages.CompletionItemKind.Class,
				insertText: "ArrayDeque<${1:Type}> ${2:deque} = new ArrayDeque<>();",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Create ArrayDeque",
				range: range,
			},
			// Stream API
			{
				label: "stream",
				kind: monaco.languages.CompletionItemKind.Method,
				insertText: "${1:collection}.stream()",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Create stream from collection",
				range: range,
			},
			{
				label: "filter",
				kind: monaco.languages.CompletionItemKind.Method,
				insertText: ".filter(${1:item} -> ${2:condition})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Filter stream elements",
				range: range,
			},
			{
				label: "map",
				kind: monaco.languages.CompletionItemKind.Method,
				insertText: ".map(${1:item} -> ${2:transformation})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Map stream elements",
				range: range,
			},
			{
				label: "collect",
				kind: monaco.languages.CompletionItemKind.Method,
				insertText: ".collect(Collectors.toList())",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Collect stream to list",
				range: range,
			},
			{
				label: "forEach",
				kind: monaco.languages.CompletionItemKind.Method,
				insertText: ".forEach(${1:item} -> ${2:action})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Execute action for each element",
				range: range,
			},
			{
				label: "reduce",
				kind: monaco.languages.CompletionItemKind.Method,
				insertText: ".reduce(${1:identity}, ${2:(a, b) -> operation})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Reduce stream to single value",
				range: range,
			},
			// Common methods
			{
				label: "Collections.sort",
				kind: monaco.languages.CompletionItemKind.Method,
				insertText: "Collections.sort(${1:list});",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Sort a list",
				range: range,
			},
			{
				label: "Collections.reverse",
				kind: monaco.languages.CompletionItemKind.Method,
				insertText: "Collections.reverse(${1:list});",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Reverse a list",
				range: range,
			},
			{
				label: "Math.max",
				kind: monaco.languages.CompletionItemKind.Method,
				insertText: "Math.max(${1:a}, ${2:b})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Return maximum of two values",
				range: range,
			},
			{
				label: "Math.min",
				kind: monaco.languages.CompletionItemKind.Method,
				insertText: "Math.min(${1:a}, ${2:b})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Return minimum of two values",
				range: range,
			},
			{
				label: "Math.abs",
				kind: monaco.languages.CompletionItemKind.Method,
				insertText: "Math.abs(${1:value})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Return absolute value",
				range: range,
			},
			{
				label: "Math.pow",
				kind: monaco.languages.CompletionItemKind.Method,
				insertText: "Math.pow(${1:base}, ${2:exponent})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Return base raised to exponent",
				range: range,
			},
			{
				label: "Math.sqrt",
				kind: monaco.languages.CompletionItemKind.Method,
				insertText: "Math.sqrt(${1:value})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Return square root",
				range: range,
			},
			// String methods
			{
				label: "String.valueOf",
				kind: monaco.languages.CompletionItemKind.Method,
				insertText: "String.valueOf(${1:value})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Convert value to string",
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
			// More control structures
			{
				label: "switch",
				kind: monaco.languages.CompletionItemKind.Keyword,
				insertText:
					"switch (${1:expression}) {\n    case ${2:value}:\n        ${3:// case body}\n        break;\n    default:\n        ${4:// default case}\n}",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Switch statement",
				range: range,
			},
			{
				label: "do-while",
				kind: monaco.languages.CompletionItemKind.Keyword,
				insertText: "do {\n    ${1:// loop body}\n} while (${2:condition});",
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
					"public ${1:returnType} ${2:methodName}(${3:parameters}) {\n    ${4:// method body}\n}",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Public method declaration",
				range: range,
			},
			{
				label: "private method",
				kind: monaco.languages.CompletionItemKind.Snippet,
				insertText:
					"private ${1:returnType} ${2:methodName}(${3:parameters}) {\n    ${4:// method body}\n}",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Private method declaration",
				range: range,
			},
			{
				label: "static method",
				kind: monaco.languages.CompletionItemKind.Snippet,
				insertText:
					"public static ${1:returnType} ${2:methodName}(${3:parameters}) {\n    ${4:// method body}\n}",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Static method declaration",
				range: range,
			},
			// Import statements
			{
				label: "import java.util.*",
				kind: monaco.languages.CompletionItemKind.Snippet,
				insertText: "import java.util.*;",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Import all util classes",
				range: range,
			},
			{
				label: "import java.io.*",
				kind: monaco.languages.CompletionItemKind.Snippet,
				insertText: "import java.io.*;",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Import all IO classes",
				range: range,
			},
			{
				label: "import java.util.stream.*",
				kind: monaco.languages.CompletionItemKind.Snippet,
				insertText: "import java.util.stream.*;",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Import stream API",
				range: range,
			},
			// Lambda expressions
			{
				label: "lambda",
				kind: monaco.languages.CompletionItemKind.Snippet,
				insertText: "(${1:params}) -> ${2:expression}",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Lambda expression",
				range: range,
			},
			{
				label: "lambda block",
				kind: monaco.languages.CompletionItemKind.Snippet,
				insertText: "(${1:params}) -> {\n    ${2:// lambda body}\n}",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Lambda expression with block body",
				range: range,
			},
		];

		return { suggestions };
	},
});
