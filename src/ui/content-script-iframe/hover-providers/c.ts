import * as monaco from "monaco-editor";

monaco.languages.registerHoverProvider("c", {
	provideHover: (model, position) => {
		const word = model.getWordAtPosition(position);
		if (!word) return;

		const hoverInfo: Record<string, string> = {
			printf: "Formatted output function - prints to stdout",
			scanf: "Formatted input function - reads from stdin",
			malloc: "Memory allocation function - allocates memory dynamically",
			free: "Memory deallocation function - frees allocated memory",
			strlen: "String length function - returns length of string",
			strcpy: "String copy function - copies one string to another",
			strcmp: "String compare function - compares two strings",
			FILE: "File pointer type for file operations",
			fopen: "File open function - opens a file",
			fclose: "File close function - closes a file",
			fprintf: "Formatted file output function",
			int: "Integer data type",
			char: "Character data type",
			float: "Floating point data type",
			double: "Double precision floating point data type",
		};

		if (hoverInfo[word.word]) {
			return {
				range: new monaco.Range(
					position.lineNumber,
					word.startColumn,
					position.lineNumber,
					word.endColumn,
				),
				contents: [
					{ value: `**${word.word}**` },
					{ value: hoverInfo[word.word] },
				],
			};
		}
	},
});
