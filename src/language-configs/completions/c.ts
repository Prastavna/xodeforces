import * as monaco from "monaco-editor";

// Helper function to extract variables from C code
function extractCVariables(code: string) {
	const variables: Array<{ name: string; type: string; line: number }> = [];
	const lines = code.split("\n");

	for (let i = 0; i < lines.length; i++) {
		const line = lines[i].trim();

		// Match variable declarations (basic types)
		const varMatches = line.matchAll(
			/\b(int|float|double|char|long|short|unsigned\s+int|signed\s+int|bool)\s+(\w+)(?:\s*=\s*[^;,]+)?\s*[;,]/g,
		);
		for (const match of varMatches) {
			const type = match[1];
			const name = match[2];
			variables.push({ name, type, line: i + 1 });
		}

		// Match array declarations
		const arrayMatches = line.matchAll(
			/\b(int|float|double|char|long|short|unsigned\s+int|signed\s+int|bool)\s+(\w+)\s*\[/g,
		);
		for (const match of arrayMatches) {
			const type = match[1] + "[]";
			const name = match[2];
			variables.push({ name, type, line: i + 1 });
		}

		// Match function declarations
		const funcMatches = line.matchAll(
			/\b(int|float|double|char|void|long|short|unsigned\s+int|signed\s+int|bool)\s+(\w+)\s*\(/g,
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

// Helper function to suggest related functions for variable types
function getRelatedFunctions(variableName: string, variableType: string) {
	const suggestions = [];

	if (
		variableType.includes("int") ||
		variableType.includes("long") ||
		variableType.includes("short")
	) {
		suggestions.push(
			{
				label: `printf ${variableName}`,
				insertText: `printf("%d\\n", ${variableName});`,
				documentation: `Print ${variableName} (${variableType})`,
			},
			{
				label: `scanf ${variableName}`,
				insertText: `scanf("%d", &${variableName});`,
				documentation: `Read value into ${variableName} (${variableType})`,
			},
		);
	}

	if (variableType.includes("float") || variableType.includes("double")) {
		suggestions.push(
			{
				label: `printf ${variableName}`,
				insertText: `printf("%.2f\\n", ${variableName});`,
				documentation: `Print ${variableName} (${variableType})`,
			},
			{
				label: `scanf ${variableName}`,
				insertText: `scanf("%f", &${variableName});`,
				documentation: `Read value into ${variableName} (${variableType})`,
			},
		);
	}

	if (variableType.includes("char") && variableType.includes("[]")) {
		suggestions.push(
			{
				label: `printf ${variableName}`,
				insertText: `printf("%s\\n", ${variableName});`,
				documentation: `Print ${variableName} (${variableType})`,
			},
			{
				label: `scanf ${variableName}`,
				insertText: `scanf("%s", ${variableName});`,
				documentation: `Read string into ${variableName} (${variableType})`,
			},
			{
				label: `strlen ${variableName}`,
				insertText: `strlen(${variableName})`,
				documentation: `Get length of ${variableName} (${variableType})`,
			},
		);
	}

	// Add increment/decrement for numeric types
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

monaco.languages.registerCompletionItemProvider("c", {
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
		const extractedVariables = extractCVariables(code);

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
			const relatedFunctions = getRelatedFunctions(
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
				insertText: "struct ${1:StructName} {\n    ${2:// struct members}\n};",
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
			// More standard library headers
			{
				label: "#include <math.h>",
				kind: monaco.languages.CompletionItemKind.Snippet,
				insertText: "#include <math.h>",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Include math functions header",
				range: range,
			},
			{
				label: "#include <ctype.h>",
				kind: monaco.languages.CompletionItemKind.Snippet,
				insertText: "#include <ctype.h>",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Include character type functions header",
				range: range,
			},
			{
				label: "#include <time.h>",
				kind: monaco.languages.CompletionItemKind.Snippet,
				insertText: "#include <time.h>",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Include time functions header",
				range: range,
			},
			{
				label: "#include <limits.h>",
				kind: monaco.languages.CompletionItemKind.Snippet,
				insertText: "#include <limits.h>",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Include limits and constants header",
				range: range,
			},
			{
				label: "#include <stdbool.h>",
				kind: monaco.languages.CompletionItemKind.Snippet,
				insertText: "#include <stdbool.h>",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Include boolean type header",
				range: range,
			},
			// Mathematical functions
			{
				label: "sqrt",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "sqrt(${1:number})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Square root function",
				range: range,
			},
			{
				label: "pow",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "pow(${1:base}, ${2:exponent})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Power function",
				range: range,
			},
			{
				label: "abs",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "abs(${1:number})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Absolute value function",
				range: range,
			},
			{
				label: "sin",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "sin(${1:angle})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Sine function",
				range: range,
			},
			{
				label: "cos",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "cos(${1:angle})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Cosine function",
				range: range,
			},
			{
				label: "tan",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "tan(${1:angle})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Tangent function",
				range: range,
			},
			{
				label: "ceil",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "ceil(${1:number})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Ceiling function",
				range: range,
			},
			{
				label: "floor",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "floor(${1:number})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Floor function",
				range: range,
			},
			// Character functions
			{
				label: "isalpha",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "isalpha(${1:char})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Check if character is alphabetic",
				range: range,
			},
			{
				label: "isdigit",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "isdigit(${1:char})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Check if character is digit",
				range: range,
			},
			{
				label: "toupper",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "toupper(${1:char})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Convert character to uppercase",
				range: range,
			},
			{
				label: "tolower",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "tolower(${1:char})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Convert character to lowercase",
				range: range,
			},
			// Memory functions
			{
				label: "calloc",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "calloc(${1:count}, ${2:size})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Allocate and zero-initialize memory",
				range: range,
			},
			{
				label: "realloc",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "realloc(${1:pointer}, ${2:newSize})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Reallocate memory",
				range: range,
			},
			{
				label: "memcpy",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "memcpy(${1:dest}, ${2:src}, ${3:size});",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Copy memory block",
				range: range,
			},
			{
				label: "memset",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "memset(${1:ptr}, ${2:value}, ${3:size});",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Set memory block to value",
				range: range,
			},
			// String functions
			{
				label: "strcat",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "strcat(${1:dest}, ${2:src});",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Concatenate strings",
				range: range,
			},
			{
				label: "strncpy",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "strncpy(${1:dest}, ${2:src}, ${3:n});",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Copy n characters of string",
				range: range,
			},
			{
				label: "strstr",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "strstr(${1:haystack}, ${2:needle})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Find substring in string",
				range: range,
			},
			{
				label: "strtok",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "strtok(${1:str}, ${2:delim})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Split string into tokens",
				range: range,
			},
			// File I/O functions
			{
				label: "fread",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "fread(${1:buffer}, ${2:size}, ${3:count}, ${4:fp})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Read data from file",
				range: range,
			},
			{
				label: "fwrite",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "fwrite(${1:buffer}, ${2:size}, ${3:count}, ${4:fp})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Write data to file",
				range: range,
			},
			{
				label: "fscanf",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: 'fscanf(${1:fp}, "${2:format}", ${3:args});',
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Read formatted data from file",
				range: range,
			},
			{
				label: "fgets",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "fgets(${1:buffer}, ${2:size}, ${3:fp})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Read string from file",
				range: range,
			},
			{
				label: "fputs",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "fputs(${1:string}, ${2:fp});",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Write string to file",
				range: range,
			},
			// Time functions
			{
				label: "time",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "time(${1:NULL})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Get current time",
				range: range,
			},
			{
				label: "clock",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "clock()",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Get processor time",
				range: range,
			},
			// Common array declarations
			{
				label: "int array",
				kind: monaco.languages.CompletionItemKind.Snippet,
				insertText: "int ${1:arrayName}[${2:size}];",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Declare integer array",
				range: range,
			},
			{
				label: "char array",
				kind: monaco.languages.CompletionItemKind.Snippet,
				insertText: "char ${1:arrayName}[${2:size}];",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Declare character array",
				range: range,
			},
			{
				label: "2D array",
				kind: monaco.languages.CompletionItemKind.Snippet,
				insertText: "${1:int} ${2:arrayName}[${3:rows}][${4:cols}];",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Declare 2D array",
				range: range,
			},
			// Preprocessor directives
			{
				label: "#define",
				kind: monaco.languages.CompletionItemKind.Snippet,
				insertText: "#define ${1:NAME} ${2:value}",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Define macro",
				range: range,
			},
			{
				label: "#ifdef",
				kind: monaco.languages.CompletionItemKind.Snippet,
				insertText: "#ifdef ${1:MACRO}\n    ${2:// code}\n#endif",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Conditional compilation",
				range: range,
			},
			{
				label: "#ifndef",
				kind: monaco.languages.CompletionItemKind.Snippet,
				insertText: "#ifndef ${1:MACRO}\n    ${2:// code}\n#endif",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Conditional compilation (if not defined)",
				range: range,
			},
			// Common constants
			{
				label: "NULL",
				kind: monaco.languages.CompletionItemKind.Constant,
				insertText: "NULL",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Null pointer constant",
				range: range,
			},
			{
				label: "TRUE",
				kind: monaco.languages.CompletionItemKind.Constant,
				insertText: "TRUE",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Boolean true constant",
				range: range,
			},
			{
				label: "FALSE",
				kind: monaco.languages.CompletionItemKind.Constant,
				insertText: "FALSE",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Boolean false constant",
				range: range,
			},
			// Common snippets for competitive programming
			{
				label: "fast input",
				kind: monaco.languages.CompletionItemKind.Snippet,
				insertText: "setbuf(stdout, NULL);",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Unbuffered output for faster I/O",
				range: range,
			},
			{
				label: "max macro",
				kind: monaco.languages.CompletionItemKind.Snippet,
				insertText: "#define MAX(a, b) ((a) > (b) ? (a) : (b))",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Maximum macro function",
				range: range,
			},
			{
				label: "min macro",
				kind: monaco.languages.CompletionItemKind.Snippet,
				insertText: "#define MIN(a, b) ((a) < (b) ? (a) : (b))",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Minimum macro function",
				range: range,
			},
		];

		return { suggestions };
	},
});
