<template>
    <div id="app">
      <EditorControls />
      <div class="editor-section">
        <MonacoEditor
          ref="monacoEditor"
          v-model="editorConfig.code"
          :language="editorConfig.language"
          :theme="editorConfig.theme"
          :options="editorOptions"
          :height="600"
          @change="onCodeChange"
          @mounted="onEditorMounted"
        />
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import * as monaco from 'monaco-editor'
  import { ref, reactive } from 'vue'
  import MonacoEditor from '../../../components/MonacoEditor.vue'
  import EditorControls from '../../../components/EditorControls.vue'
  import { useEditorConfig } from '../../../stores/editor-config';
  
  const monacoEditor = ref(null)
  let editorInstance = null

  const editorConfig = useEditorConfig();
  
  // const code = ref(`// Welcome to Monaco Editor with IntelliSense!
  // // Try typing the following to see IntelliSense in action:
  
  // // 1. Type 'console.' to see available methods
  // console.log('Hello, Monaco Editor!');
  
  // // 2. Type 'document.' to see DOM properties
  // document.getElementById('app');
  
  // // 3. Array methods - type 'arr.' after defining this array
  // const arr = [1, 2, 3, 4, 5];
  // arr.map(x => x * 2);
  
  // // 4. Function with parameters - hover over the function name
  // function calculateSum(a, b) {
  //   return a + b;
  // }
  
  // // 5. Object with properties
  // const user = {
  //   name: 'John Doe',
  //   age: 30,
  //   email: 'john@example.com'
  // };
  
  // // 6. Try auto-completion with user object
  // user.name;
  
  // // 7. Modern JavaScript features
  // const asyncFunction = async () => {
  //   const response = await fetch('/api/data');
  //   const data = await response.json();
  //   return data;
  // };
  
  // // 8. Error detection - this will show a red underline
  // // undeclaredVariable.someMethod();
  
  // // 9. Type annotations (switch to TypeScript for better experience)
  // // const typedFunction = (name: string, age: number): string => {
  // //   return \`Hello \${name}, you are \${age} years old\`;
  // // };`)
  
  const editorOptions = reactive({
    fontSize: 14,
    wordWrap: 'on',
    lineNumbers: 'on',
    minimap: { enabled: true },
    scrollBeyondLastLine: false,
    automaticLayout: true,
    tabSize: 2,
    insertSpaces: true,
    detectIndentation: false,
    // Enhanced IntelliSense options
    suggestOnTriggerCharacters: true,
    acceptSuggestionOnEnter: 'on',
    tabCompletion: 'on',
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
  })
  


  // const formatCode = () => {
  //   if (editorInstance) {
  //     editorInstance.getAction('editor.action.formatDocument').run()
  //   }
  // }
  
  
  const onCodeChange = (newCode: string) => {
    // Handle code changes if needed
    // console.log('Code changed:', newCode)
  }
  
  const onEditorMounted = (editor: monaco.editor.IStandaloneCodeEditor) => {
    editorInstance = editor
    console.log('Monaco Editor mounted successfully!')
    
    // Add custom commands or key bindings here if needed
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      console.log('Save shortcut pressed!')
      // Add save functionality here
    })
  }
  </script>
  
  <style>
  #app {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    margin: 0;
    padding: 20px;
    min-height: 100vh;
    background-color: #f5f5f5;
  }
  
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding: 0 10px;
  }
  
  .header h1 {
    margin: 0;
    color: #333;
  }
  
  .controls {
    display: flex;
    gap: 10px;
    align-items: center;
  }
  
  .controls select,
  .controls button {
    padding: 8px 12px;
    border: 1px solid #ccc;
    border-radius: 4px;
    background: white;
    font-size: 14px;
    cursor: pointer;
  }
  
  .controls button {
    background: #007acc;
    color: white;
    border: none;
  }
  
  .controls button:hover {
    background: #005a9e;
  }
  
  .editor-section {
    margin-bottom: 30px;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }
  
  .info {
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }
  
  .info h3 {
    color: #333;
    margin-top: 0;
  }
  
  .info ul {
    list-style-type: none;
    padding-left: 0;
  }
  
  .info li {
    margin: 8px 0;
    padding: 4px 0;
  }
  
  .info code {
    background: #f4f4f4;
    padding: 2px 6px;
    border-radius: 3px;
    font-family: 'Monaco', 'Menlo', monospace;
    font-size: 14px;
  }
  </style>