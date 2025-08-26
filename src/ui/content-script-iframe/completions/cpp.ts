import * as monaco from "monaco-editor";

// Helper function to extract variables from C++ code
function extractCppVariables(code: string) {
	const variables: Array<{ name: string; type: string; line: number }> = [];
	const lines = code.split("\n");

	for (let i = 0; i < lines.length; i++) {
		const line = lines[i].trim();

		// Match basic variable declarations
		const varMatches = line.matchAll(
			/\b(int|float|double|char|long|short|unsigned\s+int|signed\s+int|bool|string|auto)\s+(\w+)(?:\s*=\s*[^;,]+)?\s*[;,]/g,
		);
		for (const match of varMatches) {
			const type = match[1];
			const name = match[2];
			variables.push({ name, type, line: i + 1 });
		}

		// Match STL containers with full type information
		const containerMatches = line.matchAll(
			/\b(std::)?(vector|map|unordered_map|set|unordered_set|queue|stack|priority_queue|deque|list|pair|string)<([^>]+)>\s+(\w+)/g,
		);
		for (const match of containerMatches) {
			const containerType = match[2];
			const templateType = match[3];
			const name = match[4];
			const fullType = `${containerType}<${templateType}>`;
			variables.push({ name, type: fullType, line: i + 1 });
		}

		// Match simple STL containers without template parameters shown
		const simpleContainerMatches = line.matchAll(
			/\b(std::)?(vector|map|unordered_map|set|unordered_set|queue|stack|priority_queue|deque|list|pair|string)<[^>]+>\s+(\w+)/g,
		);
		for (const match of simpleContainerMatches) {
			const containerType = match[2];
			const name = match[3];
			// Skip if already matched by detailed regex above
			if (!variables.some((v) => v.name === name && v.line === i + 1)) {
				variables.push({ name, type: containerType + "<>", line: i + 1 });
			}
		}

		// Match std::string without template
		const stringMatches = line.matchAll(
			/\b(std::)?string\s+(\w+)(?:\s*=\s*[^;,]+)?\s*[;,]/g,
		);
		for (const match of stringMatches) {
			const name = match[2];
			variables.push({ name, type: "string", line: i + 1 });
		}

		// Match array declarations
		const arrayMatches = line.matchAll(
			/\b(int|float|double|char|long|short|unsigned\s+int|signed\s+int|bool|string)\s+(\w+)\s*\[/g,
		);
		for (const match of arrayMatches) {
			const type = match[1] + "[]";
			const name = match[2];
			variables.push({ name, type, line: i + 1 });
		}

		// Match function declarations
		const funcMatches = line.matchAll(
			/\b(int|float|double|char|void|long|short|unsigned\s+int|signed\s+int|bool|string|auto)\s+(\w+)\s*\(/g,
		);
		for (const match of funcMatches) {
			const returnType = match[1];
			const name = match[2];
			if (
				name !== "main" &&
				name !== "if" &&
				name !== "while" &&
				name !== "for" &&
				name !== "switch"
			) {
				variables.push({ name, type: `${returnType} function`, line: i + 1 });
			}
		}
	}

	return variables;
}

// Helper function to suggest related functions for C++ variable types
function getCppRelatedFunctions(variableName: string, variableType: string) {
	const suggestions = [];

	// Numeric types
	if (
		variableType.includes("int") ||
		variableType.includes("long") ||
		variableType.includes("short")
	) {
		suggestions.push(
			{
				label: `cout ${variableName}`,
				insertText: `cout << ${variableName} << endl;`,
				documentation: `Output ${variableName} (${variableType})`,
			},
			{
				label: `cin ${variableName}`,
				insertText: `cin >> ${variableName};`,
				documentation: `Input ${variableName} (${variableType})`,
			},
		);
	}

	if (variableType.includes("float") || variableType.includes("double")) {
		suggestions.push(
			{
				label: `cout ${variableName}`,
				insertText: `cout << ${variableName} << endl;`,
				documentation: `Output ${variableName} (${variableType})`,
			},
			{
				label: `cin ${variableName}`,
				insertText: `cin >> ${variableName};`,
				documentation: `Input ${variableName} (${variableType})`,
			},
		);
	}

	// String types
	if (variableType.includes("string")) {
		suggestions.push(
			{
				label: `cout ${variableName}`,
				insertText: `cout << ${variableName} << endl;`,
				documentation: `Output ${variableName} (${variableType})`,
			},
			{
				label: `cin ${variableName}`,
				insertText: `cin >> ${variableName};`,
				documentation: `Input ${variableName} (${variableType})`,
			},
			{
				label: `${variableName}.length()`,
				insertText: `${variableName}.length()`,
				documentation: `Get length of ${variableName}`,
			},
			{
				label: `${variableName}.size()`,
				insertText: `${variableName}.size()`,
				documentation: `Get size of ${variableName}`,
			},
		);
	}

	// Vector operations
	if (variableType.includes("vector")) {
		suggestions.push(
			{
				label: `${variableName}.push_back()`,
				insertText: `${variableName}.push_back(\${1:value});`,
				documentation: `Add element to ${variableName}`,
			},
			{
				label: `${variableName}.pop_back()`,
				insertText: `${variableName}.pop_back();`,
				documentation: `Remove last element from ${variableName}`,
			},
			{
				label: `${variableName}.size()`,
				insertText: `${variableName}.size()`,
				documentation: `Get size of ${variableName}`,
			},
			{
				label: `sort ${variableName}`,
				insertText: `sort(${variableName}.begin(), ${variableName}.end());`,
				documentation: `Sort ${variableName}`,
			},
		);
	}

	// Map operations
	if (variableType.includes("map")) {
		suggestions.push(
			{
				label: `${variableName}[key]`,
				insertText: `${variableName}[\${1:key}]`,
				documentation: `Access element in ${variableName}`,
			},
			{
				label: `${variableName}.insert()`,
				insertText: `${variableName}.insert({\${1:key}, \${2:value}});`,
				documentation: `Insert element into ${variableName}`,
			},
			{
				label: `${variableName}.find()`,
				insertText: `${variableName}.find(\${1:key})`,
				documentation: `Find element in ${variableName}`,
			},
		);
	}

	// Set operations
	if (variableType.includes("set")) {
		suggestions.push(
			{
				label: `${variableName}.insert()`,
				insertText: `${variableName}.insert(\${1:value});`,
				documentation: `Insert element into ${variableName}`,
			},
			{
				label: `${variableName}.find()`,
				insertText: `${variableName}.find(\${1:value})`,
				documentation: `Find element in ${variableName}`,
			},
			{
				label: `${variableName}.erase()`,
				insertText: `${variableName}.erase(\${1:value});`,
				documentation: `Remove element from ${variableName}`,
			},
		);
	}

	// Stack operations
	if (variableType.includes("stack")) {
		suggestions.push(
			{
				label: `${variableName}.push()`,
				insertText: `${variableName}.push(\${1:value});`,
				documentation: `Push element to ${variableName}`,
			},
			{
				label: `${variableName}.pop()`,
				insertText: `${variableName}.pop();`,
				documentation: `Pop element from ${variableName}`,
			},
			{
				label: `${variableName}.top()`,
				insertText: `${variableName}.top()`,
				documentation: `Get top element of ${variableName}`,
			},
		);
	}

	// Queue operations
	if (variableType.includes("queue")) {
		suggestions.push(
			{
				label: `${variableName}.push()`,
				insertText: `${variableName}.push(\${1:value});`,
				documentation: `Push element to ${variableName}`,
			},
			{
				label: `${variableName}.pop()`,
				insertText: `${variableName}.pop();`,
				documentation: `Pop element from ${variableName}`,
			},
			{
				label: `${variableName}.front()`,
				insertText: `${variableName}.front()`,
				documentation: `Get front element of ${variableName}`,
			},
		);
	}

	// Common operations for numeric types
	if (
		variableType.includes("int") ||
		variableType.includes("long") ||
		variableType.includes("short") ||
		variableType.includes("float") ||
		variableType.includes("double")
	) {
		suggestions.push(
			{
				label: `${variableName}++`,
				insertText: `${variableName}++`,
				documentation: `Increment ${variableName}`,
			},
			{
				label: `${variableName}--`,
				insertText: `${variableName}--`,
				documentation: `Decrement ${variableName}`,
			},
		);
	}

	return suggestions;
}

// Helper function to get method suggestions for STL containers
function getContainerMethods(containerType: string) {
	const methods: Array<{
		label: string;
		insertText: string;
		documentation: string;
	}> = [];

	// Normalize the type (remove template parameters for matching)
	const baseType = containerType
		.toLowerCase()
		.replace(/<.*>/, "")
		.replace("std::", "");

	// Vector methods
	if (baseType === "vector" || containerType.includes("vector")) {
		methods.push(
			{
				label: "push_back",
				insertText: "push_back(${1:value})",
				documentation: "Add element to end",
			},
			{
				label: "pop_back",
				insertText: "pop_back()",
				documentation: "Remove last element",
			},
			{
				label: "size",
				insertText: "size()",
				documentation: "Get number of elements",
			},
			{
				label: "empty",
				insertText: "empty()",
				documentation: "Check if container is empty",
			},
			{
				label: "clear",
				insertText: "clear()",
				documentation: "Remove all elements",
			},
			{
				label: "begin",
				insertText: "begin()",
				documentation: "Get iterator to beginning",
			},
			{
				label: "end",
				insertText: "end()",
				documentation: "Get iterator to end",
			},
			{
				label: "front",
				insertText: "front()",
				documentation: "Get first element",
			},
			{
				label: "back",
				insertText: "back()",
				documentation: "Get last element",
			},
			{
				label: "at",
				insertText: "at(${1:index})",
				documentation: "Get element at index with bounds checking",
			},
			{
				label: "insert",
				insertText: "insert(${1:position}, ${2:value})",
				documentation: "Insert element at position",
			},
			{
				label: "erase",
				insertText: "erase(${1:position})",
				documentation: "Remove element at position",
			},
			{
				label: "resize",
				insertText: "resize(${1:size})",
				documentation: "Change container size",
			},
			{
				label: "reserve",
				insertText: "reserve(${1:capacity})",
				documentation: "Reserve storage capacity",
			},
			{
				label: "capacity",
				insertText: "capacity()",
				documentation: "Get storage capacity",
			},
		);
	}

	// Map methods
	if (
		baseType === "map" ||
		baseType === "unordered_map" ||
		containerType.includes("map")
	) {
		methods.push(
			{
				label: "insert",
				insertText: "insert({${1:key}, ${2:value}})",
				documentation: "Insert key-value pair",
			},
			{
				label: "find",
				insertText: "find(${1:key})",
				documentation: "Find element with key",
			},
			{
				label: "erase",
				insertText: "erase(${1:key})",
				documentation: "Remove element with key",
			},
			{
				label: "size",
				insertText: "size()",
				documentation: "Get number of elements",
			},
			{
				label: "empty",
				insertText: "empty()",
				documentation: "Check if container is empty",
			},
			{
				label: "clear",
				insertText: "clear()",
				documentation: "Remove all elements",
			},
			{
				label: "begin",
				insertText: "begin()",
				documentation: "Get iterator to beginning",
			},
			{
				label: "end",
				insertText: "end()",
				documentation: "Get iterator to end",
			},
			{
				label: "count",
				insertText: "count(${1:key})",
				documentation: "Count elements with key",
			},
			{
				label: "lower_bound",
				insertText: "lower_bound(${1:key})",
				documentation: "Get iterator to first element not less than key",
			},
			{
				label: "upper_bound",
				insertText: "upper_bound(${1:key})",
				documentation: "Get iterator to first element greater than key",
			},
		);
	}

	// Set methods
	if (
		baseType === "set" ||
		baseType === "unordered_set" ||
		containerType.includes("set")
	) {
		methods.push(
			{
				label: "insert",
				insertText: "insert(${1:value})",
				documentation: "Insert element",
			},
			{
				label: "find",
				insertText: "find(${1:value})",
				documentation: "Find element",
			},
			{
				label: "erase",
				insertText: "erase(${1:value})",
				documentation: "Remove element",
			},
			{
				label: "size",
				insertText: "size()",
				documentation: "Get number of elements",
			},
			{
				label: "empty",
				insertText: "empty()",
				documentation: "Check if container is empty",
			},
			{
				label: "clear",
				insertText: "clear()",
				documentation: "Remove all elements",
			},
			{
				label: "begin",
				insertText: "begin()",
				documentation: "Get iterator to beginning",
			},
			{
				label: "end",
				insertText: "end()",
				documentation: "Get iterator to end",
			},
			{
				label: "count",
				insertText: "count(${1:value})",
				documentation: "Count occurrences of value",
			},
			{
				label: "lower_bound",
				insertText: "lower_bound(${1:value})",
				documentation: "Get iterator to first element not less than value",
			},
			{
				label: "upper_bound",
				insertText: "upper_bound(${1:value})",
				documentation: "Get iterator to first element greater than value",
			},
		);
	}

	// Queue methods
	if (
		baseType === "queue" ||
		(containerType.includes("queue") && !containerType.includes("priority"))
	) {
		methods.push(
			{
				label: "push",
				insertText: "push(${1:value})",
				documentation: "Add element to back",
			},
			{
				label: "pop",
				insertText: "pop()",
				documentation: "Remove front element",
			},
			{
				label: "front",
				insertText: "front()",
				documentation: "Get front element",
			},
			{
				label: "back",
				insertText: "back()",
				documentation: "Get back element",
			},
			{
				label: "size",
				insertText: "size()",
				documentation: "Get number of elements",
			},
			{
				label: "empty",
				insertText: "empty()",
				documentation: "Check if container is empty",
			},
		);
	}

	// Priority Queue methods
	if (
		baseType === "priority_queue" ||
		containerType.includes("priority_queue")
	) {
		methods.push(
			{
				label: "push",
				insertText: "push(${1:value})",
				documentation: "Add element",
			},
			{
				label: "pop",
				insertText: "pop()",
				documentation: "Remove top element",
			},
			{ label: "top", insertText: "top()", documentation: "Get top element" },
			{
				label: "size",
				insertText: "size()",
				documentation: "Get number of elements",
			},
			{
				label: "empty",
				insertText: "empty()",
				documentation: "Check if container is empty",
			},
		);
	}

	// Stack methods
	if (baseType === "stack" || containerType.includes("stack")) {
		methods.push(
			{
				label: "push",
				insertText: "push(${1:value})",
				documentation: "Add element to top",
			},
			{
				label: "pop",
				insertText: "pop()",
				documentation: "Remove top element",
			},
			{ label: "top", insertText: "top()", documentation: "Get top element" },
			{
				label: "size",
				insertText: "size()",
				documentation: "Get number of elements",
			},
			{
				label: "empty",
				insertText: "empty()",
				documentation: "Check if container is empty",
			},
		);
	}

	// String methods
	if (baseType === "string" || containerType.includes("string")) {
		methods.push(
			{
				label: "length",
				insertText: "length()",
				documentation: "Get string length",
			},
			{ label: "size", insertText: "size()", documentation: "Get string size" },
			{
				label: "empty",
				insertText: "empty()",
				documentation: "Check if string is empty",
			},
			{
				label: "clear",
				insertText: "clear()",
				documentation: "Clear string content",
			},
			{
				label: "substr",
				insertText: "substr(${1:pos}, ${2:len})",
				documentation: "Get substring",
			},
			{
				label: "find",
				insertText: "find(${1:str})",
				documentation: "Find substring",
			},
			{
				label: "replace",
				insertText: "replace(${1:pos}, ${2:len}, ${3:str})",
				documentation: "Replace part of string",
			},
			{
				label: "insert",
				insertText: "insert(${1:pos}, ${2:str})",
				documentation: "Insert into string",
			},
			{
				label: "erase",
				insertText: "erase(${1:pos}, ${2:len})",
				documentation: "Erase part of string",
			},
			{
				label: "push_back",
				insertText: "push_back(${1:char})",
				documentation: "Add character to end",
			},
			{
				label: "pop_back",
				insertText: "pop_back()",
				documentation: "Remove last character",
			},
			{
				label: "front",
				insertText: "front()",
				documentation: "Get first character",
			},
			{
				label: "back",
				insertText: "back()",
				documentation: "Get last character",
			},
			{
				label: "begin",
				insertText: "begin()",
				documentation: "Get iterator to beginning",
			},
			{
				label: "end",
				insertText: "end()",
				documentation: "Get iterator to end",
			},
		);
	}

	return methods;
}

monaco.languages.registerCompletionItemProvider("cpp", {
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
			const extractedVariables = extractCppVariables(code);

			// Find the variable type
			const variable = extractedVariables.find((v) => v.name === variableName);
			if (variable) {
				const methods = getContainerMethods(variable.type);
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
		const extractedVariables = extractCppVariables(code);

		// Create suggestions for extracted variables
		const variableSuggestions = extractedVariables.map((variable) => ({
			label: variable.name,
			kind: variable.type.includes("function")
				? monaco.languages.CompletionItemKind.Function
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
			const relatedFunctions = getCppRelatedFunctions(
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
		});

		const suggestions = [
			...variableSuggestions,
			...functionSuggestions,
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
			// More standard library containers
			{
				label: "std::map",
				kind: monaco.languages.CompletionItemKind.Class,
				insertText: "std::map<${1:KeyType}, ${2:ValueType}> ${3:mapName};",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Associative container that contains key-value pairs",
				range: range,
			},
			{
				label: "std::unordered_map",
				kind: monaco.languages.CompletionItemKind.Class,
				insertText:
					"std::unordered_map<${1:KeyType}, ${2:ValueType}> ${3:mapName};",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Hash table implementation of map",
				range: range,
			},
			{
				label: "std::set",
				kind: monaco.languages.CompletionItemKind.Class,
				insertText: "std::set<${1:Type}> ${2:setName};",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Set of unique elements",
				range: range,
			},
			{
				label: "std::unordered_set",
				kind: monaco.languages.CompletionItemKind.Class,
				insertText: "std::unordered_set<${1:Type}> ${2:setName};",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Hash table implementation of set",
				range: range,
			},
			{
				label: "std::queue",
				kind: monaco.languages.CompletionItemKind.Class,
				insertText: "std::queue<${1:Type}> ${2:queueName};",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "FIFO queue container",
				range: range,
			},
			{
				label: "std::stack",
				kind: monaco.languages.CompletionItemKind.Class,
				insertText: "std::stack<${1:Type}> ${2:stackName};",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "LIFO stack container",
				range: range,
			},
			{
				label: "std::priority_queue",
				kind: monaco.languages.CompletionItemKind.Class,
				insertText: "std::priority_queue<${1:Type}> ${2:pqName};",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Priority queue container",
				range: range,
			},
			{
				label: "std::deque",
				kind: monaco.languages.CompletionItemKind.Class,
				insertText: "std::deque<${1:Type}> ${2:dequeName};",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Double-ended queue",
				range: range,
			},
			{
				label: "std::list",
				kind: monaco.languages.CompletionItemKind.Class,
				insertText: "std::list<${1:Type}> ${2:listName};",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Doubly-linked list",
				range: range,
			},
			{
				label: "std::pair",
				kind: monaco.languages.CompletionItemKind.Class,
				insertText: "std::pair<${1:Type1}, ${2:Type2}> ${3:pairName};",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Pair of two values",
				range: range,
			},
			// Algorithm functions
			{
				label: "std::sort",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "std::sort(${1:container}.begin(), ${1:container}.end());",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Sort elements in range",
				range: range,
			},
			{
				label: "std::find",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText:
					"std::find(${1:container}.begin(), ${1:container}.end(), ${2:value})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Find element in range",
				range: range,
			},
			{
				label: "std::binary_search",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText:
					"std::binary_search(${1:container}.begin(), ${1:container}.end(), ${2:value})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Binary search in sorted range",
				range: range,
			},
			{
				label: "std::max",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "std::max(${1:a}, ${2:b})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Returns maximum of two values",
				range: range,
			},
			{
				label: "std::min",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "std::min(${1:a}, ${2:b})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Returns minimum of two values",
				range: range,
			},
			{
				label: "std::swap",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "std::swap(${1:a}, ${2:b});",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Swap values of two objects",
				range: range,
			},
			{
				label: "std::reverse",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText:
					"std::reverse(${1:container}.begin(), ${1:container}.end());",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Reverse elements in range",
				range: range,
			},
			{
				label: "std::count",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText:
					"std::count(${1:container}.begin(), ${1:container}.end(), ${2:value})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Count occurrences of value in range",
				range: range,
			},
			// More headers
			{
				label: "#include <bits/stdc++.h>",
				kind: monaco.languages.CompletionItemKind.Snippet,
				insertText: "#include <bits/stdc++.h>",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Include all standard headers",
				range: range,
			},
			{
				label: "#include <algorithm>",
				kind: monaco.languages.CompletionItemKind.Snippet,
				insertText: "#include <algorithm>",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Include algorithms header",
				range: range,
			},
			{
				label: "#include <map>",
				kind: monaco.languages.CompletionItemKind.Snippet,
				insertText: "#include <map>",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Include map header",
				range: range,
			},
			{
				label: "#include <unordered_map>",
				kind: monaco.languages.CompletionItemKind.Snippet,
				insertText: "#include <unordered_map>",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Include unordered_map header",
				range: range,
			},
			{
				label: "#include <set>",
				kind: monaco.languages.CompletionItemKind.Snippet,
				insertText: "#include <set>",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Include set header",
				range: range,
			},
			{
				label: "#include <queue>",
				kind: monaco.languages.CompletionItemKind.Snippet,
				insertText: "#include <queue>",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Include queue header",
				range: range,
			},
			{
				label: "#include <stack>",
				kind: monaco.languages.CompletionItemKind.Snippet,
				insertText: "#include <stack>",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Include stack header",
				range: range,
			},
			{
				label: "#include <deque>",
				kind: monaco.languages.CompletionItemKind.Snippet,
				insertText: "#include <deque>",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Include deque header",
				range: range,
			},
			{
				label: "#include <utility>",
				kind: monaco.languages.CompletionItemKind.Snippet,
				insertText: "#include <utility>",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Include utility header (for pair, move, etc.)",
				range: range,
			},
			{
				label: "#include <memory>",
				kind: monaco.languages.CompletionItemKind.Snippet,
				insertText: "#include <memory>",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Include memory header (for smart pointers)",
				range: range,
			},
			// Commonly used snippets for competitive programming
			{
				label: "fast_io",
				kind: monaco.languages.CompletionItemKind.Snippet,
				insertText: "ios_base::sync_with_stdio(false);\ncin.tie(NULL);",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Fast I/O for competitive programming",
				range: range,
			},
			{
				label: "typedef_shortcuts",
				kind: monaco.languages.CompletionItemKind.Snippet,
				insertText:
					"typedef long long ll;\ntypedef vector<int> vi;\ntypedef vector<ll> vll;\ntypedef pair<int, int> pii;",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Common typedefs for competitive programming",
				range: range,
			},
			{
				label: "auto loop",
				kind: monaco.languages.CompletionItemKind.Snippet,
				insertText:
					"for (auto ${1:item} : ${2:container}) {\n    ${3:// loop body}\n}",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Auto type range-based for loop",
				range: range,
			},
			// Non-std prefixed completions (for when using namespace std)
			{
				label: "cout",
				kind: monaco.languages.CompletionItemKind.Method,
				insertText: "cout << ${1:value} << endl;",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Output to console (requires using namespace std)",
				range: range,
			},
			{
				label: "cin",
				kind: monaco.languages.CompletionItemKind.Method,
				insertText: "cin >> ${1:variable};",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Input from console (requires using namespace std)",
				range: range,
			},
			{
				label: "vector",
				kind: monaco.languages.CompletionItemKind.Class,
				insertText: "vector<${1:Type}> ${2:vectorName};",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Create a vector (requires using namespace std)",
				range: range,
			},
			{
				label: "string",
				kind: monaco.languages.CompletionItemKind.Class,
				insertText: 'string ${1:stringName} = "${2:value}";',
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Create a string (requires using namespace std)",
				range: range,
			},
			{
				label: "map",
				kind: monaco.languages.CompletionItemKind.Class,
				insertText: "map<${1:KeyType}, ${2:ValueType}> ${3:mapName};",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Associative container (requires using namespace std)",
				range: range,
			},
			{
				label: "unordered_map",
				kind: monaco.languages.CompletionItemKind.Class,
				insertText: "unordered_map<${1:KeyType}, ${2:ValueType}> ${3:mapName};",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation:
					"Hash table implementation (requires using namespace std)",
				range: range,
			},
			{
				label: "set",
				kind: monaco.languages.CompletionItemKind.Class,
				insertText: "set<${1:Type}> ${2:setName};",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Set of unique elements (requires using namespace std)",
				range: range,
			},
			{
				label: "unordered_set",
				kind: monaco.languages.CompletionItemKind.Class,
				insertText: "unordered_set<${1:Type}> ${2:setName};",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation:
					"Hash table implementation of set (requires using namespace std)",
				range: range,
			},
			{
				label: "queue",
				kind: monaco.languages.CompletionItemKind.Class,
				insertText: "queue<${1:Type}> ${2:queueName};",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "FIFO queue container (requires using namespace std)",
				range: range,
			},
			{
				label: "stack",
				kind: monaco.languages.CompletionItemKind.Class,
				insertText: "stack<${1:Type}> ${2:stackName};",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "LIFO stack container (requires using namespace std)",
				range: range,
			},
			{
				label: "priority_queue",
				kind: monaco.languages.CompletionItemKind.Class,
				insertText: "priority_queue<${1:Type}> ${2:pqName};",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation:
					"Priority queue container (requires using namespace std)",
				range: range,
			},
			{
				label: "deque",
				kind: monaco.languages.CompletionItemKind.Class,
				insertText: "deque<${1:Type}> ${2:dequeName};",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Double-ended queue (requires using namespace std)",
				range: range,
			},
			{
				label: "list",
				kind: monaco.languages.CompletionItemKind.Class,
				insertText: "list<${1:Type}> ${2:listName};",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Doubly-linked list (requires using namespace std)",
				range: range,
			},
			{
				label: "pair",
				kind: monaco.languages.CompletionItemKind.Class,
				insertText: "pair<${1:Type1}, ${2:Type2}> ${3:pairName};",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Pair of two values (requires using namespace std)",
				range: range,
			},
			{
				label: "shared_ptr",
				kind: monaco.languages.CompletionItemKind.Class,
				insertText:
					"shared_ptr<${1:Type}> ${2:ptrName} = make_shared<${1:Type}>(${3:args});",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Smart pointer (requires using namespace std)",
				range: range,
			},
			{
				label: "unique_ptr",
				kind: monaco.languages.CompletionItemKind.Class,
				insertText:
					"unique_ptr<${1:Type}> ${2:ptrName} = make_unique<${1:Type}>(${3:args});",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Unique pointer (requires using namespace std)",
				range: range,
			},
			{
				label: "sort",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "sort(${1:container}.begin(), ${1:container}.end());",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Sort elements in range (requires using namespace std)",
				range: range,
			},
			{
				label: "find",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText:
					"find(${1:container}.begin(), ${1:container}.end(), ${2:value})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Find element in range (requires using namespace std)",
				range: range,
			},
			{
				label: "binary_search",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText:
					"binary_search(${1:container}.begin(), ${1:container}.end(), ${2:value})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation:
					"Binary search in sorted range (requires using namespace std)",
				range: range,
			},
			{
				label: "max",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "max(${1:a}, ${2:b})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation:
					"Returns maximum of two values (requires using namespace std)",
				range: range,
			},
			{
				label: "min",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "min(${1:a}, ${2:b})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation:
					"Returns minimum of two values (requires using namespace std)",
				range: range,
			},
			{
				label: "swap",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "swap(${1:a}, ${2:b});",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation:
					"Swap values of two objects (requires using namespace std)",
				range: range,
			},
			{
				label: "reverse",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "reverse(${1:container}.begin(), ${1:container}.end());",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation:
					"Reverse elements in range (requires using namespace std)",
				range: range,
			},
			{
				label: "count",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText:
					"count(${1:container}.begin(), ${1:container}.end(), ${2:value})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation:
					"Count occurrences of value in range (requires using namespace std)",
				range: range,
			},
		];

		return { suggestions };
	},
});
