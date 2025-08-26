import * as monaco from "monaco-editor";

// Helper function to extract variables from Rust code
function extractRustVariables(code: string) {
	const variables: Array<{ name: string; type: string; line: number }> = [];
	const lines = code.split("\n");

	for (let i = 0; i < lines.length; i++) {
		const line = lines[i].trim();

		// Match let bindings
		const letMatches = line.matchAll(
			/let\s+(mut\s+)?(\w+):\s*(i32|i64|f32|f64|String|str|bool|Vec<[^>]+>|HashMap<[^>]+>|&str)\s*=/g,
		);
		for (const match of letMatches) {
			const name = match[2];
			const type = match[3];
			variables.push({ name, type, line: i + 1 });
		}

		// Match let bindings with type inference
		const inferMatches = line.matchAll(/let\s+(mut\s+)?(\w+)\s*=\s*(.+);/g);
		for (const match of inferMatches) {
			const name = match[2];
			const value = match[3].trim();
			let type = "variable";

			if (value.match(/^\d+$/)) type = "i32";
			else if (value.match(/^\d+i64$/)) type = "i64";
			else if (value.match(/^\d*\.\d+$/)) type = "f64";
			else if (value.match(/^"[^"]*"$/)) type = "String";
			else if (value.match(/^vec!/)) type = "Vec";
			else if (value.match(/^HashMap::new/)) type = "HashMap";

			variables.push({ name, type, line: i + 1 });
		}

		// Match function definitions
		const fnMatches = line.matchAll(/fn\s+(\w+)\s*\(/g);
		for (const match of fnMatches) {
			const name = match[1];
			if (name !== "main") {
				variables.push({ name, type: "function", line: i + 1 });
			}
		}

		// Match struct definitions
		const structMatches = line.matchAll(/struct\s+(\w+)/g);
		for (const match of structMatches) {
			const name = match[1];
			variables.push({ name, type: "struct", line: i + 1 });
		}
	}

	return variables;
}

// Helper function to suggest related functions for Rust variable types
function getRustRelatedFunctions(variableName: string, variableType: string) {
	const suggestions = [];

	// println! for all variables
	suggestions.push({
		label: `println!("{}", ${variableName})`,
		insertText: `println!("{}", ${variableName});`,
		documentation: `Print ${variableName} (${variableType})`,
	});

	// String operations
	if (variableType === "String" || variableType === "&str") {
		suggestions.push(
			{
				label: `${variableName}.len()`,
				insertText: `${variableName}.len()`,
				documentation: `Get length of ${variableName}`,
			},
			{
				label: `${variableName}.to_uppercase()`,
				insertText: `${variableName}.to_uppercase()`,
				documentation: `Convert ${variableName} to uppercase`,
			},
			{
				label: `${variableName}.to_lowercase()`,
				insertText: `${variableName}.to_lowercase()`,
				documentation: `Convert ${variableName} to lowercase`,
			},
			{
				label: `${variableName}.split()`,
				insertText: `${variableName}.split("\${1:pattern}")`,
				documentation: `Split ${variableName}`,
			},
		);
	}

	// Vec operations
	if (variableType.includes("Vec") || variableType === "Vec") {
		suggestions.push(
			{
				label: `${variableName}.push()`,
				insertText: `${variableName}.push(\${1:value});`,
				documentation: `Push to ${variableName}`,
			},
			{
				label: `${variableName}.pop()`,
				insertText: `${variableName}.pop()`,
				documentation: `Pop from ${variableName}`,
			},
			{
				label: `${variableName}.len()`,
				insertText: `${variableName}.len()`,
				documentation: `Get length of ${variableName}`,
			},
			{
				label: `${variableName}.sort()`,
				insertText: `${variableName}.sort();`,
				documentation: `Sort ${variableName}`,
			},
		);
	}

	// HashMap operations
	if (variableType.includes("HashMap") || variableType === "HashMap") {
		suggestions.push(
			{
				label: `${variableName}.insert()`,
				insertText: `${variableName}.insert(\${1:key}, \${2:value});`,
				documentation: `Insert into ${variableName}`,
			},
			{
				label: `${variableName}.get()`,
				insertText: `${variableName}.get(&\${1:key})`,
				documentation: `Get from ${variableName}`,
			},
			{
				label: `${variableName}.remove()`,
				insertText: `${variableName}.remove(&\${1:key})`,
				documentation: `Remove from ${variableName}`,
			},
		);
	}

	// Numeric operations
	if (
		variableType === "i32" ||
		variableType === "i64" ||
		variableType === "f32" ||
		variableType === "f64"
	) {
		suggestions.push(
			{
				label: `${variableName}.abs()`,
				insertText: `${variableName}.abs()`,
				documentation: `Get absolute value of ${variableName}`,
			},
			{
				label: `${variableName}.to_string()`,
				insertText: `${variableName}.to_string()`,
				documentation: `Convert ${variableName} to string`,
			},
		);
	}

	return suggestions;
}

// Helper function to get method suggestions for Rust types
function getRustMethods(variableType: string) {
	const methods: Array<{
		label: string;
		insertText: string;
		documentation: string;
	}> = [];

	// String methods
	if (variableType === "String" || variableType === "&str") {
		methods.push(
			{
				label: "len",
				insertText: "len()",
				documentation: "Returns the length of the string",
			},
			{
				label: "is_empty",
				insertText: "is_empty()",
				documentation: "Checks if the string is empty",
			},
			{
				label: "push",
				insertText: "push(${1:ch})",
				documentation: "Appends a character",
			},
			{
				label: "push_str",
				insertText: "push_str(${1:string})",
				documentation: "Appends a string slice",
			},
			{
				label: "pop",
				insertText: "pop()",
				documentation: "Removes and returns the last character",
			},
			{
				label: "clear",
				insertText: "clear()",
				documentation: "Truncates string, removing all contents",
			},
			{
				label: "split",
				insertText: "split(${1:pattern})",
				documentation: "Splits string by pattern",
			},
			{
				label: "chars",
				insertText: "chars()",
				documentation: "Returns iterator over characters",
			},
			{
				label: "trim",
				insertText: "trim()",
				documentation:
					"Returns string with leading/trailing whitespace removed",
			},
			{
				label: "to_uppercase",
				insertText: "to_uppercase()",
				documentation: "Returns uppercase equivalent",
			},
			{
				label: "to_lowercase",
				insertText: "to_lowercase()",
				documentation: "Returns lowercase equivalent",
			},
			{
				label: "contains",
				insertText: "contains(${1:pattern})",
				documentation: "Checks if string contains pattern",
			},
			{
				label: "starts_with",
				insertText: "starts_with(${1:pattern})",
				documentation: "Checks if string starts with pattern",
			},
			{
				label: "ends_with",
				insertText: "ends_with(${1:pattern})",
				documentation: "Checks if string ends with pattern",
			},
		);
	}

	// Vec methods
	if (variableType.includes("Vec") || variableType === "Vec") {
		methods.push(
			{
				label: "push",
				insertText: "push(${1:value})",
				documentation: "Appends element to back of vector",
			},
			{
				label: "pop",
				insertText: "pop()",
				documentation: "Removes and returns last element",
			},
			{
				label: "len",
				insertText: "len()",
				documentation: "Returns number of elements",
			},
			{
				label: "is_empty",
				insertText: "is_empty()",
				documentation: "Checks if vector is empty",
			},
			{
				label: "clear",
				insertText: "clear()",
				documentation: "Clears vector, removing all values",
			},
			{
				label: "insert",
				insertText: "insert(${1:index}, ${2:element})",
				documentation: "Inserts element at position",
			},
			{
				label: "remove",
				insertText: "remove(${1:index})",
				documentation: "Removes and returns element at position",
			},
			{
				label: "get",
				insertText: "get(${1:index})",
				documentation: "Returns reference to element or None",
			},
			{
				label: "first",
				insertText: "first()",
				documentation: "Returns first element or None",
			},
			{
				label: "last",
				insertText: "last()",
				documentation: "Returns last element or None",
			},
			{
				label: "sort",
				insertText: "sort()",
				documentation: "Sorts vector in-place",
			},
			{
				label: "reverse",
				insertText: "reverse()",
				documentation: "Reverses order of elements",
			},
			{
				label: "contains",
				insertText: "contains(&${1:x})",
				documentation: "Checks if vector contains element",
			},
			{
				label: "iter",
				insertText: "iter()",
				documentation: "Returns iterator over elements",
			},
		);
	}

	// HashMap methods
	if (variableType.includes("HashMap") || variableType === "HashMap") {
		methods.push(
			{
				label: "insert",
				insertText: "insert(${1:key}, ${2:value})",
				documentation: "Inserts key-value pair",
			},
			{
				label: "get",
				insertText: "get(&${1:key})",
				documentation: "Returns reference to value or None",
			},
			{
				label: "remove",
				insertText: "remove(&${1:key})",
				documentation: "Removes key-value pair",
			},
			{
				label: "contains_key",
				insertText: "contains_key(&${1:key})",
				documentation: "Checks if map contains key",
			},
			{
				label: "len",
				insertText: "len()",
				documentation: "Returns number of elements",
			},
			{
				label: "is_empty",
				insertText: "is_empty()",
				documentation: "Checks if map is empty",
			},
			{
				label: "clear",
				insertText: "clear()",
				documentation: "Clears map, removing all key-value pairs",
			},
			{
				label: "keys",
				insertText: "keys()",
				documentation: "Returns iterator over keys",
			},
			{
				label: "values",
				insertText: "values()",
				documentation: "Returns iterator over values",
			},
			{
				label: "iter",
				insertText: "iter()",
				documentation: "Returns iterator over key-value pairs",
			},
		);
	}

	return methods;
}

monaco.languages.registerCompletionItemProvider("rust", {
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
			const extractedVariables = extractRustVariables(code);

			// Find the variable type
			const variable = extractedVariables.find((v) => v.name === variableName);
			if (variable) {
				const methods = getRustMethods(variable.type);
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
		const extractedVariables = extractRustVariables(code);

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
				const relatedFunctions = getRustRelatedFunctions(
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
