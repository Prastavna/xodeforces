import * as monaco from "monaco-editor";

monaco.languages.registerHoverProvider("python", {
	provideHover: (model, position) => {
		const word = model.getWordAtPosition(position);
		if (!word) return;

		const hoverInfo: Record<string, string> = {
			print: "Built-in function that prints values to stdout",
			len: "Built-in function that returns the length of an object",
			range: "Built-in function that generates a sequence of numbers",
			input: "Built-in function that reads a string from stdin",
			int: "Built-in function that converts a value to integer",
			str: "Built-in function that converts a value to string",
			float: "Built-in function that converts a value to float",
			def: "Keyword used to define a function",
			class: "Keyword used to define a class",
			if: "Conditional statement keyword",
			for: "Loop statement keyword",
			while: "Loop statement keyword",
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
