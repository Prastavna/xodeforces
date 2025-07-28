<template>
    <div class="py-2 gap-1 flex flex-col h-full">
      <EditorControls />
      <div class="editor-section h-full">
        <MonacoEditor
          ref="monacoEditor"
          v-model="editorConfig.code"
          :language="editorConfig.language"
          :theme="editorConfig.theme"
          :options="editorOptions"
          :height="'100%'"
          @change="onCodeChange"
          @mounted="onEditorMounted"
        />
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import * as monaco from 'monaco-editor'
  import { ref } from 'vue'
  import MonacoEditor from '../../../components/MonacoEditor.vue'
  import EditorControls from '../../../components/EditorControls.vue'
  import { useEditorConfig } from '../../../stores/editor-config';
  
  const monacoEditor = ref(null)
  // let editorInstance = null

  const editorConfig = useEditorConfig();

  // const editorOptions = reactive({
  //   fontSize: 14,
  //   wordWrap: 'on',
  //   lineNumbers: 'on',
  //   minimap: { enabled: true },
  //   scrollBeyondLastLine: false,
  //   automaticLayout: true,
  //   tabSize: 2,
  //   insertSpaces: true,
  //   detectIndentation: false,
  //   // Enhanced IntelliSense options
  //   suggestOnTriggerCharacters: true,
  //   acceptSuggestionOnEnter: 'on',
  //   tabCompletion: 'on',
  //   quickSuggestions: {
  //     other: true,
  //     comments: true,
  //     strings: true
  //   },
  //   parameterHints: {
  //     enabled: true,
  //     cycle: true
  //   },
  //   hover: {
  //     enabled: true,
  //     delay: 300
  //   },
  //   formatOnPaste: true,
  //   formatOnType: true
  // })

  const editorOptions = editorConfig.editorOptions;

  const onCodeChange = (newCode: string) => {
    editorConfig.onCodeChange(newCode)
  }
  
  
  const onEditorMounted = (editor: monaco.editor.IStandaloneCodeEditor) => {
    // editorInstance = editor
    
    // Add custom commands or key bindings here if needed
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      console.log('Save shortcut pressed!')
    })
  }
  </script>