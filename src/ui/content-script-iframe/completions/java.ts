import * as monaco from "monaco-editor";

// Helper function to extract variables from Java code
function extractJavaVariables(code: string) {
	const variables: Array<{ name: string; type: string; line: number }> = [];
	const lines = code.split("\n");

	for (let i = 0; i < lines.length; i++) {
		const line = lines[i].trim();

		// Match variable declarations
		const varMatches = line.matchAll(
			/\b(int|float|double|char|boolean|long|short|byte|String|StringBuilder|ArrayList|HashMap|HashSet|LinkedList|TreeMap|TreeSet|Scanner)\s+(\w+)(?:\s*=\s*[^;,]+)?\s*[;,]/g,
		);
		for (const match of varMatches) {
			const type = match[1];
			const name = match[2];
			variables.push({ name, type, line: i + 1 });
		}

		// Match array declarations
		const arrayMatches = line.matchAll(
			/\b(int|float|double|char|boolean|long|short|byte|String)\[\]\s+(\w+)|(\w+)\s+(\w+)\[\]/g,
		);
		for (const match of arrayMatches) {
			const type = (match[1] || match[3]) + "[]";
			const name = match[2] || match[4];
			variables.push({ name, type, line: i + 1 });
		}

		// Match method declarations
		const methodMatches = line.matchAll(
			/\b(public|private|protected)?\s*(static)?\s*(int|float|double|char|boolean|long|short|byte|String|void)\s+(\w+)\s*\(/g,
		);
		for (const match of methodMatches) {
			const returnType = match[3];
			const name = match[4];
			if (
				name !== "main" &&
				name !== "if" &&
				name !== "while" &&
				name !== "for" &&
				name !== "switch"
			) {
				variables.push({ name, type: `${returnType} method`, line: i + 1 });
			}
		}

		// Match class declarations
		const classMatches = line.matchAll(
			/\b(public|private|protected)?\s*class\s+(\w+)/g,
		);
		for (const match of classMatches) {
			const name = match[2];
			variables.push({ name, type: "class", line: i + 1 });
		}
	}

	return variables;
}

// Helper function to suggest related functions for Java variable types
function getJavaRelatedFunctions(variableName: string, variableType: string) {
	const suggestions = [];

	// System.out operations for all variables
	suggestions.push({
		label: `System.out.println(${variableName})`,
		insertText: `System.out.println(${variableName});`,
		documentation: `Print ${variableName} (${variableType})`,
	});

	// Scanner operations
	if (variableType === "Scanner") {
		suggestions.push(
			{
				label: `${variableName}.nextInt()`,
				insertText: `${variableName}.nextInt()`,
				documentation: `Read next integer from ${variableName}`,
			},
			{
				label: `${variableName}.nextLine()`,
				insertText: `${variableName}.nextLine()`,
				documentation: `Read next line from ${variableName}`,
			},
			{
				label: `${variableName}.nextDouble()`,
				insertText: `${variableName}.nextDouble()`,
				documentation: `Read next double from ${variableName}`,
			},
			{
				label: `${variableName}.hasNext()`,
				insertText: `${variableName}.hasNext()`,
				documentation: `Check if ${variableName} has more input`,
			},
			{
				label: `${variableName}.close()`,
				insertText: `${variableName}.close();`,
				documentation: `Close ${variableName}`,
			},
		);
	}

	// String operations
	if (variableType === "String") {
		suggestions.push(
			{
				label: `${variableName}.length()`,
				insertText: `${variableName}.length()`,
				documentation: `Get length of ${variableName}`,
			},
			{
				label: `${variableName}.charAt()`,
				insertText: `${variableName}.charAt(\${1:index})`,
				documentation: `Get character at index in ${variableName}`,
			},
			{
				label: `${variableName}.substring()`,
				insertText: `${variableName}.substring(\${1:start}, \${2:end})`,
				documentation: `Get substring of ${variableName}`,
			},
			{
				label: `${variableName}.toUpperCase()`,
				insertText: `${variableName}.toUpperCase()`,
				documentation: `Convert ${variableName} to uppercase`,
			},
			{
				label: `${variableName}.toLowerCase()`,
				insertText: `${variableName}.toLowerCase()`,
				documentation: `Convert ${variableName} to lowercase`,
			},
			{
				label: `${variableName}.equals()`,
				insertText: `${variableName}.equals(\${1:other})`,
				documentation: `Check if ${variableName} equals another string`,
			},
		);
	}

	// StringBuilder operations
	if (variableType === "StringBuilder") {
		suggestions.push(
			{
				label: `${variableName}.append()`,
				insertText: `${variableName}.append(\${1:value})`,
				documentation: `Append to ${variableName}`,
			},
			{
				label: `${variableName}.toString()`,
				insertText: `${variableName}.toString()`,
				documentation: `Convert ${variableName} to string`,
			},
			{
				label: `${variableName}.length()`,
				insertText: `${variableName}.length()`,
				documentation: `Get length of ${variableName}`,
			},
		);
	}

	// ArrayList operations
	if (variableType === "ArrayList") {
		suggestions.push(
			{
				label: `${variableName}.add()`,
				insertText: `${variableName}.add(\${1:element});`,
				documentation: `Add element to ${variableName}`,
			},
			{
				label: `${variableName}.get()`,
				insertText: `${variableName}.get(\${1:index})`,
				documentation: `Get element from ${variableName}`,
			},
			{
				label: `${variableName}.remove()`,
				insertText: `${variableName}.remove(\${1:index});`,
				documentation: `Remove element from ${variableName}`,
			},
			{
				label: `${variableName}.size()`,
				insertText: `${variableName}.size()`,
				documentation: `Get size of ${variableName}`,
			},
			{
				label: `${variableName}.isEmpty()`,
				insertText: `${variableName}.isEmpty()`,
				documentation: `Check if ${variableName} is empty`,
			},
		);
	}

	// HashMap operations
	if (variableType === "HashMap") {
		suggestions.push(
			{
				label: `${variableName}.put()`,
				insertText: `${variableName}.put(\${1:key}, \${2:value});`,
				documentation: `Put key-value pair in ${variableName}`,
			},
			{
				label: `${variableName}.get()`,
				insertText: `${variableName}.get(\${1:key})`,
				documentation: `Get value from ${variableName}`,
			},
			{
				label: `${variableName}.containsKey()`,
				insertText: `${variableName}.containsKey(\${1:key})`,
				documentation: `Check if ${variableName} contains key`,
			},
			{
				label: `${variableName}.keySet()`,
				insertText: `${variableName}.keySet()`,
				documentation: `Get key set from ${variableName}`,
			},
			{
				label: `${variableName}.values()`,
				insertText: `${variableName}.values()`,
				documentation: `Get values from ${variableName}`,
			},
		);
	}

	// HashSet operations
	if (variableType === "HashSet") {
		suggestions.push(
			{
				label: `${variableName}.add()`,
				insertText: `${variableName}.add(\${1:element});`,
				documentation: `Add element to ${variableName}`,
			},
			{
				label: `${variableName}.contains()`,
				insertText: `${variableName}.contains(\${1:element})`,
				documentation: `Check if ${variableName} contains element`,
			},
			{
				label: `${variableName}.remove()`,
				insertText: `${variableName}.remove(\${1:element});`,
				documentation: `Remove element from ${variableName}`,
			},
			{
				label: `${variableName}.size()`,
				insertText: `${variableName}.size()`,
				documentation: `Get size of ${variableName}`,
			},
		);
	}

	// Array operations
	if (variableType.includes("[]")) {
		suggestions.push(
			{
				label: `${variableName}.length`,
				insertText: `${variableName}.length`,
				documentation: `Get length of ${variableName}`,
			},
			{
				label: `Arrays.toString(${variableName})`,
				insertText: `Arrays.toString(${variableName})`,
				documentation: `Convert ${variableName} to string`,
			},
			{
				label: `Arrays.sort(${variableName})`,
				insertText: `Arrays.sort(${variableName});`,
				documentation: `Sort ${variableName}`,
			},
		);
	}

	// Numeric operations
	if (
		variableType === "int" ||
		variableType === "long" ||
		variableType === "short" ||
		variableType === "byte"
	) {
		suggestions.push(
			{
				label: `Math.abs(${variableName})`,
				insertText: `Math.abs(${variableName})`,
				documentation: `Get absolute value of ${variableName}`,
			},
			{
				label: `String.valueOf(${variableName})`,
				insertText: `String.valueOf(${variableName})`,
				documentation: `Convert ${variableName} to string`,
			},
		);
	}

	if (variableType === "double" || variableType === "float") {
		suggestions.push(
			{
				label: `Math.round(${variableName})`,
				insertText: `Math.round(${variableName})`,
				documentation: `Round ${variableName}`,
			},
			{
				label: `Math.floor(${variableName})`,
				insertText: `Math.floor(${variableName})`,
				documentation: `Floor of ${variableName}`,
			},
			{
				label: `Math.ceil(${variableName})`,
				insertText: `Math.ceil(${variableName})`,
				documentation: `Ceiling of ${variableName}`,
			},
		);
	}

	return suggestions;
}

// Helper function to get method suggestions for Java objects
function getJavaMethods(variableType: string) {
	const methods: Array<{
		label: string;
		insertText: string;
		documentation: string;
	}> = [];

	// Normalize type
	const baseType = variableType.toLowerCase().replace(/.*\./, "");

	// String methods
	if (baseType === "string") {
		methods.push(
			{
				label: "length",
				insertText: "length()",
				documentation: "Returns the length of the string",
			},
			{
				label: "charAt",
				insertText: "charAt(${1:index})",
				documentation: "Returns character at specified index",
			},
			{
				label: "substring",
				insertText: "substring(${1:start}, ${2:end})",
				documentation: "Returns substring from start to end",
			},
			{
				label: "indexOf",
				insertText: "indexOf(${1:str})",
				documentation: "Returns index of first occurrence",
			},
			{
				label: "lastIndexOf",
				insertText: "lastIndexOf(${1:str})",
				documentation: "Returns index of last occurrence",
			},
			{
				label: "toUpperCase",
				insertText: "toUpperCase()",
				documentation: "Converts to uppercase",
			},
			{
				label: "toLowerCase",
				insertText: "toLowerCase()",
				documentation: "Converts to lowercase",
			},
			{
				label: "trim",
				insertText: "trim()",
				documentation: "Removes leading and trailing whitespace",
			},
			{
				label: "replace",
				insertText: "replace(${1:oldChar}, ${2:newChar})",
				documentation: "Replaces all occurrences",
			},
			{
				label: "split",
				insertText: "split(${1:regex})",
				documentation: "Splits string by regex",
			},
			{
				label: "startsWith",
				insertText: "startsWith(${1:prefix})",
				documentation: "Tests if string starts with prefix",
			},
			{
				label: "endsWith",
				insertText: "endsWith(${1:suffix})",
				documentation: "Tests if string ends with suffix",
			},
			{
				label: "contains",
				insertText: "contains(${1:sequence})",
				documentation: "Tests if string contains sequence",
			},
			{
				label: "isEmpty",
				insertText: "isEmpty()",
				documentation: "Tests if string is empty",
			},
			{
				label: "equals",
				insertText: "equals(${1:other})",
				documentation: "Compares with another string",
			},
			{
				label: "equalsIgnoreCase",
				insertText: "equalsIgnoreCase(${1:other})",
				documentation: "Compares ignoring case",
			},
		);
	}

	// ArrayList methods
	if (baseType === "arraylist" || variableType.includes("ArrayList")) {
		methods.push(
			{
				label: "add",
				insertText: "add(${1:element})",
				documentation: "Appends element to end of list",
			},
			{
				label: "get",
				insertText: "get(${1:index})",
				documentation: "Returns element at specified index",
			},
			{
				label: "set",
				insertText: "set(${1:index}, ${2:element})",
				documentation: "Replaces element at index",
			},
			{
				label: "remove",
				insertText: "remove(${1:index})",
				documentation: "Removes element at index",
			},
			{
				label: "size",
				insertText: "size()",
				documentation: "Returns number of elements",
			},
			{
				label: "isEmpty",
				insertText: "isEmpty()",
				documentation: "Tests if list is empty",
			},
			{
				label: "clear",
				insertText: "clear()",
				documentation: "Removes all elements",
			},
			{
				label: "contains",
				insertText: "contains(${1:element})",
				documentation: "Tests if list contains element",
			},
			{
				label: "indexOf",
				insertText: "indexOf(${1:element})",
				documentation: "Returns index of first occurrence",
			},
			{
				label: "lastIndexOf",
				insertText: "lastIndexOf(${1:element})",
				documentation: "Returns index of last occurrence",
			},
			{
				label: "toArray",
				insertText: "toArray()",
				documentation: "Returns array containing all elements",
			},
			{
				label: "addAll",
				insertText: "addAll(${1:collection})",
				documentation: "Adds all elements from collection",
			},
		);
	}

	// HashMap methods
	if (baseType === "hashmap" || variableType.includes("HashMap")) {
		methods.push(
			{
				label: "put",
				insertText: "put(${1:key}, ${2:value})",
				documentation: "Associates value with key",
			},
			{
				label: "get",
				insertText: "get(${1:key})",
				documentation: "Returns value for key",
			},
			{
				label: "remove",
				insertText: "remove(${1:key})",
				documentation: "Removes mapping for key",
			},
			{
				label: "containsKey",
				insertText: "containsKey(${1:key})",
				documentation: "Tests if map contains key",
			},
			{
				label: "containsValue",
				insertText: "containsValue(${1:value})",
				documentation: "Tests if map contains value",
			},
			{
				label: "keySet",
				insertText: "keySet()",
				documentation: "Returns set of keys",
			},
			{
				label: "values",
				insertText: "values()",
				documentation: "Returns collection of values",
			},
			{
				label: "entrySet",
				insertText: "entrySet()",
				documentation: "Returns set of key-value pairs",
			},
			{
				label: "size",
				insertText: "size()",
				documentation: "Returns number of mappings",
			},
			{
				label: "isEmpty",
				insertText: "isEmpty()",
				documentation: "Tests if map is empty",
			},
			{
				label: "clear",
				insertText: "clear()",
				documentation: "Removes all mappings",
			},
			{
				label: "putAll",
				insertText: "putAll(${1:map})",
				documentation: "Copies all mappings from another map",
			},
		);
	}

	// HashSet methods
	if (baseType === "hashset" || variableType.includes("HashSet")) {
		methods.push(
			{
				label: "add",
				insertText: "add(${1:element})",
				documentation: "Adds element to set",
			},
			{
				label: "remove",
				insertText: "remove(${1:element})",
				documentation: "Removes element from set",
			},
			{
				label: "contains",
				insertText: "contains(${1:element})",
				documentation: "Tests if set contains element",
			},
			{
				label: "size",
				insertText: "size()",
				documentation: "Returns number of elements",
			},
			{
				label: "isEmpty",
				insertText: "isEmpty()",
				documentation: "Tests if set is empty",
			},
			{
				label: "clear",
				insertText: "clear()",
				documentation: "Removes all elements",
			},
			{
				label: "toArray",
				insertText: "toArray()",
				documentation: "Returns array containing all elements",
			},
			{
				label: "addAll",
				insertText: "addAll(${1:collection})",
				documentation: "Adds all elements from collection",
			},
			{
				label: "retainAll",
				insertText: "retainAll(${1:collection})",
				documentation: "Retains only elements in collection",
			},
			{
				label: "removeAll",
				insertText: "removeAll(${1:collection})",
				documentation: "Removes all elements in collection",
			},
		);
	}

	// Scanner methods
	if (baseType === "scanner" || variableType.includes("Scanner")) {
		methods.push(
			{
				label: "next",
				insertText: "next()",
				documentation: "Reads next token as String",
			},
			{
				label: "nextLine",
				insertText: "nextLine()",
				documentation: "Reads next line as String",
			},
			{
				label: "nextInt",
				insertText: "nextInt()",
				documentation: "Reads next token as int",
			},
			{
				label: "nextDouble",
				insertText: "nextDouble()",
				documentation: "Reads next token as double",
			},
			{
				label: "nextBoolean",
				insertText: "nextBoolean()",
				documentation: "Reads next token as boolean",
			},
			{
				label: "hasNext",
				insertText: "hasNext()",
				documentation: "Tests if another token is available",
			},
			{
				label: "hasNextInt",
				insertText: "hasNextInt()",
				documentation: "Tests if next token is an int",
			},
			{
				label: "hasNextDouble",
				insertText: "hasNextDouble()",
				documentation: "Tests if next token is a double",
			},
			{
				label: "hasNextLine",
				insertText: "hasNextLine()",
				documentation: "Tests if another line is available",
			},
			{
				label: "close",
				insertText: "close()",
				documentation: "Closes the scanner",
			},
		);
	}

	return methods;
}

monaco.languages.registerCompletionItemProvider("java", {
	provideCompletionItems: (model, position) => {
		const word = model.getWordUntilPosition(position);
		const range = {
			startLineNumber: position.lineNumber,
			endLineNumber: position.lineNumber,
			startColumn: word.startColumn,
			endColumn: word.endColumn,
		};

		// Get the line up to current position to check for dot notation
		const linePrefix = model.getValueInRange({
			startLineNumber: position.lineNumber,
			startColumn: 1,
			endLineNumber: position.lineNumber,
			endColumn: position.column,
		});

		// Check if we're after a dot (method call)
		const dotMatch = linePrefix.match(/(\w+)\.(\w*)$/);
		if (dotMatch) {
			const variableName = dotMatch[1];
			const partialMethod = dotMatch[2];

			// Extract variables from the current code
			const code = model.getValue();
			const extractedVariables = extractJavaVariables(code);

			// Find the variable type
			const variable = extractedVariables.find((v) => v.name === variableName);
			if (variable) {
				const methods = getJavaMethods(variable.type);
				const methodSuggestions = methods
					.filter((method) => method.label.startsWith(partialMethod))
					.map((method) => ({
						label: method.label,
						kind: monaco.languages.CompletionItemKind.Method,
						insertText: method.insertText,
						insertTextRules:
							monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
						documentation: method.documentation,
						range: {
							startLineNumber: position.lineNumber,
							endLineNumber: position.lineNumber,
							startColumn: position.column - partialMethod.length,
							endColumn: position.column,
						},
					}));

				return { suggestions: methodSuggestions };
			}
		}

		// Extract variables from the current code
		const code = model.getValue();
		const extractedVariables = extractJavaVariables(code);

		// Create suggestions for extracted variables
		const variableSuggestions = extractedVariables.map((variable) => ({
			label: variable.name,
			kind: variable.type.includes("method")
				? monaco.languages.CompletionItemKind.Function
				: variable.type === "class"
					? monaco.languages.CompletionItemKind.Class
					: monaco.languages.CompletionItemKind.Variable,
			insertText: variable.name,
			insertTextRules:
				monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
			documentation: `${variable.type} (declared at line ${variable.line})`,
			range: range,
		}));

		// Create suggestions for variable-related functions
		const functionSuggestions: any[] = [];
		extractedVariables.forEach((variable) => {
			if (!variable.type.includes("method") && variable.type !== "class") {
				const relatedFunctions = getJavaRelatedFunctions(
					variable.name,
					variable.type,
				);
				relatedFunctions.forEach((func) => {
					functionSuggestions.push({
						label: func.label,
						kind: monaco.languages.CompletionItemKind.Snippet,
						insertText: func.insertText,
						insertTextRules:
							monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
						documentation: func.documentation,
						range: range,
					});
				});
			}
		});

		const suggestions = [
			...variableSuggestions,
			...functionSuggestions,
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
