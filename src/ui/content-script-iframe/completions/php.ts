import * as monaco from "monaco-editor";

// Helper function to extract variables from PHP code
function extractPHPVariables(code: string) {
	const variables: Array<{ name: string; type: string; line: number }> = [];
	const lines = code.split("\n");

	for (let i = 0; i < lines.length; i++) {
		const line = lines[i].trim();

		// Match variable assignments
		const varMatches = line.matchAll(/(\$\w+)\s*=\s*(.+);/g);
		for (const match of varMatches) {
			const name = match[1];
			const value = match[2].trim();
			let type = "variable";

			// Try to infer type from assignment
			if (value.match(/^\d+$/)) type = "int";
			else if (value.match(/^\d*\.\d+$/)) type = "float";
			else if (value.match(/^["'][^"']*["']$/)) type = "string";
			else if (value.match(/^array\(/)) type = "array";
			else if (value.match(/^\[/)) type = "array";
			else if (value === "true" || value === "false") type = "bool";
			else if (value.match(/^new\s+/)) type = "object";

			variables.push({ name, type, line: i + 1 });
		}

		// Match function definitions
		const funcMatches = line.matchAll(/function\s+(\w+)\s*\(/g);
		for (const match of funcMatches) {
			const name = match[1];
			variables.push({ name, type: "function", line: i + 1 });
		}

		// Match class definitions
		const classMatches = line.matchAll(/class\s+(\w+)/g);
		for (const match of classMatches) {
			const name = match[1];
			variables.push({ name, type: "class", line: i + 1 });
		}
	}

	return variables;
}

// Helper function to suggest related functions for PHP variable types
function getPHPRelatedFunctions(variableName: string, variableType: string) {
	const suggestions = [];

	// echo for all variables
	suggestions.push({
		label: `echo ${variableName}`,
		insertText: `echo ${variableName};`,
		documentation: `Output ${variableName} (${variableType})`,
	});

	// var_dump for debugging
	suggestions.push({
		label: `var_dump(${variableName})`,
		insertText: `var_dump(${variableName});`,
		documentation: `Debug output ${variableName}`,
	});

	// String operations
	if (variableType === "string" || variableType === "variable") {
		suggestions.push(
			{
				label: `strlen(${variableName})`,
				insertText: `strlen(${variableName})`,
				documentation: `Get length of ${variableName}`,
			},
			{
				label: `strtoupper(${variableName})`,
				insertText: `strtoupper(${variableName})`,
				documentation: `Convert ${variableName} to uppercase`,
			},
			{
				label: `strtolower(${variableName})`,
				insertText: `strtolower(${variableName})`,
				documentation: `Convert ${variableName} to lowercase`,
			},
			{
				label: `explode(',', ${variableName})`,
				insertText: `explode('\${1:delimiter}', ${variableName})`,
				documentation: `Split ${variableName} into array`,
			},
			{
				label: `trim(${variableName})`,
				insertText: `trim(${variableName})`,
				documentation: `Trim whitespace from ${variableName}`,
			},
		);
	}

	// Array operations
	if (variableType === "array" || variableType === "variable") {
		suggestions.push(
			{
				label: `count(${variableName})`,
				insertText: `count(${variableName})`,
				documentation: `Get count of ${variableName}`,
			},
			{
				label: `array_push(${variableName})`,
				insertText: `array_push(${variableName}, \${1:value});`,
				documentation: `Add element to ${variableName}`,
			},
			{
				label: `array_pop(${variableName})`,
				insertText: `array_pop(${variableName})`,
				documentation: `Remove last element from ${variableName}`,
			},
			{
				label: `sort(${variableName})`,
				insertText: `sort(${variableName});`,
				documentation: `Sort ${variableName}`,
			},
			{
				label: `in_array($value, ${variableName})`,
				insertText: `in_array(\${1:value}, ${variableName})`,
				documentation: `Check if value exists in ${variableName}`,
			},
			{
				label: `implode(',', ${variableName})`,
				insertText: `implode('\${1:separator}', ${variableName})`,
				documentation: `Join ${variableName} elements into string`,
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
				label: `round(${variableName})`,
				insertText: `round(${variableName})`,
				documentation: `Round ${variableName}`,
			},
			{
				label: `is_numeric(${variableName})`,
				insertText: `is_numeric(${variableName})`,
				documentation: `Check if ${variableName} is numeric`,
			},
		);
	}

	// Type checking functions
	suggestions.push(
		{
			label: `gettype(${variableName})`,
			insertText: `gettype(${variableName})`,
			documentation: `Get type of ${variableName}`,
		},
		{
			label: `isset(${variableName})`,
			insertText: `isset(${variableName})`,
			documentation: `Check if ${variableName} is set`,
		},
		{
			label: `empty(${variableName})`,
			insertText: `empty(${variableName})`,
			documentation: `Check if ${variableName} is empty`,
		},
	);

	return suggestions;
}

monaco.languages.registerCompletionItemProvider("php", {
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
		const extractedVariables = extractPHPVariables(code);

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
				const relatedFunctions = getPHPRelatedFunctions(
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
			// More built-in functions
			{
				label: "strlen",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "strlen(${1:$string})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Get string length",
				range: range,
			},
			{
				label: "substr",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "substr(${1:$string}, ${2:$start}, ${3:$length})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Return part of a string",
				range: range,
			},
			{
				label: "strpos",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "strpos(${1:$haystack}, ${2:$needle})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Find position of substring",
				range: range,
			},
			{
				label: "str_replace",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "str_replace(${1:$search}, ${2:$replace}, ${3:$subject})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Replace occurrences in string",
				range: range,
			},
			{
				label: "explode",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "explode(${1:$delimiter}, ${2:$string})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Split string by delimiter",
				range: range,
			},
			{
				label: "implode",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "implode(${1:$glue}, ${2:$pieces})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Join array elements with string",
				range: range,
			},
			{
				label: "trim",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "trim(${1:$string})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Strip whitespace from both ends",
				range: range,
			},
			{
				label: "strtolower",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "strtolower(${1:$string})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Convert string to lowercase",
				range: range,
			},
			{
				label: "strtoupper",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "strtoupper(${1:$string})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Convert string to uppercase",
				range: range,
			},
			{
				label: "ucfirst",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "ucfirst(${1:$string})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Uppercase first character",
				range: range,
			},
			// Array functions
			{
				label: "count",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "count(${1:$array})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Count array elements",
				range: range,
			},
			{
				label: "array_push",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "array_push(${1:$array}, ${2:$value})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Push element onto array",
				range: range,
			},
			{
				label: "array_pop",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "array_pop(${1:$array})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Pop element from end of array",
				range: range,
			},
			{
				label: "array_shift",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "array_shift(${1:$array})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Shift element from beginning of array",
				range: range,
			},
			{
				label: "array_unshift",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "array_unshift(${1:$array}, ${2:$value})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Prepend element to array",
				range: range,
			},
			{
				label: "array_merge",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "array_merge(${1:$array1}, ${2:$array2})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Merge arrays",
				range: range,
			},
			{
				label: "array_keys",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "array_keys(${1:$array})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Return array keys",
				range: range,
			},
			{
				label: "array_values",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "array_values(${1:$array})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Return array values",
				range: range,
			},
			{
				label: "in_array",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "in_array(${1:$needle}, ${2:$haystack})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Check if value exists in array",
				range: range,
			},
			{
				label: "array_search",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "array_search(${1:$needle}, ${2:$haystack})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Search for value and return key",
				range: range,
			},
			{
				label: "sort",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "sort(${1:$array})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Sort array",
				range: range,
			},
			{
				label: "array_reverse",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "array_reverse(${1:$array})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Reverse array",
				range: range,
			},
			// Type checking functions
			{
				label: "is_array",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "is_array(${1:$variable})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Check if variable is array",
				range: range,
			},
			{
				label: "is_string",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "is_string(${1:$variable})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Check if variable is string",
				range: range,
			},
			{
				label: "is_int",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "is_int(${1:$variable})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Check if variable is integer",
				range: range,
			},
			{
				label: "is_null",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "is_null(${1:$variable})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Check if variable is null",
				range: range,
			},
			{
				label: "empty",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "empty(${1:$variable})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Check if variable is empty",
				range: range,
			},
			// Math functions
			{
				label: "abs",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "abs(${1:$number})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Absolute value",
				range: range,
			},
			{
				label: "max",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "max(${1:$values})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Find maximum value",
				range: range,
			},
			{
				label: "min",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "min(${1:$values})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Find minimum value",
				range: range,
			},
			{
				label: "rand",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "rand(${1:$min}, ${2:$max})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Generate random number",
				range: range,
			},
			{
				label: "round",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "round(${1:$number}, ${2:$precision})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Round number",
				range: range,
			},
			{
				label: "pow",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "pow(${1:$base}, ${2:$exp})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Exponential expression",
				range: range,
			},
			{
				label: "sqrt",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "sqrt(${1:$number})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Square root",
				range: range,
			},
			// File functions
			{
				label: "file_get_contents",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "file_get_contents(${1:$filename})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Read entire file into string",
				range: range,
			},
			{
				label: "file_put_contents",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "file_put_contents(${1:$filename}, ${2:$data})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Write data to file",
				range: range,
			},
			{
				label: "file_exists",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "file_exists(${1:$filename})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Check if file exists",
				range: range,
			},
			{
				label: "fopen",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "fopen(${1:$filename}, ${2:$mode})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Open file or URL",
				range: range,
			},
			{
				label: "fclose",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "fclose(${1:$handle})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Close file pointer",
				range: range,
			},
			{
				label: "fwrite",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "fwrite(${1:$handle}, ${2:$string})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Write to file",
				range: range,
			},
			{
				label: "fread",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "fread(${1:$handle}, ${2:$length})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Read from file",
				range: range,
			},
			// Date/time functions
			{
				label: "date",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: 'date("${1:Y-m-d H:i:s}")',
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Format current date/time",
				range: range,
			},
			{
				label: "time",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "time()",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Return current Unix timestamp",
				range: range,
			},
			{
				label: "strtotime",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "strtotime(${1:$time})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Parse time string to timestamp",
				range: range,
			},
			// JSON functions
			{
				label: "json_encode",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "json_encode(${1:$value})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Encode value to JSON",
				range: range,
			},
			{
				label: "json_decode",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "json_decode(${1:$json}, ${2:true})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Decode JSON string",
				range: range,
			},
			// More superglobals
			{
				label: "$_SERVER",
				kind: monaco.languages.CompletionItemKind.Variable,
				insertText: "$_SERVER[${1:'key'}]",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Server and environment information",
				range: range,
			},
			{
				label: "$_COOKIE",
				kind: monaco.languages.CompletionItemKind.Variable,
				insertText: "$_COOKIE[${1:'key'}]",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Cookie values",
				range: range,
			},
			{
				label: "$_FILES",
				kind: monaco.languages.CompletionItemKind.Variable,
				insertText: "$_FILES[${1:'key'}]",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "File upload information",
				range: range,
			},
			{
				label: "$_REQUEST",
				kind: monaco.languages.CompletionItemKind.Variable,
				insertText: "$_REQUEST[${1:'key'}]",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Combined GET, POST, and COOKIE data",
				range: range,
			},
			// Control structures
			{
				label: "while",
				kind: monaco.languages.CompletionItemKind.Keyword,
				insertText: "while (${1:$condition}) {\n    ${2:// loop body}\n}",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "While loop",
				range: range,
			},
			{
				label: "switch",
				kind: monaco.languages.CompletionItemKind.Keyword,
				insertText:
					"switch (${1:$variable}) {\n    case ${2:'value1'}:\n        ${3:// case 1}\n        break;\n    case ${4:'value2'}:\n        ${5:// case 2}\n        break;\n    default:\n        ${6:// default case}\n}",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Switch statement",
				range: range,
			},
			{
				label: "try-catch",
				kind: monaco.languages.CompletionItemKind.Snippet,
				insertText:
					"try {\n    ${1:// try block}\n} catch (${2:Exception} ${3:$e}) {\n    ${4:// catch block}\n}",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Try-catch block",
				range: range,
			},
			// More PHP tags
			{
				label: "<?php",
				kind: monaco.languages.CompletionItemKind.Snippet,
				insertText: "<?php\n${1:// PHP code}\n?>",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "PHP opening and closing tags",
				range: range,
			},
			{
				label: "include",
				kind: monaco.languages.CompletionItemKind.Keyword,
				insertText: "include ${1:'filename.php'};",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Include file",
				range: range,
			},
			{
				label: "require",
				kind: monaco.languages.CompletionItemKind.Keyword,
				insertText: "require ${1:'filename.php'};",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Require file",
				range: range,
			},
			{
				label: "include_once",
				kind: monaco.languages.CompletionItemKind.Keyword,
				insertText: "include_once ${1:'filename.php'};",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Include file once",
				range: range,
			},
			{
				label: "require_once",
				kind: monaco.languages.CompletionItemKind.Keyword,
				insertText: "require_once ${1:'filename.php'};",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Require file once",
				range: range,
			},
		];

		return { suggestions };
	},
});
