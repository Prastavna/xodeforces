import { defineStore } from "pinia";
import { languages } from "../constants/languages";
import * as monaco from 'monaco-editor'

export const useEditorConfig = defineStore("editor-config", {
    state: () => ({
        language: "javascript",
        theme: "vs-dark",
        code: languages.javascript.sample,
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
            formatOnType: true
        } satisfies monaco.editor.IStandaloneEditorConstructionOptions
    }),
    actions: {
        changeLanguage(language: string) {
            this.language = language;
            this.code = languages[language as keyof typeof languages].sample;
        },
        changeTheme(theme: string) {
            this.theme = theme;
        },
        setEditorInstance(editorInstance: monaco.editor.IStandaloneCodeEditor) {
            this.editorInstance = editorInstance;
        },
        formatCode() {
            if (this.editorInstance) {
                this.editorInstance.getAction('editor.action.formatDocument')?.run()
            }
        },
        resetCode() {
            this.code = "";
        },
        submitCode() {
            if (this.editorInstance) {
                this.code = this.editorInstance.getValue()
            }

            const extension = languages[this.language as keyof typeof languages].extension;
            const fullFilename = "code" + extension;

            const blob = new Blob([this.code], { type: 'text/plain' });

            const file = new File([blob], fullFilename, { type: 'text/plain' });

            const fileInput = document.querySelector('input[name="sourceFile"]') as HTMLInputElement;

            if (!fileInput) {
                console.error('Input element with name="sourceFile" not found');
                return null;
            }

            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(file);
            fileInput.files = dataTransfer.files;

            fileInput.dispatchEvent(new Event('change', { bubbles: true }));

            console.log(`Created and attached file: ${fullFilename}`);
        }
    },
});