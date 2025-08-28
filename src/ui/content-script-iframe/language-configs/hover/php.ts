import * as monaco from "monaco-editor";

monaco.languages.registerHoverProvider("php", {
	provideHover: (model, position) => {
		const word = model.getWordAtPosition(position);
		if (!word) return;

		const hoverInfo: Record<string, string> = {
			echo: "Output one or more strings",
			print: "Output a string",
			var_dump: "Display structured information about variables",
			isset: "Determine if a variable is declared and is different than NULL",
			array: "Create an array",
			$_GET: "Associative array containing HTTP GET variables",
			$_POST: "Associative array containing HTTP POST variables",
			$_SESSION: "Associative array containing session variables",
			function: "Keyword to define a function",
			class: "Keyword to define a class",
			foreach: "Loop construct for iterating over arrays",
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
