import type * as monaco from "monaco-editor";
import { defineStore } from "pinia";
import { languages } from "../constants/languages";
import { storage } from "../services/storage";

const EDITOR_CONFIG_STORAGE_KEY = "xodeforces-editor-config";

interface EditorConfig {
	language: string;
	theme: string;
	tabSize: number;
	insertSpaces: boolean;
}

const getEditorConfig = (): EditorConfig => {
	const stored = storage.local.get(EDITOR_CONFIG_STORAGE_KEY);
	if (stored) {
		try {
			const config = JSON.parse(stored);
			return {
				language: config.language || "javascript",
				theme: config.theme || "vs-dark",
				tabSize: config.tabSize || 4,
				insertSpaces: config.insertSpaces !== false,
			};
		} catch (error) {
			console.error("Failed to parse stored editor config:", error);
		}
	}

	// Migration: try to get from old individual keys
	const language = storage.local.get("language");
	const theme = storage.local.get("theme");
	const tabSize = storage.local.get("tabSize");
	const insertSpaces = storage.local.get("insertSpaces");

	if (language || theme || tabSize || insertSpaces) {
		const config = {
			language: language || "javascript",
			theme: theme || "vs-dark",
			tabSize: Number(tabSize) || 4,
			insertSpaces: insertSpaces !== "false",
		};

		// Save to new format and remove old keys
		storage.local.set(EDITOR_CONFIG_STORAGE_KEY, JSON.stringify(config));
		storage.local.remove("language");
		storage.local.remove("theme");
		storage.local.remove("tabSize");
		storage.local.remove("insertSpaces");

		return config;
	}

	// Default config
	return {
		language: "javascript",
		theme: "vs-dark",
		tabSize: 4,
		insertSpaces: true,
	};
};

const getSampleCode = () => {
	const config = getEditorConfig();
	const { language } = config;

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
	state: () => {
		const config = getEditorConfig();
		return {
			language: config.language,
			theme: config.theme,
			code: storage.session.get("code") || getSampleCode(),
			tabSize: config.tabSize,
			insertSpaces: config.insertSpaces,
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
				tabSize: config.tabSize,
				insertSpaces: config.insertSpaces,
				theme: config.theme,
			} satisfies monaco.editor.IStandaloneEditorConstructionOptions,
		};
	},
	actions: {
		persistConfig() {
			const config: EditorConfig = {
				language: this.language,
				theme: this.theme,
				tabSize: this.tabSize,
				insertSpaces: this.insertSpaces,
			};
			storage.local.set(EDITOR_CONFIG_STORAGE_KEY, JSON.stringify(config));
		},

		changeLanguage(language: string) {
			this.language = language;
			this.persistConfig();

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
		updateEditorConfig({
			tabSize,
			indentationType,
			theme,
		}: {
			tabSize: number;
			indentationType: "spaces" | "tabs";
			theme: string;
		}) {
			this.theme = theme;
			this.tabSize = tabSize;
			this.insertSpaces = indentationType === "spaces";
			this.editorOptions.tabSize = tabSize;
			this.editorOptions.insertSpaces = this.insertSpaces;

			this.persistConfig();

			if (this.editorInstance) {
				this.editorInstance.updateOptions({
					tabSize,
					insertSpaces: this.insertSpaces,
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
