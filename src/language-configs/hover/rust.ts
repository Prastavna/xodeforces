import * as monaco from "monaco-editor";

monaco.languages.registerHoverProvider("rust", {
	provideHover: (model, position) => {
		const word = model.getWordAtPosition(position);
		if (!word) return;

		const hoverInfo: Record<string, string> = {
			"println!": "Macro that prints text to stdout with a newline",
			"print!": "Macro that prints text to stdout without a newline",
			fn: "Keyword to define a function",
			let: "Keyword to create variable bindings",
			mut: "Keyword to make variable bindings mutable",
			struct: "Keyword to define a struct",
			enum: "Keyword to define an enumeration",
			impl: "Keyword to define implementations for structs/enums",
			match: "Control flow operator for pattern matching",
			Vec: "Growable array type provided by the standard library",
			String: "UTF-8 encoded, growable string",
			Option: "Enum representing optional values",
			Result: "Enum for recoverable errors",
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
