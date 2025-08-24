<template>
  <div class="h-full flex flex-col bg-white border border-gray-200 rounded-lg">
    <div class="flex items-center justify-between px-3 py-2 border-b border-gray-200 bg-gray-50 rounded-t-lg">
      <div class="flex items-center gap-2">
        <Icon name="i-heroicons-keyboard" class="w-4 h-4 text-gray-600" />
        <h3 class="text-sm font-medium text-gray-700">Custom Input</h3>
      </div>
      <div class="flex items-center gap-2">
        <UButton
          v-if="input.trim()"
          @click="clearInput"
          size="xs"
          variant="ghost"
          icon="i-heroicons-x-mark"
          :disabled="readonly"
        >
          Clear
        </UButton>
        <UBadge 
          v-if="input"
          :label="`${input.split('\n').length} lines, ${input.length} chars`"
          color="gray" 
          variant="soft" 
          size="xs"
        />
      </div>
    </div>
    
    <div class="flex-1 overflow-hidden">
      <MonacoEditor
        ref="editor"
        v-model="input"
        language="plaintext"
        :theme="theme"
        :height="'100%'"
        :options="editorOptions"
        @mounted="onEditorMounted"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import type * as monaco from "monaco-editor";
import MonacoEditor from "./MonacoEditor.vue";
import { useEditorConfig } from "../stores/editor-config";
import { storage } from "../services/storage";

interface Props {
	modelValue?: string;
	readonly?: boolean;
	placeholder?: string;
	storageKey?: string;
}

interface Emits {
	(e: "update:modelValue", value: string): void;
	(e: "change", value: string): void;
}

const props = withDefaults(defineProps<Props>(), {
	modelValue: "",
	readonly: false,
	placeholder:
		"Enter your custom input here...\n\nThis will be passed to your program as stdin.",
	storageKey: "judge0-custom-input",
});

const emit = defineEmits<Emits>();

const editor = ref<InstanceType<typeof MonacoEditor>>();
const editorConfig = useEditorConfig();

const input = ref(props.modelValue);

const theme = computed(() => editorConfig.theme);

const editorOptions = computed(() => ({
	...editorConfig.editorOptions,
	readOnly: props.readonly,
	wordWrap: "on",
	lineNumbers: "on",
	minimap: { enabled: false },
	scrollBeyondLastLine: false,
	fontSize: 13,
	tabSize: 2,
	insertSpaces: true,
	automaticLayout: true,
	scrollbar: {
		vertical: "auto",
		horizontal: "auto",
		verticalScrollbarSize: 8,
		horizontalScrollbarSize: 8,
	},
	// Disable some features for input panel
	suggestOnTriggerCharacters: false,
	quickSuggestions: false,
	parameterHints: { enabled: false },
	hover: { enabled: false },
	formatOnPaste: false,
	formatOnType: false,
}));

// Load saved input on mount
const loadInput = () => {
	try {
		const saved = storage.session.get(props.storageKey);
		if (saved && saved.trim()) {
			input.value = saved;
			emit("update:modelValue", saved);
		} else if (props.modelValue) {
			input.value = props.modelValue;
		}
	} catch (error) {
		console.warn("Failed to load saved input:", error);
	}
};

// Save input when it changes
const saveInput = (value: string) => {
	try {
		storage.session.set(props.storageKey, value);
	} catch (error) {
		console.warn("Failed to save input:", error);
	}
};

const clearInput = () => {
	input.value = "";
	emit("update:modelValue", "");
	emit("change", "");
	saveInput("");
};

const onEditorMounted = (
	editorInstance: monaco.editor.IStandaloneCodeEditor,
) => {
	// Focus the editor
	editorInstance.focus();
};

// Watch for external changes
watch(
	() => props.modelValue,
	(newValue) => {
		if (newValue !== input.value) {
			input.value = newValue;
		}
	},
);

// Watch for internal changes
watch(input, (newValue) => {
	emit("update:modelValue", newValue);
	emit("change", newValue);
	saveInput(newValue);
});

// Load saved input on component mount
loadInput();
</script>