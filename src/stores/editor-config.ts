import * as monaco from "monaco-editor";
import { defineStore } from "pinia";
import { languages } from "../constants/languages";
import { storage } from "../services/storage";

const getSampleCode = () => {
	const language = storage.local.get("language");
	if (!language) {
		return languages.javascript.sample;
	}

	// Try to get custom snippet first
	const snippetsData = storage.local.get("xodeforces-snippets");
	if (snippetsData) {
		try {
			const snippets = JSON.parse(snippetsData);
			if (snippets[language]) {
				return snippets[language];
			}
		} catch (error) {
			console.error("Failed to parse snippets:", error);
		}
	}

	// Fallback to default sample
	const sampleCode = languages[language as keyof typeof languages].sample;
	if (!sampleCode) {
		return "";
	}
	return sampleCode;
};

export const useEditorConfig = defineStore("editor-config", {
	state: () => ({
		language: storage.local.get("language") || "javascript",
		theme: storage.local.get("theme") || "vs-dark",
		code: storage.session.get("code") || getSampleCode(),
		tabSize: Number(storage.local.get("tabSize")) || 4,
		insertSpaces: storage.local.get("insertSpaces") !== "false",
		editorInstance: null as monaco.editor.IStandaloneCodeEditor | null,
		editorOptions: {
			automaticLayout: true,
			minimap: { enabled: true },
			scrollBeyondLastLine: false,
			fontSize: 14,
			lineNumbers: "on",
			roundedSelection: false,
			scrollbar: {
				vertical: "visible",
				horizontal: "visible",
			},
			// IntelliSense and autocompletion settings
			suggestOnTriggerCharacters: true,
			acceptSuggestionOnEnter: "on",
			tabCompletion: "on",
			wordBasedSuggestions: "allDocuments",
			quickSuggestions: {
				other: true,
				comments: true,
				strings: true,
			},
			parameterHints: {
				enabled: true,
				cycle: true,
			},
			hover: {
				enabled: true,
				delay: 300,
			},
			formatOnPaste: true,
			formatOnType: true,
			tabSize: Number(storage.local.get("tabSize")) || 4,
			insertSpaces: storage.local.get("insertSpaces") !== "false",
		} satisfies monaco.editor.IStandaloneEditorConstructionOptions,
	}),
	actions: {
		changeLanguage(language: string) {
			this.language = language;
			storage.local.set("language", language);

			// Try to get custom snippet first
			const snippetsData = storage.local.get("xodeforces-snippets");
			if (snippetsData) {
				try {
					const snippets = JSON.parse(snippetsData);
					if (snippets[language]) {
						this.code = snippets[language];
						return;
					}
				} catch (error) {
					console.error("Failed to parse snippets:", error);
				}
			}

			// Fallback to default sample
			const sampleCode = languages[language as keyof typeof languages].sample;
			this.code = sampleCode || "";
		},
		changeTheme(theme: string) {
			this.theme = theme;
			storage.local.set("theme", theme);
		},
		setEditorInstance(editorInstance: monaco.editor.IStandaloneCodeEditor) {
			this.editorInstance = editorInstance;
		},
		onCodeChange(code: string) {
			this.code = code;
			storage.session.set("code", code);
		},
		formatCode() {
			if (!this.editorInstance) return;

			// Try Monaco's built-in formatter first
			const formatAction = this.editorInstance.getAction(
				"editor.action.formatDocument",
			);
			if (formatAction) {
				formatAction.run();
				return;
			}
		},
		resetCode() {
			this.code = "";
			storage.session.set("code", "");
		},
		updateEditorConfig(tabSize: number, insertSpaces: boolean) {
			this.tabSize = tabSize;
			this.insertSpaces = insertSpaces;
			this.editorOptions.tabSize = tabSize;
			this.editorOptions.insertSpaces = insertSpaces;

			storage.local.set("tabSize", tabSize.toString());
			storage.local.set("insertSpaces", insertSpaces.toString());

			if (this.editorInstance) {
				this.editorInstance.updateOptions({
					tabSize,
					insertSpaces,
				});
			}
		},
		submitCode() {
			const extension =
				languages[this.language as keyof typeof languages].extension;
			const fullFilename = "code" + extension;

			const blob = new Blob([this.code], { type: "text/plain" });

			const file = new File([blob], fullFilename, { type: "text/plain" });

			self.parent.postMessage(
				{
					type: "attachFileToInput",
					file,
				},
				"*",
			);
		},
	},
});
