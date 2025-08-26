import * as monaco from "monaco-editor";

// Helper function to extract tables and columns from SQL code
function extractSQLEntities(code: string) {
	const entities: Array<{ name: string; type: string; line: number }> = [];
	const lines = code.split("\n");

	for (let i = 0; i < lines.length; i++) {
		const line = lines[i].trim().toLowerCase();

		// Match table names in CREATE TABLE statements
		const createMatches = line.matchAll(/create\s+table\s+(\w+)/g);
		for (const match of createMatches) {
			const name = match[1];
			entities.push({ name, type: "table", line: i + 1 });
		}

		// Match table names in FROM clauses
		const fromMatches = line.matchAll(/from\s+(\w+)/g);
		for (const match of fromMatches) {
			const name = match[1];
			entities.push({ name, type: "table", line: i + 1 });
		}

		// Match table names in JOIN clauses
		const joinMatches = line.matchAll(/join\s+(\w+)/g);
		for (const match of joinMatches) {
			const name = match[1];
			entities.push({ name, type: "table", line: i + 1 });
		}

		// Match column names in SELECT statements
		const selectMatches = line.matchAll(/select\s+([^from]+)/g);
		for (const match of selectMatches) {
			const columns = match[1];
			const columnNames = columns
				.split(",")
				.map((col) => col.trim().replace(/.*\./, ""));
			columnNames.forEach((colName) => {
				if (colName && colName !== "*" && colName.match(/^\w+$/)) {
					entities.push({ name: colName, type: "column", line: i + 1 });
				}
			});
		}

		// Match stored procedures and functions
		const procMatches = line.matchAll(/create\s+(procedure|function)\s+(\w+)/g);
		for (const match of procMatches) {
			const type = match[1];
			const name = match[2];
			entities.push({ name, type, line: i + 1 });
		}
	}

	// Remove duplicates
	const uniqueEntities = entities.filter(
		(entity, index, self) =>
			index ===
			self.findIndex((e) => e.name === entity.name && e.type === entity.type),
	);

	return uniqueEntities;
}

// Helper function to suggest related SQL operations
function getSQLRelatedFunctions(entityName: string, entityType: string) {
	const suggestions = [];

	if (entityType === "table") {
		suggestions.push(
			{
				label: `SELECT * FROM ${entityName}`,
				insertText: `SELECT * FROM ${entityName}`,
				documentation: `Select all from ${entityName} table`,
			},
			{
				label: `SELECT COUNT(*) FROM ${entityName}`,
				insertText: `SELECT COUNT(*) FROM ${entityName}`,
				documentation: `Count rows in ${entityName} table`,
			},
			{
				label: `INSERT INTO ${entityName}`,
				insertText: `INSERT INTO ${entityName} (\${1:columns}) VALUES (\${2:values})`,
				documentation: `Insert into ${entityName} table`,
			},
			{
				label: `UPDATE ${entityName} SET`,
				insertText: `UPDATE ${entityName} SET \${1:column} = \${2:value} WHERE \${3:condition}`,
				documentation: `Update ${entityName} table`,
			},
			{
				label: `DELETE FROM ${entityName}`,
				insertText: `DELETE FROM ${entityName} WHERE \${1:condition}`,
				documentation: `Delete from ${entityName} table`,
			},
			{
				label: `DROP TABLE ${entityName}`,
				insertText: `DROP TABLE ${entityName}`,
				documentation: `Drop ${entityName} table`,
			},
		);
	}

	if (entityType === "column") {
		suggestions.push(
			{
				label: `ORDER BY ${entityName}`,
				insertText: `ORDER BY ${entityName}`,
				documentation: `Sort by ${entityName} column`,
			},
			{
				label: `GROUP BY ${entityName}`,
				insertText: `GROUP BY ${entityName}`,
				documentation: `Group by ${entityName} column`,
			},
			{
				label: `WHERE ${entityName} =`,
				insertText: `WHERE ${entityName} = \${1:value}`,
				documentation: `Filter by ${entityName} column`,
			},
			{
				label: `COUNT(${entityName})`,
				insertText: `COUNT(${entityName})`,
				documentation: `Count ${entityName} column`,
			},
			{
				label: `MAX(${entityName})`,
				insertText: `MAX(${entityName})`,
				documentation: `Maximum value of ${entityName}`,
			},
			{
				label: `MIN(${entityName})`,
				insertText: `MIN(${entityName})`,
				documentation: `Minimum value of ${entityName}`,
			},
			{
				label: `AVG(${entityName})`,
				insertText: `AVG(${entityName})`,
				documentation: `Average value of ${entityName}`,
			},
			{
				label: `SUM(${entityName})`,
				insertText: `SUM(${entityName})`,
				documentation: `Sum of ${entityName}`,
			},
		);
	}

	if (entityType === "procedure" || entityType === "function") {
		suggestions.push(
			{
				label: `CALL ${entityName}()`,
				insertText: `CALL ${entityName}(\${1:parameters})`,
				documentation: `Execute ${entityName} ${entityType}`,
			},
			{
				label: `DROP ${entityType.toUpperCase()} ${entityName}`,
				insertText: `DROP ${entityType.toUpperCase()} ${entityName}`,
				documentation: `Drop ${entityName} ${entityType}`,
			},
		);
	}

	return suggestions;
}

monaco.languages.registerCompletionItemProvider("sql", {
	provideCompletionItems: (model, position) => {
		const word = model.getWordUntilPosition(position);
		const range = {
			startLineNumber: position.lineNumber,
			endLineNumber: position.lineNumber,
			startColumn: word.startColumn,
			endColumn: word.endColumn,
		};

		// Extract entities from the current code
		const code = model.getValue();
		const extractedEntities = extractSQLEntities(code);

		// Create suggestions for extracted entities
		const entitySuggestions = extractedEntities.map((entity) => ({
			label: entity.name,
			kind:
				entity.type === "table"
					? monaco.languages.CompletionItemKind.Class
					: entity.type === "column"
						? monaco.languages.CompletionItemKind.Field
						: entity.type === "procedure" || entity.type === "function"
							? monaco.languages.CompletionItemKind.Function
							: monaco.languages.CompletionItemKind.Variable,
			insertText: entity.name,
			insertTextRules:
				monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
			documentation: `${entity.type} (found at line ${entity.line})`,
			range: range,
		}));

		// Create suggestions for entity-related functions
		const functionSuggestions: any[] = [];
		extractedEntities.forEach((entity) => {
			const relatedFunctions = getSQLRelatedFunctions(entity.name, entity.type);
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
			...entitySuggestions,
			...functionSuggestions,
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
			// More JOIN types
			{
				label: "RIGHT JOIN",
				kind: monaco.languages.CompletionItemKind.Keyword,
				insertText:
					"RIGHT JOIN ${1:table2} ON ${2:table1.column} = ${3:table2.column}",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Right join tables",
				range: range,
			},
			{
				label: "INNER JOIN",
				kind: monaco.languages.CompletionItemKind.Keyword,
				insertText:
					"INNER JOIN ${1:table2} ON ${2:table1.column} = ${3:table2.column}",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Inner join tables",
				range: range,
			},
			{
				label: "FULL OUTER JOIN",
				kind: monaco.languages.CompletionItemKind.Keyword,
				insertText:
					"FULL OUTER JOIN ${1:table2} ON ${2:table1.column} = ${3:table2.column}",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Full outer join tables",
				range: range,
			},
			{
				label: "CROSS JOIN",
				kind: monaco.languages.CompletionItemKind.Keyword,
				insertText: "CROSS JOIN ${1:table2}",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Cross join tables",
				range: range,
			},
			// Aggregate functions
			{
				label: "COUNT",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "COUNT(${1:column})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Count rows",
				range: range,
			},
			{
				label: "SUM",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "SUM(${1:column})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Sum values",
				range: range,
			},
			{
				label: "AVG",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "AVG(${1:column})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Average value",
				range: range,
			},
			{
				label: "MIN",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "MIN(${1:column})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Minimum value",
				range: range,
			},
			{
				label: "MAX",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "MAX(${1:column})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Maximum value",
				range: range,
			},
			// String functions
			{
				label: "CONCAT",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "CONCAT(${1:string1}, ${2:string2})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Concatenate strings",
				range: range,
			},
			{
				label: "SUBSTRING",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "SUBSTRING(${1:string}, ${2:start}, ${3:length})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Extract substring",
				range: range,
			},
			{
				label: "LENGTH",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "LENGTH(${1:string})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "String length",
				range: range,
			},
			{
				label: "UPPER",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "UPPER(${1:string})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Convert to uppercase",
				range: range,
			},
			{
				label: "LOWER",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "LOWER(${1:string})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Convert to lowercase",
				range: range,
			},
			{
				label: "TRIM",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "TRIM(${1:string})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Remove leading/trailing spaces",
				range: range,
			},
			{
				label: "REPLACE",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "REPLACE(${1:string}, ${2:old_string}, ${3:new_string})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Replace substring",
				range: range,
			},
			// Date functions
			{
				label: "NOW",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "NOW()",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Current date and time",
				range: range,
			},
			{
				label: "CURDATE",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "CURDATE()",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Current date",
				range: range,
			},
			{
				label: "CURTIME",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "CURTIME()",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Current time",
				range: range,
			},
			{
				label: "DATE_FORMAT",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "DATE_FORMAT(${1:date}, '${2:%Y-%m-%d}')",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Format date",
				range: range,
			},
			{
				label: "DATEDIFF",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "DATEDIFF(${1:date1}, ${2:date2})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Difference between dates",
				range: range,
			},
			{
				label: "DATE_ADD",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "DATE_ADD(${1:date}, INTERVAL ${2:value} ${3:UNIT})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Add interval to date",
				range: range,
			},
			{
				label: "DATE_SUB",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "DATE_SUB(${1:date}, INTERVAL ${2:value} ${3:UNIT})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Subtract interval from date",
				range: range,
			},
			// Math functions
			{
				label: "ABS",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "ABS(${1:number})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Absolute value",
				range: range,
			},
			{
				label: "ROUND",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "ROUND(${1:number}, ${2:decimals})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Round number",
				range: range,
			},
			{
				label: "CEIL",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "CEIL(${1:number})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Round up to integer",
				range: range,
			},
			{
				label: "FLOOR",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "FLOOR(${1:number})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Round down to integer",
				range: range,
			},
			{
				label: "SQRT",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "SQRT(${1:number})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Square root",
				range: range,
			},
			{
				label: "POW",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "POW(${1:base}, ${2:exponent})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Power function",
				range: range,
			},
			{
				label: "RAND",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "RAND()",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Random number",
				range: range,
			},
			// More clauses
			{
				label: "HAVING",
				kind: monaco.languages.CompletionItemKind.Keyword,
				insertText: "HAVING ${1:condition}",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Filter grouped results",
				range: range,
			},
			{
				label: "LIMIT",
				kind: monaco.languages.CompletionItemKind.Keyword,
				insertText: "LIMIT ${1:count}",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Limit number of results",
				range: range,
			},
			{
				label: "OFFSET",
				kind: monaco.languages.CompletionItemKind.Keyword,
				insertText: "OFFSET ${1:count}",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Skip number of results",
				range: range,
			},
			{
				label: "DISTINCT",
				kind: monaco.languages.CompletionItemKind.Keyword,
				insertText: "DISTINCT ${1:column}",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Select unique values",
				range: range,
			},
			{
				label: "AS",
				kind: monaco.languages.CompletionItemKind.Keyword,
				insertText: "AS ${1:alias}",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Create alias",
				range: range,
			},
			// Conditional functions
			{
				label: "CASE",
				kind: monaco.languages.CompletionItemKind.Keyword,
				insertText:
					"CASE\n    WHEN ${1:condition} THEN ${2:result}\n    WHEN ${3:condition} THEN ${4:result}\n    ELSE ${5:default_result}\nEND",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Conditional logic",
				range: range,
			},
			{
				label: "IF",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "IF(${1:condition}, ${2:true_value}, ${3:false_value})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Conditional expression",
				range: range,
			},
			{
				label: "COALESCE",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "COALESCE(${1:value1}, ${2:value2}, ${3:default})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Return first non-null value",
				range: range,
			},
			{
				label: "ISNULL",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "ISNULL(${1:expression}, ${2:replacement})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Replace null with value",
				range: range,
			},
			// Window functions
			{
				label: "ROW_NUMBER",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "ROW_NUMBER() OVER (${1:ORDER BY column})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Assign row numbers",
				range: range,
			},
			{
				label: "RANK",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "RANK() OVER (${1:ORDER BY column})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Rank rows",
				range: range,
			},
			{
				label: "DENSE_RANK",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "DENSE_RANK() OVER (${1:ORDER BY column})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Dense rank rows",
				range: range,
			},
			// Subqueries
			{
				label: "EXISTS",
				kind: monaco.languages.CompletionItemKind.Keyword,
				insertText: "EXISTS (${1:subquery})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Check if subquery returns rows",
				range: range,
			},
			{
				label: "NOT EXISTS",
				kind: monaco.languages.CompletionItemKind.Keyword,
				insertText: "NOT EXISTS (${1:subquery})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Check if subquery returns no rows",
				range: range,
			},
			{
				label: "IN",
				kind: monaco.languages.CompletionItemKind.Keyword,
				insertText: "IN (${1:values})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Check if value is in list",
				range: range,
			},
			{
				label: "NOT IN",
				kind: monaco.languages.CompletionItemKind.Keyword,
				insertText: "NOT IN (${1:values})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Check if value is not in list",
				range: range,
			},
			// More DDL statements
			{
				label: "CREATE INDEX",
				kind: monaco.languages.CompletionItemKind.Keyword,
				insertText:
					"CREATE INDEX ${1:index_name} ON ${2:table_name} (${3:column})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Create index",
				range: range,
			},
			{
				label: "DROP INDEX",
				kind: monaco.languages.CompletionItemKind.Keyword,
				insertText: "DROP INDEX ${1:index_name}",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Drop index",
				range: range,
			},
			{
				label: "CREATE VIEW",
				kind: monaco.languages.CompletionItemKind.Keyword,
				insertText: "CREATE VIEW ${1:view_name} AS\n${2:SELECT statement}",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Create view",
				range: range,
			},
			{
				label: "DROP VIEW",
				kind: monaco.languages.CompletionItemKind.Keyword,
				insertText: "DROP VIEW ${1:view_name}",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Drop view",
				range: range,
			},
			// Operators
			{
				label: "LIKE",
				kind: monaco.languages.CompletionItemKind.Keyword,
				insertText: "LIKE '${1:pattern}'",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Pattern matching",
				range: range,
			},
			{
				label: "BETWEEN",
				kind: monaco.languages.CompletionItemKind.Keyword,
				insertText: "BETWEEN ${1:value1} AND ${2:value2}",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Range check",
				range: range,
			},
			{
				label: "IS NULL",
				kind: monaco.languages.CompletionItemKind.Keyword,
				insertText: "IS NULL",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Check for null values",
				range: range,
			},
			{
				label: "IS NOT NULL",
				kind: monaco.languages.CompletionItemKind.Keyword,
				insertText: "IS NOT NULL",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Check for non-null values",
				range: range,
			},
			// Data types
			{
				label: "INT",
				kind: monaco.languages.CompletionItemKind.Keyword,
				insertText: "INT",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Integer data type",
				range: range,
			},
			{
				label: "VARCHAR",
				kind: monaco.languages.CompletionItemKind.Keyword,
				insertText: "VARCHAR(${1:255})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Variable character data type",
				range: range,
			},
			{
				label: "TEXT",
				kind: monaco.languages.CompletionItemKind.Keyword,
				insertText: "TEXT",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Text data type",
				range: range,
			},
			{
				label: "DATE",
				kind: monaco.languages.CompletionItemKind.Keyword,
				insertText: "DATE",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Date data type",
				range: range,
			},
			{
				label: "DATETIME",
				kind: monaco.languages.CompletionItemKind.Keyword,
				insertText: "DATETIME",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "DateTime data type",
				range: range,
			},
			{
				label: "TIMESTAMP",
				kind: monaco.languages.CompletionItemKind.Keyword,
				insertText: "TIMESTAMP",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Timestamp data type",
				range: range,
			},
			{
				label: "DECIMAL",
				kind: monaco.languages.CompletionItemKind.Keyword,
				insertText: "DECIMAL(${1:precision}, ${2:scale})",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Decimal data type",
				range: range,
			},
			{
				label: "BOOLEAN",
				kind: monaco.languages.CompletionItemKind.Keyword,
				insertText: "BOOLEAN",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Boolean data type",
				range: range,
			},
		];

		return { suggestions };
	},
});
