<template>
  <div class="app">
    <h1>Monaco Editor in Vue 3</h1>

    <!-- Basic usage -->
    <MonacoEditor v-model="code" :language="selectedLanguage" :theme="selectedTheme" height="300px" width="100%" />


    <!-- Controls -->
    <div class="controls">
      <label>
        Language:
        <select v-model="selectedLanguage">
          <option value="javascript">JavaScript</option>
          <option value="typescript">TypeScript</option>
          <option value="python">Python</option>
          <option value="json">JSON</option>
          <option value="html">HTML</option>
          <option value="css">CSS</option>
        </select>
      </label>

      <label>
        Theme:
        <select v-model="selectedTheme">
          <option value="vs">Light</option>
          <option value="vs-dark">Dark</option>
          <option value="hc-black">High Contrast</option>
        </select>
      </label>

      <button @click="clearEditor">Clear</button>
      <button @click="insertCode">Insert Sample Code</button>
    </div>

    <!-- Display current value -->
    <div class="output">
      <h3>Current Value:</h3>
      <pre>{{ code }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import MonacoEditor from '../../components/MonacoEditor.vue'

// Reactive data
const code = ref(`function hello() {
    console.log('Hello from Monaco Editor!');
  }`)

  const samples = {
    javascript: `function fibonacci(n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
  }`,
    python: `def fibonacci(n):
      if n <= 1:
          return n
      return fibonacci(n - 1) + fibonacci(n - 2)`,
    json: `{
    "name": "Monaco Editor",
    "version": "1.0.0",
    "description": "Code editor component"
  }`,
    html: `<!DOCTYPE html>
  <html>
  <head>
    <title>Monaco Editor</title>
  </head>
  <body>
    <h1>Hello World!</h1>
  </body>
  </html>`,
    css: `.editor-container {
    width: 100%;
    height: 400px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }`
  }

const selectedLanguage = ref<keyof typeof samples>('javascript')
const selectedTheme = ref<'vs' | 'vs-dark' | 'hc-black'>('vs-dark')

// Methods
const clearEditor = () => {
  code.value = ''
}

const insertCode = () => {
  code.value = samples[selectedLanguage.value]
}
</script>

<style scoped>
.app {
  max-width: 1200px;
  min-width: 300px;
  min-height: 400px;
  margin: 0 auto;
  padding: 20px;
}

.controls {
  margin: 20px 0;
  display: flex;
  gap: 15px;
  align-items: center;
}

.controls label {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.controls select {
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.controls button {
  padding: 8px 16px;
  background: #007acc;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.controls button:hover {
  background: #005a9e;
}

.output {
  margin-top: 20px;
}

.output pre {
  background: #f5f5f5;
  padding: 15px;
  border-radius: 4px;
  overflow: auto;
  white-space: pre-wrap;
}
</style>