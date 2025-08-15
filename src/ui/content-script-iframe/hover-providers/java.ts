import * as monaco from "monaco-editor";

monaco.languages.registerHoverProvider("java", {
	provideHover: (model, position) => {
		const word = model.getWordAtPosition(position);
		if (!word) return;

		const hoverInfo: Record<string, string> = {
			System:
				"Final class that contains several useful class fields and methods",
			String: "Class representing character strings",
			ArrayList: "Resizable array implementation of the List interface",
			Scanner: "Simple text scanner for parsing primitive types and strings",
			public: "Access modifier - accessible from anywhere",
			private: "Access modifier - accessible only within the same class",
			static: "Belongs to the class rather than instance",
			void: "Method returns no value",
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
