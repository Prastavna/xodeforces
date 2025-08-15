import * as monaco from "monaco-editor";

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
