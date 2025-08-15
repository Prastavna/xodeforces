import * as monaco from "monaco-editor";

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
