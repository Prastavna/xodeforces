import * as monaco from "monaco-editor";

// Helper function to extract variables from Python code
function extractPythonVariables(code: string) {
	const variables: Array<{ name: string; type: string; line: number }> = [];
	const lines = code.split("\n");

	for (let i = 0; i < lines.length; i++) {
		const line = lines[i].trim();

		// Match simple variable assignments
		const assignMatches = line.matchAll(/^(\w+)\s*=\s*(.+)/g);
		for (const match of assignMatches) {
			const name = match[1];
			const value = match[2].trim();
			let type = "variable";

			// Try to infer type from assignment
			if (value.match(/^\d+$/)) type = "int";
			else if (value.match(/^\d*\.\d+$/)) type = "float";
			else if (value.match(/^["'][^"']*["']$/)) type = "str";
			else if (value.match(/^\[.*\]$/)) type = "list";
			else if (value.match(/^\{.*\}$/)) type = "dict";
			else if (value.match(/^set\(/)) type = "set";
			else if (value.match(/^tuple\(/)) type = "tuple";
			else if (value.startsWith("input(")) type = "str";
			else if (value.startsWith("int(")) type = "int";
			else if (value.startsWith("float(")) type = "float";
			else if (value.startsWith("str(")) type = "str";
			else if (value.startsWith("list(")) type = "list";
			else if (value.startsWith("dict(")) type = "dict";

			variables.push({ name, type, line: i + 1 });
		}

		// Match function definitions
		const funcMatches = line.matchAll(/^def\s+(\w+)\s*\(/g);
		for (const match of funcMatches) {
			const name = match[1];
			variables.push({ name, type: "function", line: i + 1 });
		}

		// Match class definitions
		const classMatches = line.matchAll(/^class\s+(\w+)/g);
		for (const match of classMatches) {
			const name = match[1];
			variables.push({ name, type: "class", line: i + 1 });
		}

		// Match for loop variables
		const forMatches = line.matchAll(/^for\s+(\w+)\s+in\s+/g);
		for (const match of forMatches) {
			const name = match[1];
			variables.push({ name, type: "iterator", line: i + 1 });
		}
	}

	return variables;
}

// Helper function to suggest related functions for Python variable types
function getPythonRelatedFunctions(variableName: string, variableType: string) {
	const suggestions = [];

	// Common operations for all variables
	suggestions.push({
		label: `print(${variableName})`,
		insertText: `print(${variableName})`,
		documentation: `Print ${variableName} (${variableType})`,
	});

	// String operations
	if (variableType === "str" || variableType === "variable") {
		suggestions.push(
			{
				label: `len(${variableName})`,
				insertText: `len(${variableName})`,
				documentation: `Get length of ${variableName}`,
			},
			{
				label: `${variableName}.upper()`,
				insertText: `${variableName}.upper()`,
				documentation: `Convert ${variableName} to uppercase`,
			},
			{
				label: `${variableName}.lower()`,
				insertText: `${variableName}.lower()`,
				documentation: `Convert ${variableName} to lowercase`,
			},
			{
				label: `${variableName}.strip()`,
				insertText: `${variableName}.strip()`,
				documentation: `Remove whitespace from ${variableName}`,
			},
			{
				label: `${variableName}.split()`,
				insertText: `${variableName}.split(\${1:separator})`,
				documentation: `Split ${variableName} into list`,
			},
		);
	}

	// List operations
	if (variableType === "list" || variableType === "variable") {
		suggestions.push(
			{
				label: `${variableName}.append()`,
				insertText: `${variableName}.append(\${1:item})`,
				documentation: `Add item to ${variableName}`,
			},
			{
				label: `${variableName}.remove()`,
				insertText: `${variableName}.remove(\${1:item})`,
				documentation: `Remove item from ${variableName}`,
			},
			{
				label: `${variableName}.pop()`,
				insertText: `${variableName}.pop(\${1:index})`,
				documentation: `Remove and return item from ${variableName}`,
			},
			{
				label: `len(${variableName})`,
				insertText: `len(${variableName})`,
				documentation: `Get length of ${variableName}`,
			},
			{
				label: `sorted(${variableName})`,
				insertText: `sorted(${variableName})`,
				documentation: `Return sorted version of ${variableName}`,
			},
			{
				label: `${variableName}.sort()`,
				insertText: `${variableName}.sort()`,
				documentation: `Sort ${variableName} in place`,
			},
		);
	}

	// Dictionary operations
	if (variableType === "dict" || variableType === "variable") {
		suggestions.push(
			{
				label: `${variableName}.keys()`,
				insertText: `${variableName}.keys()`,
				documentation: `Get keys from ${variableName}`,
			},
			{
				label: `${variableName}.values()`,
				insertText: `${variableName}.values()`,
				documentation: `Get values from ${variableName}`,
			},
			{
				label: `${variableName}.items()`,
				insertText: `${variableName}.items()`,
				documentation: `Get key-value pairs from ${variableName}`,
			},
			{
				label: `${variableName}.get()`,
				insertText: `${variableName}.get(\${1:key}, \${2:default})`,
				documentation: `Get value from ${variableName} with default`,
			},
		);
	}

	// Set operations
	if (variableType === "set" || variableType === "variable") {
		suggestions.push(
			{
				label: `${variableName}.add()`,
				insertText: `${variableName}.add(\${1:item})`,
				documentation: `Add item to ${variableName}`,
			},
			{
				label: `${variableName}.remove()`,
				insertText: `${variableName}.remove(\${1:item})`,
				documentation: `Remove item from ${variableName}`,
			},
			{
				label: `${variableName}.discard()`,
				insertText: `${variableName}.discard(\${1:item})`,
				documentation: `Remove item from ${variableName} if present`,
			},
		);
	}

	// Numeric operations
	if (
		variableType === "int" ||
		variableType === "float" ||
		variableType === "variable"
	) {
		suggestions.push(
			{
				label: `abs(${variableName})`,
				insertText: `abs(${variableName})`,
				documentation: `Get absolute value of ${variableName}`,
			},
			{
				label: `str(${variableName})`,
				insertText: `str(${variableName})`,
				documentation: `Convert ${variableName} to string`,
			},
		);

		// Integer specific
		if (variableType === "int" || variableType === "variable") {
			suggestions.push({
				label: `float(${variableName})`,
				insertText: `float(${variableName})`,
				documentation: `Convert ${variableName} to float`,
			});
		}
	}

	// Common control flow with variables
	suggestions.push(
		{
			label: `if ${variableName}`,
			insertText: `if ${variableName}:\n    \${1:pass}`,
			documentation: `Check if ${variableName} is truthy`,
		},
		{
			label: `for item in ${variableName}`,
			insertText: `for \${1:item} in ${variableName}:\n    \${2:pass}`,
			documentation: `Iterate over ${variableName}`,
		},
	);

	return suggestions;
}

monaco.languages.registerCompletionItemProvider("python", {
	provideCompletionItems: (model, position) => {
		const word = model.getWordUntilPosition(position);
		const range = {
			startLineNumber: position.lineNumber,
			endLineNumber: position.lineNumber,
			startColumn: word.startColumn,
			endColumn: word.endColumn,
		};

		// Extract variables from the current code
		const code = model.getValue();
		const extractedVariables = extractPythonVariables(code);

		// Create suggestions for extracted variables
		const variableSuggestions = extractedVariables.map((variable) => ({
			label: variable.name,
			kind:
				variable.type === "function"
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
			if (variable.type !== "function" && variable.type !== "class") {
				const relatedFunctions = getPythonRelatedFunctions(
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
			// More built-in functions
			{
				label: "enumerate",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "enumerate(${1:iterable})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Return enumerate object with index and value pairs",
				range: range,
			},
			{
				label: "zip",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "zip(${1:iterable1}, ${2:iterable2})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Zip multiple iterables together",
				range: range,
			},
			{
				label: "map",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "map(${1:function}, ${2:iterable})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Apply function to all items in iterable",
				range: range,
			},
			{
				label: "filter",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "filter(${1:function}, ${2:iterable})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Filter items in iterable based on function",
				range: range,
			},
			{
				label: "sorted",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "sorted(${1:iterable})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Return sorted list from iterable",
				range: range,
			},
			{
				label: "reversed",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "reversed(${1:iterable})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Return reversed iterator",
				range: range,
			},
			{
				label: "sum",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "sum(${1:iterable})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Sum all items in iterable",
				range: range,
			},
			{
				label: "max",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "max(${1:iterable})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Return maximum value",
				range: range,
			},
			{
				label: "min",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "min(${1:iterable})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Return minimum value",
				range: range,
			},
			{
				label: "abs",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "abs(${1:number})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Return absolute value",
				range: range,
			},
			{
				label: "round",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "round(${1:number}, ${2:ndigits})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Round number to given precision",
				range: range,
			},
			{
				label: "pow",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "pow(${1:base}, ${2:exp})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Return base raised to power exp",
				range: range,
			},
			{
				label: "any",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "any(${1:iterable})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Return True if any element is True",
				range: range,
			},
			{
				label: "all",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "all(${1:iterable})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Return True if all elements are True",
				range: range,
			},
			{
				label: "isinstance",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "isinstance(${1:object}, ${2:classinfo})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Check if object is instance of class",
				range: range,
			},
			{
				label: "hasattr",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "hasattr(${1:object}, ${2:name})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Check if object has attribute",
				range: range,
			},
			{
				label: "getattr",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "getattr(${1:object}, ${2:name}, ${3:default})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Get attribute value from object",
				range: range,
			},
			{
				label: "setattr",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "setattr(${1:object}, ${2:name}, ${3:value})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Set attribute value on object",
				range: range,
			},
			// String methods
			{
				label: "join",
				kind: monaco.languages.CompletionItemKind.Method,
				insertText: "${1:separator}.join(${2:iterable})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Join iterable elements with separator",
				range: range,
			},
			{
				label: "split",
				kind: monaco.languages.CompletionItemKind.Method,
				insertText: "${1:string}.split(${2:separator})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Split string by separator",
				range: range,
			},
			{
				label: "strip",
				kind: monaco.languages.CompletionItemKind.Method,
				insertText: "${1:string}.strip()",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Remove whitespace from both ends",
				range: range,
			},
			{
				label: "replace",
				kind: monaco.languages.CompletionItemKind.Method,
				insertText: "${1:string}.replace(${2:old}, ${3:new})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Replace occurrences in string",
				range: range,
			},
			{
				label: "format",
				kind: monaco.languages.CompletionItemKind.Method,
				insertText: "${1:string}.format(${2:args})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Format string with arguments",
				range: range,
			},
			{
				label: "f-string",
				kind: monaco.languages.CompletionItemKind.Snippet,
				insertText: 'f"${1:text} {${2:variable}}"',
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Formatted string literal",
				range: range,
			},
			// List comprehension
			{
				label: "list comprehension",
				kind: monaco.languages.CompletionItemKind.Snippet,
				insertText: "[${1:expr} for ${2:item} in ${3:iterable}]",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "List comprehension",
				range: range,
			},
			{
				label: "list comprehension with condition",
				kind: monaco.languages.CompletionItemKind.Snippet,
				insertText:
					"[${1:expr} for ${2:item} in ${3:iterable} if ${4:condition}]",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "List comprehension with condition",
				range: range,
			},
			{
				label: "dict comprehension",
				kind: monaco.languages.CompletionItemKind.Snippet,
				insertText: "{${1:key}: ${2:value} for ${3:item} in ${4:iterable}}",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Dictionary comprehension",
				range: range,
			},
			{
				label: "set comprehension",
				kind: monaco.languages.CompletionItemKind.Snippet,
				insertText: "{${1:expr} for ${2:item} in ${3:iterable}}",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Set comprehension",
				range: range,
			},
			// Common imports
			{
				label: "import os",
				kind: monaco.languages.CompletionItemKind.Snippet,
				insertText: "import os",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Import os module",
				range: range,
			},
			{
				label: "import sys",
				kind: monaco.languages.CompletionItemKind.Snippet,
				insertText: "import sys",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Import sys module",
				range: range,
			},
			{
				label: "import math",
				kind: monaco.languages.CompletionItemKind.Snippet,
				insertText: "import math",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Import math module",
				range: range,
			},
			{
				label: "import random",
				kind: monaco.languages.CompletionItemKind.Snippet,
				insertText: "import random",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Import random module",
				range: range,
			},
			{
				label: "import datetime",
				kind: monaco.languages.CompletionItemKind.Snippet,
				insertText: "import datetime",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Import datetime module",
				range: range,
			},
			{
				label: "import json",
				kind: monaco.languages.CompletionItemKind.Snippet,
				insertText: "import json",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Import json module",
				range: range,
			},
			{
				label: "import re",
				kind: monaco.languages.CompletionItemKind.Snippet,
				insertText: "import re",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Import regular expressions module",
				range: range,
			},
			{
				label: "from collections import",
				kind: monaco.languages.CompletionItemKind.Snippet,
				insertText: "from collections import ${1:Counter}",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Import from collections module",
				range: range,
			},
			{
				label: "from itertools import",
				kind: monaco.languages.CompletionItemKind.Snippet,
				insertText: "from itertools import ${1:combinations}",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Import from itertools module",
				range: range,
			},
			// More control structures
			{
				label: "with",
				kind: monaco.languages.CompletionItemKind.Keyword,
				insertText: "with ${1:expression} as ${2:target}:\n    ${3:pass}",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Context manager statement",
				range: range,
			},
			{
				label: "lambda",
				kind: monaco.languages.CompletionItemKind.Keyword,
				insertText: "lambda ${1:args}: ${2:expression}",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Lambda function",
				range: range,
			},
			{
				label: "assert",
				kind: monaco.languages.CompletionItemKind.Keyword,
				insertText: "assert ${1:condition}, ${2:message}",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Assert statement",
				range: range,
			},
			{
				label: "raise",
				kind: monaco.languages.CompletionItemKind.Keyword,
				insertText: "raise ${1:Exception}(${2:message})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Raise exception",
				range: range,
			},
			{
				label: "yield",
				kind: monaco.languages.CompletionItemKind.Keyword,
				insertText: "yield ${1:value}",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Yield value in generator",
				range: range,
			},
			// Special methods
			{
				label: "__init__",
				kind: monaco.languages.CompletionItemKind.Method,
				insertText: "def __init__(self${1:, args}):\n    ${2:pass}",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Constructor method",
				range: range,
			},
			{
				label: "__str__",
				kind: monaco.languages.CompletionItemKind.Method,
				insertText: "def __str__(self):\n    return ${1:string_representation}",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "String representation method",
				range: range,
			},
			{
				label: "__repr__",
				kind: monaco.languages.CompletionItemKind.Method,
				insertText: "def __repr__(self):\n    return ${1:representation}",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Object representation method",
				range: range,
			},
			{
				label: "__len__",
				kind: monaco.languages.CompletionItemKind.Method,
				insertText: "def __len__(self):\n    return ${1:length}",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Length method",
				range: range,
			},
			// File operations
			{
				label: "with open",
				kind: monaco.languages.CompletionItemKind.Snippet,
				insertText:
					'with open(${1:filename}, ${2:"r"}) as ${3:file}:\n    ${4:pass}',
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Open file with context manager",
				range: range,
			},
			// Decorators
			{
				label: "@property",
				kind: monaco.languages.CompletionItemKind.Snippet,
				insertText: "@property\ndef ${1:name}(self):\n    return ${2:value}",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Property decorator",
				range: range,
			},
			{
				label: "@staticmethod",
				kind: monaco.languages.CompletionItemKind.Snippet,
				insertText: "@staticmethod\ndef ${1:name}(${2:args}):\n    ${3:pass}",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Static method decorator",
				range: range,
			},
			{
				label: "@classmethod",
				kind: monaco.languages.CompletionItemKind.Snippet,
				insertText:
					"@classmethod\ndef ${1:name}(cls${2:, args}):\n    ${3:pass}",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Class method decorator",
				range: range,
			},
		];

		return { suggestions };
	},
});
