import * as monaco from "monaco-editor";

// Configure enhanced language support
export function setupLanguageSupport() {
	// 1. PYTHON INTELLISENSE (Enhanced)
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

	// 2. JAVA INTELLISENSE (Enhanced)
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
					insertText:
						"public class ${1:ClassName} {\n    ${2:// class body}\n}",
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

	// 3. C# INTELLISENSE (Enhanced)
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
					insertText:
						"public class ${1:ClassName}\n{\n    ${2:// class body}\n}",
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

	// 4. PHP INTELLISENSE (Enhanced)
	monaco.languages.registerCompletionItemProvider("php", {
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
					label: "echo",
					kind: monaco.languages.CompletionItemKind.Function,
					insertText: "echo ${1:value};",
					insertTextRules:
						monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
					documentation: "Output one or more strings",
					range: range,
				},
				{
					label: "print",
					kind: monaco.languages.CompletionItemKind.Function,
					insertText: "print ${1:value};",
					insertTextRules:
						monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
					documentation: "Output a string",
					range: range,
				},
				{
					label: "var_dump",
					kind: monaco.languages.CompletionItemKind.Function,
					insertText: "var_dump(${1:variable});",
					insertTextRules:
						monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
					documentation: "Display information about a variable",
					range: range,
				},
				{
					label: "function",
					kind: monaco.languages.CompletionItemKind.Keyword,
					insertText:
						"function ${1:functionName}(${2:parameters}) {\n    ${3:// function body}\n}",
					insertTextRules:
						monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
					documentation: "Define a function",
					range: range,
				},
				{
					label: "class",
					kind: monaco.languages.CompletionItemKind.Keyword,
					insertText: "class ${1:ClassName} {\n    ${2:// class body}\n}",
					insertTextRules:
						monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
					documentation: "Define a class",
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
					label: "foreach",
					kind: monaco.languages.CompletionItemKind.Keyword,
					insertText:
						"foreach (${1:$array} as ${2:$value}) {\n    ${3:// loop body}\n}",
					insertTextRules:
						monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
					documentation: "Foreach loop",
					range: range,
				},
				{
					label: "for",
					kind: monaco.languages.CompletionItemKind.Keyword,
					insertText:
						"for (${1:$i = 0}; ${2:$i < $length}; ${3:$i++}) {\n    ${4:// loop body}\n}",
					insertTextRules:
						monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
					documentation: "For loop",
					range: range,
				},
				{
					label: "$_GET",
					kind: monaco.languages.CompletionItemKind.Variable,
					insertText: "$_GET[${1:'key'}]",
					insertTextRules:
						monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
					documentation: "HTTP GET variables",
					range: range,
				},
				{
					label: "$_POST",
					kind: monaco.languages.CompletionItemKind.Variable,
					insertText: "$_POST[${1:'key'}]",
					insertTextRules:
						monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
					documentation: "HTTP POST variables",
					range: range,
				},
				{
					label: "$_SESSION",
					kind: monaco.languages.CompletionItemKind.Variable,
					insertText: "$_SESSION[${1:'key'}]",
					insertTextRules:
						monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
					documentation: "Session variables",
					range: range,
				},
				{
					label: "isset",
					kind: monaco.languages.CompletionItemKind.Function,
					insertText: "isset(${1:$variable})",
					insertTextRules:
						monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
					documentation: "Check if variable is set",
					range: range,
				},
				{
					label: "array",
					kind: monaco.languages.CompletionItemKind.Function,
					insertText: "array(${1:elements})",
					insertTextRules:
						monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
					documentation: "Create an array",
					range: range,
				},
			];

			return { suggestions };
		},
	});

	// 5. SQL INTELLISENSE (Enhanced)
	monaco.languages.registerCompletionItemProvider("sql", {
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
					label: "SELECT",
					kind: monaco.languages.CompletionItemKind.Keyword,
					insertText: "SELECT ${1:columns} FROM ${2:table}",
					insertTextRules:
						monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
					documentation: "Select data from database",
					range: range,
				},
				{
					label: "INSERT INTO",
					kind: monaco.languages.CompletionItemKind.Keyword,
					insertText:
						"INSERT INTO ${1:table} (${2:columns}) VALUES (${3:values})",
					insertTextRules:
						monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
					documentation: "Insert data into table",
					range: range,
				},
				{
					label: "UPDATE",
					kind: monaco.languages.CompletionItemKind.Keyword,
					insertText:
						"UPDATE ${1:table} SET ${2:column} = ${3:value} WHERE ${4:condition}",
					insertTextRules:
						monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
					documentation: "Update data in table",
					range: range,
				},
				{
					label: "DELETE FROM",
					kind: monaco.languages.CompletionItemKind.Keyword,
					insertText: "DELETE FROM ${1:table} WHERE ${2:condition}",
					insertTextRules:
						monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
					documentation: "Delete data from table",
					range: range,
				},
				{
					label: "CREATE TABLE",
					kind: monaco.languages.CompletionItemKind.Keyword,
					insertText:
						"CREATE TABLE ${1:table_name} (\n    ${2:column1} ${3:datatype},\n    ${4:column2} ${5:datatype}\n)",
					insertTextRules:
						monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
					documentation: "Create a new table",
					range: range,
				},
				{
					label: "ALTER TABLE",
					kind: monaco.languages.CompletionItemKind.Keyword,
					insertText:
						"ALTER TABLE ${1:table_name} ${2:ADD COLUMN ${3:column_name} ${4:datatype}}",
					insertTextRules:
						monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
					documentation: "Alter table structure",
					range: range,
				},
				{
					label: "DROP TABLE",
					kind: monaco.languages.CompletionItemKind.Keyword,
					insertText: "DROP TABLE ${1:table_name}",
					insertTextRules:
						monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
					documentation: "Drop a table",
					range: range,
				},
				{
					label: "JOIN",
					kind: monaco.languages.CompletionItemKind.Keyword,
					insertText:
						"JOIN ${1:table2} ON ${2:table1.column} = ${3:table2.column}",
					insertTextRules:
						monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
					documentation: "Join tables",
					range: range,
				},
				{
					label: "LEFT JOIN",
					kind: monaco.languages.CompletionItemKind.Keyword,
					insertText:
						"LEFT JOIN ${1:table2} ON ${2:table1.column} = ${3:table2.column}",
					insertTextRules:
						monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
					documentation: "Left join tables",
					range: range,
				},
				{
					label: "GROUP BY",
					kind: monaco.languages.CompletionItemKind.Keyword,
					insertText: "GROUP BY ${1:column}",
					insertTextRules:
						monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
					documentation: "Group results by column",
					range: range,
				},
				{
					label: "ORDER BY",
					kind: monaco.languages.CompletionItemKind.Keyword,
					insertText: "ORDER BY ${1:column} ${2:ASC}",
					insertTextRules:
						monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
					documentation: "Order results",
					range: range,
				},
				{
					label: "WHERE",
					kind: monaco.languages.CompletionItemKind.Keyword,
					insertText: "WHERE ${1:condition}",
					insertTextRules:
						monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
					documentation: "Filter results",
					range: range,
				},
			];

			return { suggestions };
		},
	});

	// 6. GO INTELLISENSE (Enhanced)
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

	// 7. RUST INTELLISENSE (Enhanced)
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

	// 8. C++ INTELLISENSE (New)
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

	// 9. C INTELLISENSE (New)
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
					insertText:
						"struct ${1:StructName} {\n    ${2:// struct members}\n};",
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
}

// Add hover providers for better IntelliSense experience
export function setupHoverProviders() {
	// Python hover provider
	monaco.languages.registerHoverProvider("python", {
		provideHover: (model, position) => {
			const word = model.getWordAtPosition(position);
			if (!word) return;

			const hoverInfo: Record<string, string> = {
				print: "Built-in function that prints values to stdout",
				len: "Built-in function that returns the length of an object",
				range: "Built-in function that generates a sequence of numbers",
				input: "Built-in function that reads a string from stdin",
				int: "Built-in function that converts a value to integer",
				str: "Built-in function that converts a value to string",
				float: "Built-in function that converts a value to float",
				def: "Keyword used to define a function",
				class: "Keyword used to define a class",
				if: "Conditional statement keyword",
				for: "Loop statement keyword",
				while: "Loop statement keyword",
			};

			if (hoverInfo[word.word]) {
				return {
					range: new monaco.Range(
						position.lineNumber,
						word.startColumn,
						position.lineNumber,
						word.endColumn,
					),
					contents: [
						{ value: `**${word.word}**` },
						{ value: hoverInfo[word.word] },
					],
				};
			}
		},
	});

	// Java hover provider
	monaco.languages.registerHoverProvider("java", {
		provideHover: (model, position) => {
			const word = model.getWordAtPosition(position);
			if (!word) return;

			const hoverInfo: Record<string, string> = {
				System:
					"Final class that contains several useful class fields and methods",
				String: "Class representing character strings",
				ArrayList: "Resizable array implementation of the List interface",
				Scanner: "Simple text scanner for parsing primitive types and strings",
				public: "Access modifier - accessible from anywhere",
				private: "Access modifier - accessible only within the same class",
				static: "Belongs to the class rather than instance",
				void: "Method returns no value",
			};

			if (hoverInfo[word.word]) {
				return {
					range: new monaco.Range(
						position.lineNumber,
						word.startColumn,
						position.lineNumber,
						word.endColumn,
					),
					contents: [
						{ value: `**${word.word}**` },
						{ value: hoverInfo[word.word] },
					],
				};
			}
		},
	});

	// C++ hover provider
	monaco.languages.registerHoverProvider("cpp", {
		provideHover: (model, position) => {
			const word = model.getWordAtPosition(position);
			if (!word) return;

			const hoverInfo: Record<string, string> = {
				std: "Standard namespace containing C++ standard library",
				cout: "Standard output stream object",
				cin: "Standard input stream object",
				endl: "Inserts newline and flushes output stream",
				vector: "Dynamic array container",
				string: "String class for handling sequences of characters",
				shared_ptr: "Smart pointer that shares ownership of an object",
				unique_ptr: "Smart pointer that owns an object exclusively",
				template: "Defines generic classes or functions",
				namespace: "Declarative region that provides scope to identifiers",
			};

			if (hoverInfo[word.word]) {
				return {
					range: new monaco.Range(
						position.lineNumber,
						word.startColumn,
						position.lineNumber,
						word.endColumn,
					),
					contents: [
						{ value: `**${word.word}**` },
						{ value: hoverInfo[word.word] },
					],
				};
			}
		},
	});

	// C hover provider
	monaco.languages.registerHoverProvider("c", {
		provideHover: (model, position) => {
			const word = model.getWordAtPosition(position);
			if (!word) return;

			const hoverInfo: Record<string, string> = {
				printf: "Formatted output function - prints to stdout",
				scanf: "Formatted input function - reads from stdin",
				malloc: "Memory allocation function - allocates memory dynamically",
				free: "Memory deallocation function - frees allocated memory",
				strlen: "String length function - returns length of string",
				strcpy: "String copy function - copies one string to another",
				strcmp: "String compare function - compares two strings",
				FILE: "File pointer type for file operations",
				fopen: "File open function - opens a file",
				fclose: "File close function - closes a file",
				fprintf: "Formatted file output function",
				int: "Integer data type",
				char: "Character data type",
				float: "Floating point data type",
				double: "Double precision floating point data type",
			};

			if (hoverInfo[word.word]) {
				return {
					range: new monaco.Range(
						position.lineNumber,
						word.startColumn,
						position.lineNumber,
						word.endColumn,
					),
					contents: [
						{ value: `**${word.word}**` },
						{ value: hoverInfo[word.word] },
					],
				};
			}
		},
	});

	// C# hover provider
	monaco.languages.registerHoverProvider("csharp", {
		provideHover: (model, position) => {
			const word = model.getWordAtPosition(position);
			if (!word) return;

			const hoverInfo: Record<string, string> = {
				Console: "Represents the standard input, output, and error streams",
				WriteLine: "Writes the specified data followed by a line terminator",
				ReadLine:
					"Reads the next line of characters from the standard input stream",
				string: "Represents text as a sequence of UTF-16 code units",
				int: "32-bit signed integer data type",
				bool: "Boolean data type (true or false)",
				var: "Implicitly typed local variable",
				List: "Generic list collection",
				using: "Directive to include namespace or dispose pattern",
				namespace: "Keyword to declare a scope for types",
			};

			if (hoverInfo[word.word]) {
				return {
					range: new monaco.Range(
						position.lineNumber,
						word.startColumn,
						position.lineNumber,
						word.endColumn,
					),
					contents: [
						{ value: `**${word.word}**` },
						{ value: hoverInfo[word.word] },
					],
				};
			}
		},
	});

	// PHP hover provider
	monaco.languages.registerHoverProvider("php", {
		provideHover: (model, position) => {
			const word = model.getWordAtPosition(position);
			if (!word) return;

			const hoverInfo: Record<string, string> = {
				echo: "Output one or more strings",
				print: "Output a string",
				var_dump: "Display structured information about variables",
				isset: "Determine if a variable is declared and is different than NULL",
				array: "Create an array",
				$_GET: "Associative array containing HTTP GET variables",
				$_POST: "Associative array containing HTTP POST variables",
				$_SESSION: "Associative array containing session variables",
				function: "Keyword to define a function",
				class: "Keyword to define a class",
				foreach: "Loop construct for iterating over arrays",
			};

			if (hoverInfo[word.word]) {
				return {
					range: new monaco.Range(
						position.lineNumber,
						word.startColumn,
						position.lineNumber,
						word.endColumn,
					),
					contents: [
						{ value: `**${word.word}**` },
						{ value: hoverInfo[word.word] },
					],
				};
			}
		},
	});

	// SQL hover provider
	monaco.languages.registerHoverProvider("sql", {
		provideHover: (model, position) => {
			const word = model.getWordAtPosition(position);
			if (!word) return;

			const hoverInfo: Record<string, string> = {
				SELECT: "Query command to retrieve data from database tables",
				INSERT: "Command to add new records to a table",
				UPDATE: "Command to modify existing records in a table",
				DELETE: "Command to remove records from a table",
				CREATE: "Command to create database objects like tables",
				ALTER: "Command to modify the structure of database objects",
				DROP: "Command to delete database objects",
				JOIN: "Combine rows from two or more tables",
				WHERE: "Filter records based on specified conditions",
				"GROUP BY": "Group rows that have the same values",
				"ORDER BY": "Sort the result set",
				HAVING: "Filter groups based on conditions",
			};

			if (hoverInfo[word.word.toUpperCase()]) {
				return {
					range: new monaco.Range(
						position.lineNumber,
						word.startColumn,
						position.lineNumber,
						word.endColumn,
					),
					contents: [
						{ value: `**${word.word.toUpperCase()}**` },
						{ value: hoverInfo[word.word.toUpperCase()] },
					],
				};
			}
		},
	});

	// Go hover provider
	monaco.languages.registerHoverProvider("go", {
		provideHover: (model, position) => {
			const word = model.getWordAtPosition(position);
			if (!word) return;

			const hoverInfo: Record<string, string> = {
				fmt: "Package implementing formatted I/O functions",
				Println: "Formats using default formats and writes to standard output",
				Printf:
					"Formats according to a format specifier and writes to standard output",
				func: "Keyword to declare a function",
				package: "Keyword to declare a package",
				import: "Keyword to import packages",
				struct: "Keyword to define a struct type",
				interface: "Keyword to define an interface type",
				make: "Built-in function to create slices, maps, and channels",
				var: "Keyword to declare variables",
				const: "Keyword to declare constants",
			};

			if (hoverInfo[word.word]) {
				return {
					range: new monaco.Range(
						position.lineNumber,
						word.startColumn,
						position.lineNumber,
						word.endColumn,
					),
					contents: [
						{ value: `**${word.word}**` },
						{ value: hoverInfo[word.word] },
					],
				};
			}
		},
	});

	// Rust hover provider
	monaco.languages.registerHoverProvider("rust", {
		provideHover: (model, position) => {
			const word = model.getWordAtPosition(position);
			if (!word) return;

			const hoverInfo: Record<string, string> = {
				"println!": "Macro that prints text to stdout with a newline",
				"print!": "Macro that prints text to stdout without a newline",
				fn: "Keyword to define a function",
				let: "Keyword to create variable bindings",
				mut: "Keyword to make variable bindings mutable",
				struct: "Keyword to define a struct",
				enum: "Keyword to define an enumeration",
				impl: "Keyword to define implementations for structs/enums",
				match: "Control flow operator for pattern matching",
				Vec: "Growable array type provided by the standard library",
				String: "UTF-8 encoded, growable string",
				Option: "Enum representing optional values",
				Result: "Enum for recoverable errors",
			};

			if (hoverInfo[word.word]) {
				return {
					range: new monaco.Range(
						position.lineNumber,
						word.startColumn,
						position.lineNumber,
						word.endColumn,
					),
					contents: [
						{ value: `**${word.word}**` },
						{ value: hoverInfo[word.word] },
					],
				};
			}
		},
	});
}

// Additional language configuration for better syntax support
export function setupLanguageConfiguration() {
	// Enhanced C++ language configuration
	monaco.languages.setLanguageConfiguration("cpp", {
		comments: {
			lineComment: "//",
			blockComment: ["/*", "*/"],
		},
		brackets: [
			["{", "}"],
			["[", "]"],
			["(", ")"],
			["<", ">"],
		],
		autoClosingPairs: [
			{ open: "{", close: "}" },
			{ open: "[", close: "]" },
			{ open: "(", close: ")" },
			{ open: "<", close: ">" },
			{ open: '"', close: '"' },
			{ open: "'", close: "'" },
		],
		surroundingPairs: [
			{ open: "{", close: "}" },
			{ open: "[", close: "]" },
			{ open: "(", close: ")" },
			{ open: "<", close: ">" },
			{ open: '"', close: '"' },
			{ open: "'", close: "'" },
		],
		indentationRules: {
			increaseIndentPattern: /^.*\{[^}"']*$/,
			decreaseIndentPattern: /^.*\}.*$/,
		},
	});

	// Enhanced C language configuration
	monaco.languages.setLanguageConfiguration("c", {
		comments: {
			lineComment: "//",
			blockComment: ["/*", "*/"],
		},
		brackets: [
			["{", "}"],
			["[", "]"],
			["(", ")"],
		],
		autoClosingPairs: [
			{ open: "{", close: "}" },
			{ open: "[", close: "]" },
			{ open: "(", close: ")" },
			{ open: '"', close: '"' },
			{ open: "'", close: "'" },
		],
		surroundingPairs: [
			{ open: "{", close: "}" },
			{ open: "[", close: "]" },
			{ open: "(", close: ")" },
			{ open: '"', close: '"' },
			{ open: "'", close: "'" },
		],
		indentationRules: {
			increaseIndentPattern: /^.*\{[^}"']*$/,
			decreaseIndentPattern: /^.*\}.*$/,
		},
	});
}
