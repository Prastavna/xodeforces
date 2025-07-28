import { defineStore } from "pinia";
import { languages } from "../constants/languages";
import * as monaco from 'monaco-editor'
import { storage } from "../services/storage";

const getSampleCode = () => {
    const language = storage.local.get("language");
    if (!language) {
        return languages.javascript.sample;
    }
    const sampleCode = languages[language as keyof typeof languages].sample;
    if (!sampleCode) {
        return ""
    }
    return sampleCode;
}

export const useEditorConfig = defineStore("editor-config", {
    state: () => ({
        language: storage.local.get("language") || "javascript",
        theme: storage.local.get("theme") || "vs-dark",
        code: storage.session.get("code") || getSampleCode(),
        editorInstance: null as monaco.editor.IStandaloneCodeEditor | null,
        editorOptions: {
            automaticLayout: true,
            minimap: { enabled: true },
            scrollBeyondLastLine: false,
            fontSize: 14,
            lineNumbers: 'on',
            roundedSelection: false,
            scrollbar: {
                vertical: 'visible',
                horizontal: 'visible'
            },
            // IntelliSense and autocompletion settings
            suggestOnTriggerCharacters: true,
            acceptSuggestionOnEnter: 'on',
            tabCompletion: 'on',
            wordBasedSuggestions: "allDocuments",
            quickSuggestions: {
                other: true,
                comments: true,
                strings: true
            },
            parameterHints: {
                enabled: true,
                cycle: true
            },
            hover: {
                enabled: true,
                delay: 300
            },
            formatOnPaste: true,
            formatOnType: true,
            tabSize: 4,
            insertSpaces: true
        } satisfies monaco.editor.IStandaloneEditorConstructionOptions
    }),
    actions: {
        changeLanguage(language: string) {
            this.language = language;
            storage.local.set("language", language);
            this.code = getSampleCode();
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
            if (this.editorInstance) {
                this.editorInstance.getAction('editor.action.formatDocument')?.run()
            }
        },
        resetCode() {
            this.code = "";
            storage.session.set("code", "");
        },
        submitCode() {
            const extension = languages[this.language as keyof typeof languages].extension;
            const fullFilename = "code" + extension;

            const blob = new Blob([this.code], { type: 'text/plain' });

            const file = new File([blob], fullFilename, { type: 'text/plain' });

            self.parent.postMessage({
                type: "attachFileToInput",
                file
            }, "*");
        }
    },
});