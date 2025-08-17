<template>
    <div class="py-2 gap-1 flex flex-col h-full">
      <EditorControls />
      <div class="editor-section h-full">
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
      </div>
    </div>
  </template>
  
<script setup lang="ts">
import * as monaco from "monaco-editor";
import { ref, watch, toRef } from "vue";
import EditorControls from "../../../components/EditorControls.vue";
import MonacoEditor from "../../../components/MonacoEditor.vue";
import { useEditorConfig } from "../../../stores/editor-config";

const monacoEditor = ref(null);

const editorConfig = useEditorConfig();
const currentTheme = toRef(editorConfig, "theme");


const editorOptions = editorConfig.editorOptions;

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