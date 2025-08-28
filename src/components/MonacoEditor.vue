<template>
  <div ref="editorContainer" class="monaco-editor-container"></div>
</template>

<script setup lang="ts">
import * as monaco from "monaco-editor";
import "monaco-editor/esm/vs/language/typescript/monaco.contribution";
import "monaco-editor/esm/vs/language/css/monaco.contribution";
import "monaco-editor/esm/vs/language/json/monaco.contribution";
import "monaco-editor/esm/vs/editor/contrib/find/browser/findController.js";

import editorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker";
import cssWorker from "monaco-editor/esm/vs/language/css/css.worker?worker";
import htmlWorker from "monaco-editor/esm/vs/language/html/html.worker?worker";
import jsonWorker from "monaco-editor/esm/vs/language/json/json.worker?worker";
import tsWorker from "monaco-editor/esm/vs/language/typescript/ts.worker?worker";

import "../language-configs/completions";
import "../language-configs/diagnostics";
import "../language-configs/hover";
import "../language-configs/document-formatting/";

import { nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { setupCustomThemes } from "../constants/custom-themes";
import { useEditorConfig } from "../stores/editor-config";

self.MonacoEnvironment = {
	getWorker(_, label) {
		if (label === "json") {
			return new jsonWorker();
		}
		if (label === "css" || label === "scss" || label === "less") {
			return new cssWorker();
		}
		if (label === "html" || label === "handlebars" || label === "razor") {
			return new htmlWorker();
		}
		if (label === "typescript" || label === "javascript") {
			return new tsWorker();
		}
		return new editorWorker();
	},
};

const editorConfig = useEditorConfig();

const props = defineProps({
	modelValue: {
		type: String,
		default: "",
	},
	language: {
		type: String,
		default: "",
	},
	theme: {
		type: String,
		default: "",
	},
	options: {
		type: Object,
		default: () => ({}),
	},
	height: {
		type: [String, Number],
		default: "400px",
	},
	width: {
		type: [String, Number],
		default: "100%",
	},
});

const emit = defineEmits(["update:modelValue", "change", "mounted"]);

const editorContainer = ref<HTMLElement | null>(null);
let editor: monaco.editor.IStandaloneCodeEditor | null = null;

// Default editor options with IntelliSense features enabled
const defaultOptions: monaco.editor.IStandaloneEditorConstructionOptions = {
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
	},
	hover: {
		enabled: true,
	},
	// Code formatting
	formatOnPaste: true,
	formatOnType: true,
	// Error detection
	// validate: true
};

const initMonaco = async () => {
	if (!editorContainer.value) return;

	// Setup custom themes
	await setupCustomThemes();

	// Set container dimensions
	const container = editorContainer.value;
	container.style.height =
		typeof props.height === "number" ? `${props.height}px` : props.height;
	container.style.width =
		typeof props.width === "number" ? `${props.width}px` : props.width;

	// Configure TypeScript/JavaScript language features for better IntelliSense
	if (props.language === "typescript" || props.language === "javascript") {
		monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
			target: monaco.languages.typescript.ScriptTarget.ES2020,
			allowNonTsExtensions: true,
			moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
			module: monaco.languages.typescript.ModuleKind.CommonJS,
			noEmit: true,
			esModuleInterop: true,
			jsx: monaco.languages.typescript.JsxEmit.React,
			reactNamespace: "React",
			allowJs: true,
			typeRoots: ["node_modules/@types"],
		});

		monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
			target: monaco.languages.typescript.ScriptTarget.ES2020,
			allowNonTsExtensions: true,
			moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
			module: monaco.languages.typescript.ModuleKind.CommonJS,
			noEmit: true,
			esModuleInterop: true,
			jsx: monaco.languages.typescript.JsxEmit.React,
			reactNamespace: "React",
			allowJs: true,
			typeRoots: ["node_modules/@types"],
		});

		// Add common library definitions for better IntelliSense
		monaco.languages.typescript.javascriptDefaults.addExtraLib(
			`
      declare var console: {
        log(message?: any, ...optionalParams: any[]): void;
        error(message?: any, ...optionalParams: any[]): void;
        warn(message?: any, ...optionalParams: any[]): void;
        info(message?: any, ...optionalParams: any[]): void;
      };
      
      declare var window: Window & typeof globalThis;
      declare var document: Document;
      
      interface Array<T> {
        map<U>(callbackfn: (value: T, index: number, array: T[]) => U): U[];
        filter(callbackfn: (value: T, index: number, array: T[]) => boolean): T[];
        reduce<U>(callbackfn: (previousValue: U, currentValue: T, currentIndex: number, array: T[]) => U, initialValue: U): U;
        forEach(callbackfn: (value: T, index: number, array: T[]) => void): void;
      }
    `,
			"ts:lib.d.ts",
		);
	}

	// Merge options
	const editorOptions: monaco.editor.IStandaloneEditorConstructionOptions = {
		...defaultOptions,
		...props.options,
		value: props.modelValue,
		language: props.language,
		theme: props.theme,
	};

	// Create editor
	editor = monaco.editor.create(editorContainer.value, editorOptions);

	// Set up change listener
	editor.onDidChangeModelContent(() => {
		const value = editor!.getValue();
		emit("update:modelValue", value);
		emit("change", value);
	});

	emit("mounted", editor);
};

const disposeEditor = () => {
	if (editor) {
		editor.dispose();
		editor = null;
	}
};

// Watch for prop changes
watch(
	() => props.modelValue,
	(newValue) => {
		if (editor && newValue !== editor.getValue()) {
			editor.setValue(newValue);
		}
	},
);

watch(
	() => props.language,
	(newLanguage) => {
		if (editor) {
			monaco.editor.setModelLanguage(editor.getModel()!, newLanguage);
		}
	},
);

watch(
	() => props.theme,
	(newTheme, oldTheme) => {
		if (editor && newTheme && newTheme !== oldTheme) {
			try {
				monaco.editor.setTheme(newTheme);
			} catch (error) {
				console.error("Failed to apply theme:", newTheme, error);
			}
		}
	},
);

onMounted(async () => {
	await nextTick();
	await initMonaco();

	if (editor) {
		editorConfig.setEditorInstance(editor);
	}
});

onBeforeUnmount(() => {
	disposeEditor();
});

// Expose editor instance
defineExpose({
	getEditor: () => editor,
	getValue: () => editor?.getValue(),
	setValue: (value: string) => editor?.setValue(value),
	focus: () => editor?.focus(),
	dispose: disposeEditor,
});
</script>

<style scoped>
.monaco-editor-container {
  border: 1px solid #ccc;
  border-radius: 4px;
  overflow: hidden;
}
</style>