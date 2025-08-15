import * as monaco from "monaco-editor";

monaco.languages.registerHoverProvider("cpp", {
	provideHover: (model, position) => {
		const word = model.getWordAtPosition(position);
		if (!word) return;

		const hoverInfo: Record<string, string> = {
			std: "Standard namespace containing C++ standard library",
			cout: "Standard output stream object",
			cin: "Standard input stream object",
			endl: "Inserts newline and flushes output stream",
			vector: "Dynamic array container",
			string: "String class for handling sequences of characters",
			shared_ptr: "Smart pointer that shares ownership of an object",
			unique_ptr: "Smart pointer that owns an object exclusively",
			template: "Defines generic classes or functions",
			namespace: "Declarative region that provides scope to identifiers",
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
