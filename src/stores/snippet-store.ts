import { defineStore } from "pinia";
import { storage } from "../services/storage";

const SNIPPETS_STORAGE_KEY = "xodeforces-snippets";

export interface LanguageSnippets {
	[language: string]: string;
}

export const useSnippetStore = defineStore("snippet-store", {
	state: () => ({
		snippets: {} as LanguageSnippets,
	}),

	actions: {
		loadSnippets() {
			const stored = storage.local.get(SNIPPETS_STORAGE_KEY);
			if (stored) {
				try {
					this.snippets = JSON.parse(stored);
				} catch (error) {
					console.error("Failed to parse stored snippets:", error);
					this.snippets = {};
				}
			}
		},

		saveSnippet(language: string, code: string) {
			this.snippets[language] = code;
			this.persistSnippets();
		},

		getSnippet(language: string): string | null {
			return this.snippets[language] || null;
		},

		deleteSnippet(language: string) {
			delete this.snippets[language];
			this.persistSnippets();
		},

		getAllSnippets(): LanguageSnippets {
			return { ...this.snippets };
		},

		importSnippets(snippets: LanguageSnippets) {
			this.snippets = { ...this.snippets, ...snippets };
			this.persistSnippets();
		},

		clearAllSnippets() {
			this.snippets = {};
			this.persistSnippets();
		},

		persistSnippets() {
			storage.local.set(SNIPPETS_STORAGE_KEY, JSON.stringify(this.snippets));
		},
	},
});
