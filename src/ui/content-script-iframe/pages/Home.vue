<template>
    <div id="app">
      <div class="header">
        <h1>Vue 3 + Monaco Editor with IntelliSense</h1>
        <div class="controls">
          <select v-model="selectedLanguage" @change="changeLanguage">
            <option value="javascript">JavaScript</option>
            <option value="typescript">TypeScript</option>
            <option value="html">HTML</option>
            <option value="css">CSS</option>
            <option value="json">JSON</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="cpp">C++</option>
          </select>
          
          <select v-model="selectedTheme" @change="changeTheme">
            <option value="vs">Light</option>
            <option value="vs-dark">Dark</option>
            <option value="hc-black">High Contrast</option>
          </select>
          
          <button @click="formatCode">Format Code</button>
          <button @click="resetCode">Reset</button>
        </div>
      </div>
  
      <div class="editor-section">
        <MonacoEditor
          ref="monacoEditor"
          v-model="code"
          :language="selectedLanguage"
          :theme="selectedTheme"
          :options="editorOptions"
          :height="600"
          @change="onCodeChange"
          @mounted="onEditorMounted"
        />
      </div>
  
      <div class="info">
        <h3>Features Enabled:</h3>
        <ul>
          <li>✅ Auto-completion (Ctrl/Cmd + Space)</li>
          <li>✅ Parameter hints</li>
          <li>✅ Hover information</li>
          <li>✅ Error detection and highlighting</li>
          <li>✅ Code formatting (Alt/Option + Shift + F)</li>
          <li>✅ Syntax highlighting</li>
          <li>✅ IntelliSense suggestions</li>
          <li>✅ Code folding</li>
          <li>✅ Multi-cursor support (Ctrl/Cmd + click)</li>
          <li>✅ Find and replace (Ctrl/Cmd + F)</li>
        </ul>
        
        <h3>Try IntelliSense:</h3>
        <p>Type the following to see IntelliSense in action:</p>
        <ul>
          <li><code>console.</code> - See console methods</li>
          <li><code>document.</code> - See document properties</li>
          <li><code>[1,2,3].</code> - See array methods</li>
          <li><code>function test() {}</code> - Get parameter hints</li>
        </ul>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, reactive } from 'vue'
  import MonacoEditor from '../../../components/MonacoEditor.vue'
  
  const monacoEditor = ref(null)
  let editorInstance = null
  
  const selectedLanguage = ref('javascript')
  const selectedTheme = ref('vs-dark')
  
  const code = ref(`// Welcome to Monaco Editor with IntelliSense!
  // Try typing the following to see IntelliSense in action:
  
  // 1. Type 'console.' to see available methods
  console.log('Hello, Monaco Editor!');
  
  // 2. Type 'document.' to see DOM properties
  document.getElementById('app');
  
  // 3. Array methods - type 'arr.' after defining this array
  const arr = [1, 2, 3, 4, 5];
  arr.map(x => x * 2);
  
  // 4. Function with parameters - hover over the function name
  function calculateSum(a, b) {
    return a + b;
  }
  
  // 5. Object with properties
  const user = {
    name: 'John Doe',
    age: 30,
    email: 'john@example.com'
  };
  
  // 6. Try auto-completion with user object
  user.name;
  
  // 7. Modern JavaScript features
  const asyncFunction = async () => {
    const response = await fetch('/api/data');
    const data = await response.json();
    return data;
  };
  
  // 8. Error detection - this will show a red underline
  // undeclaredVariable.someMethod();
  
  // 9. Type annotations (switch to TypeScript for better experience)
  // const typedFunction = (name: string, age: number): string => {
  //   return \`Hello \${name}, you are \${age} years old\`;
  // };`)
  
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
  
  const sampleCode = {
    javascript: `// JavaScript with IntelliSense
  console.log('Hello JavaScript!');
  
  const users = [
    { name: 'Alice', age: 25 },
    { name: 'Bob', age: 30 }
  ];
  
  users.map(user => user.name);`,
  
    typescript: `// TypeScript with enhanced IntelliSense
  interface User {
    name: string;
    age: number;
    email?: string;
  }
  
  const users: User[] = [
    { name: 'Alice', age: 25, email: 'alice@example.com' },
    { name: 'Bob', age: 30 }
  ];
  
  function greetUser(user: User): string {
    return \`Hello \${user.name}!\`;
  }
  
  users.forEach(user => console.log(greetUser(user)));`,
  
    html: `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Monaco Editor Demo</title>
  </head>
  <body>
    <div id="app">
      <h1>Hello World!</h1>
      <p>This is a sample HTML document.</p>
    </div>
  </body>
  </html>`,
  
    css: `/* CSS with IntelliSense */
  .container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  }
  
  .card {
    background: white;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    padding: 2rem;
    max-width: 400px;
  }`,
  
    json: `{
    "name": "monaco-editor-demo",
    "version": "1.0.0",
    "description": "A demo of Monaco Editor with Vue 3",
    "dependencies": {
      "vue": "^3.3.4",
      "monaco-editor": "^0.44.0"
    },
    "scripts": {
      "dev": "vite",
      "build": "vite build"
    }
  }`,
  
    python: `# Python with IntelliSense
  def calculate_factorial(n):
      """Calculate factorial of a number"""
      if n <= 1:
          return 1
      return n * calculate_factorial(n - 1)
  
  class Person:
      def __init__(self, name, age):
          self.name = name
          self.age = age
      
      def greet(self):
          return f"Hello, my name is {self.name}"
  
  # Create a person and use the methods
  person = Person("Alice", 30)
  print(person.greet())
  print(f"Factorial of 5 is: {calculate_factorial(5)}")`,
  
    java: `// Java with IntelliSense
  public class HelloWorld {
      private String message;
      
      public HelloWorld(String message) {
          this.message = message;
      }
      
      public void printMessage() {
          System.out.println(this.message);
      }
      
      public static void main(String[] args) {
          HelloWorld hello = new HelloWorld("Hello, Monaco Editor!");
          hello.printMessage();
          
          // Array example
          int[] numbers = {1, 2, 3, 4, 5};
          for (int num : numbers) {
              System.out.println("Number: " + num);
          }
      }
  }`,
    
    cpp: `#include <iostream>
  using namespace std;
  
  int main() {
      cout << "Hello, Monaco Editor!" << endl;
      return 0;
  }`
  }
  
  const changeLanguage = () => {
    if (sampleCode[selectedLanguage.value]) {
      code.value = sampleCode[selectedLanguage.value]
    }
  }
  
  const changeTheme = () => {
    // Theme change is handled automatically by the watcher in MonacoEditor component
  }
  
  const formatCode = () => {
    if (editorInstance) {
      editorInstance.getAction('editor.action.formatDocument').run()
    }
  }
  
  const resetCode = () => {
    if (sampleCode[selectedLanguage.value]) {
      code.value = sampleCode[selectedLanguage.value]
    }
  }
  
  const onCodeChange = (newCode) => {
    // Handle code changes if needed
    // console.log('Code changed:', newCode)
  }
  
  const onEditorMounted = (editor) => {
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