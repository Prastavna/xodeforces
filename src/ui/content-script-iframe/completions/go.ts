import * as monaco from "monaco-editor";

// Helper function to extract variables from Go code
function extractGoVariables(code: string) {
	const variables: Array<{ name: string; type: string; line: number }> = [];
	const lines = code.split("\n");

	for (let i = 0; i < lines.length; i++) {
		const line = lines[i].trim();

		// Match variable declarations with var
		const varMatches = line.matchAll(
			/var\s+(\w+)\s+(int|float64|float32|string|bool|byte|rune|\[\]int|\[\]string|map\[[^\]]+\][^\s]+)/g,
		);
		for (const match of varMatches) {
			const name = match[1];
			const type = match[2];
			variables.push({ name, type, line: i + 1 });
		}

		// Match short variable declarations
		const shortMatches = line.matchAll(/(\w+)\s*:=\s*(.+)/g);
		for (const match of shortMatches) {
			const name = match[1];
			const value = match[2].trim();
			let type = "variable";

			// Try to infer type
			if (value.match(/^\d+$/)) type = "int";
			else if (value.match(/^\d*\.\d+$/)) type = "float64";
			else if (value.match(/^"[^"]*"$/)) type = "string";
			else if (value.match(/^`[^`]*`$/)) type = "string";
			else if (value === "true" || value === "false") type = "bool";
			else if (value.match(/^\[\]/)) type = "slice";
			else if (value.match(/^make\(map/)) type = "map";
			else if (value.match(/^make\(/)) type = "slice";

			variables.push({ name, type, line: i + 1 });
		}

		// Match function declarations
		const funcMatches = line.matchAll(/func\s+(\w+)\s*\(/g);
		for (const match of funcMatches) {
			const name = match[1];
			if (name !== "main") {
				variables.push({ name, type: "function", line: i + 1 });
			}
		}

		// Match struct declarations
		const structMatches = line.matchAll(/type\s+(\w+)\s+struct/g);
		for (const match of structMatches) {
			const name = match[1];
			variables.push({ name, type: "struct", line: i + 1 });
		}
	}

	return variables;
}

// Helper function to suggest related functions for Go variable types
function getGoRelatedFunctions(variableName: string, variableType: string) {
	const suggestions = [];

	// fmt operations for all variables
	suggestions.push({
		label: `fmt.Println(${variableName})`,
		insertText: `fmt.Println(${variableName})`,
		documentation: `Print ${variableName} (${variableType})`,
	});

	// String operations
	if (variableType === "string") {
		suggestions.push(
			{
				label: `len(${variableName})`,
				insertText: `len(${variableName})`,
				documentation: `Get length of ${variableName}`,
			},
			{
				label: `strings.ToUpper(${variableName})`,
				insertText: `strings.ToUpper(${variableName})`,
				documentation: `Convert ${variableName} to uppercase`,
			},
			{
				label: `strings.ToLower(${variableName})`,
				insertText: `strings.ToLower(${variableName})`,
				documentation: `Convert ${variableName} to lowercase`,
			},
			{
				label: `strings.Split(${variableName})`,
				insertText: `strings.Split(${variableName}, "\${1:separator}")`,
				documentation: `Split ${variableName}`,
			},
			{
				label: `strings.Contains(${variableName})`,
				insertText: `strings.Contains(${variableName}, "\${1:substr}")`,
				documentation: `Check if ${variableName} contains substring`,
			},
		);
	}

	// Slice operations
	if (variableType.includes("[]") || variableType === "slice") {
		suggestions.push(
			{
				label: `len(${variableName})`,
				insertText: `len(${variableName})`,
				documentation: `Get length of ${variableName}`,
			},
			{
				label: `cap(${variableName})`,
				insertText: `cap(${variableName})`,
				documentation: `Get capacity of ${variableName}`,
			},
			{
				label: `append(${variableName})`,
				insertText: `${variableName} = append(${variableName}, \${1:value})`,
				documentation: `Append to ${variableName}`,
			},
			{
				label: `sort.Ints(${variableName})`,
				insertText: `sort.Ints(${variableName})`,
				documentation: `Sort ${variableName} (for int slices)`,
			},
			{
				label: `sort.Strings(${variableName})`,
				insertText: `sort.Strings(${variableName})`,
				documentation: `Sort ${variableName} (for string slices)`,
			},
		);
	}

	// Map operations
	if (variableType.includes("map") || variableType === "map") {
		suggestions.push(
			{
				label: `len(${variableName})`,
				insertText: `len(${variableName})`,
				documentation: `Get length of ${variableName}`,
			},
			{
				label: `delete(${variableName})`,
				insertText: `delete(${variableName}, \${1:key})`,
				documentation: `Delete key from ${variableName}`,
			},
			{
				label: `${variableName}[key], ok`,
				insertText: `\${1:value}, \${2:ok} := ${variableName}[\${3:key}]`,
				documentation: `Get value from ${variableName} with ok check`,
			},
		);
	}

	// Numeric operations
	if (
		variableType === "int" ||
		variableType === "int64" ||
		variableType === "int32"
	) {
		suggestions.push(
			{
				label: `strconv.Itoa(${variableName})`,
				insertText: `strconv.Itoa(${variableName})`,
				documentation: `Convert ${variableName} to string`,
			},
			{
				label: `math.Abs(${variableName})`,
				insertText: `math.Abs(float64(${variableName}))`,
				documentation: `Get absolute value of ${variableName}`,
			},
		);
	}

	if (variableType === "float64" || variableType === "float32") {
		suggestions.push(
			{
				label: `math.Floor(${variableName})`,
				insertText: `math.Floor(${variableName})`,
				documentation: `Floor of ${variableName}`,
			},
			{
				label: `math.Ceil(${variableName})`,
				insertText: `math.Ceil(${variableName})`,
				documentation: `Ceiling of ${variableName}`,
			},
			{
				label: `math.Round(${variableName})`,
				insertText: `math.Round(${variableName})`,
				documentation: `Round ${variableName}`,
			},
		);
	}

	// Control flow suggestions
	suggestions.push(
		{
			label: `if ${variableName}`,
			insertText: `if ${variableName} {\n\t\${1:// code}\n}`,
			documentation: `Check if ${variableName} is truthy`,
		},
		{
			label: `for range ${variableName}`,
			insertText: `for \${1:index}, \${2:value} := range ${variableName} {\n\t\${3:// code}\n}`,
			documentation: `Iterate over ${variableName}`,
		},
	);

	return suggestions;
}

monaco.languages.registerCompletionItemProvider("go", {
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
		const extractedVariables = extractGoVariables(code);

		// Create suggestions for extracted variables
		const variableSuggestions = extractedVariables.map((variable) => ({
			label: variable.name,
			kind:
				variable.type === "function"
					? monaco.languages.CompletionItemKind.Function
					: variable.type === "struct"
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
			if (variable.type !== "function" && variable.type !== "struct") {
				const relatedFunctions = getGoRelatedFunctions(
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
			// More built-in functions
			{
				label: "len",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "len(${1:slice})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Length of slice, map, or string",
				range: range,
			},
			{
				label: "cap",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "cap(${1:slice})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Capacity of slice or channel",
				range: range,
			},
			{
				label: "append",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "append(${1:slice}, ${2:elements})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Append elements to slice",
				range: range,
			},
			{
				label: "copy",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "copy(${1:dst}, ${2:src})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Copy elements between slices",
				range: range,
			},
			{
				label: "delete",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "delete(${1:map}, ${2:key})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Delete key from map",
				range: range,
			},
			{
				label: "new",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "new(${1:Type})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Allocate memory for type",
				range: range,
			},
			{
				label: "panic",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: 'panic("${1:message}")',
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Cause runtime panic",
				range: range,
			},
			{
				label: "recover",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "recover()",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Recover from panic",
				range: range,
			},
			{
				label: "close",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "close(${1:channel})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Close channel",
				range: range,
			},
			// Standard library packages
			{
				label: "strings.Contains",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "strings.Contains(${1:s}, ${2:substr})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Check if string contains substring",
				range: range,
			},
			{
				label: "strings.Split",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "strings.Split(${1:s}, ${2:sep})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Split string by separator",
				range: range,
			},
			{
				label: "strings.Join",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "strings.Join(${1:slice}, ${2:sep})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Join slice elements with separator",
				range: range,
			},
			{
				label: "strings.Replace",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "strings.Replace(${1:s}, ${2:old}, ${3:new}, ${4:n})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Replace occurrences in string",
				range: range,
			},
			{
				label: "strings.ToLower",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "strings.ToLower(${1:s})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Convert string to lowercase",
				range: range,
			},
			{
				label: "strings.ToUpper",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "strings.ToUpper(${1:s})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Convert string to uppercase",
				range: range,
			},
			{
				label: "strings.TrimSpace",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "strings.TrimSpace(${1:s})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Remove leading/trailing whitespace",
				range: range,
			},
			// Math functions
			{
				label: "math.Max",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "math.Max(${1:x}, ${2:y})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Return maximum of two floats",
				range: range,
			},
			{
				label: "math.Min",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "math.Min(${1:x}, ${2:y})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Return minimum of two floats",
				range: range,
			},
			{
				label: "math.Abs",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "math.Abs(${1:x})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Return absolute value",
				range: range,
			},
			{
				label: "math.Sqrt",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "math.Sqrt(${1:x})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Return square root",
				range: range,
			},
			{
				label: "math.Pow",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "math.Pow(${1:x}, ${2:y})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Return x raised to power y",
				range: range,
			},
			// Sort package
			{
				label: "sort.Ints",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "sort.Ints(${1:slice})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Sort slice of ints",
				range: range,
			},
			{
				label: "sort.Strings",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "sort.Strings(${1:slice})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Sort slice of strings",
				range: range,
			},
			{
				label: "sort.Slice",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText:
					"sort.Slice(${1:slice}, func(i, j int) bool {\n    return ${2:condition}\n})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Sort slice with custom function",
				range: range,
			},
			// IO functions
			{
				label: "io.Copy",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "io.Copy(${1:dst}, ${2:src})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Copy from src to dst",
				range: range,
			},
			{
				label: "ioutil.ReadFile",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "ioutil.ReadFile(${1:filename})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Read entire file",
				range: range,
			},
			{
				label: "ioutil.WriteFile",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "ioutil.WriteFile(${1:filename}, ${2:data}, ${3:perm})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Write data to file",
				range: range,
			},
			// JSON
			{
				label: "json.Marshal",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "json.Marshal(${1:v})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Marshal value to JSON",
				range: range,
			},
			{
				label: "json.Unmarshal",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "json.Unmarshal(${1:data}, ${2:v})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Unmarshal JSON to value",
				range: range,
			},
			// More control structures
			{
				label: "switch",
				kind: monaco.languages.CompletionItemKind.Keyword,
				insertText:
					"switch ${1:expr} {\ncase ${2:value1}:\n    ${3:// case 1}\ncase ${4:value2}:\n    ${5:// case 2}\ndefault:\n    ${6:// default case}\n}",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Switch statement",
				range: range,
			},
			{
				label: "select",
				kind: monaco.languages.CompletionItemKind.Keyword,
				insertText:
					"select {\ncase ${1:op1}:\n    ${2:// case 1}\ncase ${3:op2}:\n    ${4:// case 2}\ndefault:\n    ${5:// default case}\n}",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Select statement for channels",
				range: range,
			},
			{
				label: "defer",
				kind: monaco.languages.CompletionItemKind.Keyword,
				insertText: "defer ${1:function_call}",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Defer function execution",
				range: range,
			},
			{
				label: "go",
				kind: monaco.languages.CompletionItemKind.Keyword,
				insertText: "go ${1:function_call}",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Start goroutine",
				range: range,
			},
			// Channel operations
			{
				label: "channel",
				kind: monaco.languages.CompletionItemKind.Snippet,
				insertText: "chan ${1:Type}",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Channel type",
				range: range,
			},
			{
				label: "buffered channel",
				kind: monaco.languages.CompletionItemKind.Snippet,
				insertText: "make(chan ${1:Type}, ${2:buffer_size})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Create buffered channel",
				range: range,
			},
			// Error handling
			{
				label: "if err",
				kind: monaco.languages.CompletionItemKind.Snippet,
				insertText: "if err != nil {\n    ${1:// handle error}\n}",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Error check pattern",
				range: range,
			},
			{
				label: "errors.New",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: 'errors.New("${1:error message}")',
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Create new error",
				range: range,
			},
			// Import statements
			{
				label: 'import "fmt"',
				kind: monaco.languages.CompletionItemKind.Snippet,
				insertText: 'import "fmt"',
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Import fmt package",
				range: range,
			},
			{
				label: 'import "strings"',
				kind: monaco.languages.CompletionItemKind.Snippet,
				insertText: 'import "strings"',
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Import strings package",
				range: range,
			},
			{
				label: 'import "math"',
				kind: monaco.languages.CompletionItemKind.Snippet,
				insertText: 'import "math"',
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Import math package",
				range: range,
			},
			{
				label: 'import "sort"',
				kind: monaco.languages.CompletionItemKind.Snippet,
				insertText: 'import "sort"',
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Import sort package",
				range: range,
			},
			{
				label: 'import "encoding/json"',
				kind: monaco.languages.CompletionItemKind.Snippet,
				insertText: 'import "encoding/json"',
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Import JSON package",
				range: range,
			},
			{
				label: 'import "io/ioutil"',
				kind: monaco.languages.CompletionItemKind.Snippet,
				insertText: 'import "io/ioutil"',
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Import ioutil package",
				range: range,
			},
			// Data structures
			{
				label: "slice",
				kind: monaco.languages.CompletionItemKind.Snippet,
				insertText: "[]${1:Type}{${2:elements}}",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Create slice literal",
				range: range,
			},
			{
				label: "map",
				kind: monaco.languages.CompletionItemKind.Snippet,
				insertText: "map[${1:KeyType}]${2:ValueType}{${3:key: value}}",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Create map literal",
				range: range,
			},
			{
				label: "empty map",
				kind: monaco.languages.CompletionItemKind.Snippet,
				insertText: "make(map[${1:KeyType}]${2:ValueType})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Create empty map",
				range: range,
			},
		];

		return { suggestions };
	},
});
