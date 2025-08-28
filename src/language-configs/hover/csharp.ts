import * as monaco from "monaco-editor";

monaco.languages.registerHoverProvider("csharp", {
	provideHover: (model, position) => {
		const word = model.getWordAtPosition(position);
		if (!word) return;

		const hoverInfo: Record<string, string> = {
			Console: "Represents the standard input, output, and error streams",
			WriteLine: "Writes the specified data followed by a line terminator",
			ReadLine:
				"Reads the next line of characters from the standard input stream",
			string: "Represents text as a sequence of UTF-16 code units",
			int: "32-bit signed integer data type",
			bool: "Boolean data type (true or false)",
			var: "Implicitly typed local variable",
			List: "Generic list collection",
			using: "Directive to include namespace or dispose pattern",
			namespace: "Keyword to declare a scope for types",
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
