<template>
    <div class="py-2 gap-1 flex flex-col h-full">
      <EditorControls />
      <div class="editor-section h-full">
        <ResizablePanel 
          storage-key="xodeforces-panels"
          :min-top-height="300"
          :min-bottom-height="200"
          :default-top-height="showExecutionPanels ? '60%' : '100%'"
        >
          <template #top>
            <MonacoEditor
              ref="monacoEditor"
              v-model="editorConfig.code"
              :language="editorConfig.language"
              :theme="currentTheme"
              :options="editorOptions"
              :height="'100%'"
              @change="onCodeChange"
              @mounted="onEditorMounted"
            />
          </template>
          
          <template #bottom-left>
            <InputPanel
              v-model="customInputModel"
              :readonly="executionStore.isRunning"
            />
          </template>
          
          <template #bottom-right>
            <OutputPanel
              :result="executionStore.result"
              :is-loading="executionStore.isRunning"
              :error="executionStore.error"
              :language-name="currentLanguageLabel"
              @clear="executionStore.clearResult"
            />
          </template>
        </ResizablePanel>
      </div>
    </div>
  </template>
  
<script setup lang="ts">
import * as monaco from "monaco-editor";
import { ref, toRef, computed } from "vue";
import EditorControls from "../../../components/EditorControls.vue";
import MonacoEditor from "../../../components/MonacoEditor.vue";
import ResizablePanel from "../../../components/ResizablePanel.vue";
import InputPanel from "../../../components/InputPanel.vue";
import OutputPanel from "../../../components/OutputPanel.vue";
import { useEditorConfig } from "../../../stores/editor-config";
import { useExecutionStore } from "../../../stores/execution-store";
import { languages } from "../../../constants/languages";

const monacoEditor = ref(null);

const editorConfig = useEditorConfig();
const executionStore = useExecutionStore();
const currentTheme = toRef(editorConfig, "theme");

const editorOptions = editorConfig.editorOptions;

const showExecutionPanels = computed(() => true); // Always show for now

const currentLanguageLabel = computed(() => {
	const language = languages[editorConfig.language as keyof typeof languages];
	return language?.label || editorConfig.language;
});

const customInputModel = computed({
	get: () => executionStore.customInput,
	set: (value: string) => executionStore.setCustomInput(value),
});

const onCodeChange = (newCode: string) => {
	editorConfig.onCodeChange(newCode);
};

const onEditorMounted = (editor: monaco.editor.IStandaloneCodeEditor) => {
	// Add custom commands or key bindings here if needed
	editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
		console.log("Save shortcut pressed!");
	});
};
</script>