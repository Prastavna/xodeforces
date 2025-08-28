import * as monaco from "monaco-editor";

monaco.languages.registerHoverProvider("go", {
	provideHover: (model, position) => {
		const word = model.getWordAtPosition(position);
		if (!word) return;

		const hoverInfo: Record<string, string> = {
			fmt: "Package implementing formatted I/O functions",
			Println: "Formats using default formats and writes to standard output",
			Printf:
				"Formats according to a format specifier and writes to standard output",
			func: "Keyword to declare a function",
			package: "Keyword to declare a package",
			import: "Keyword to import packages",
			struct: "Keyword to define a struct type",
			interface: "Keyword to define an interface type",
			make: "Built-in function to create slices, maps, and channels",
			var: "Keyword to declare variables",
			const: "Keyword to declare constants",
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
