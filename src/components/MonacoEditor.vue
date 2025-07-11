<template>
  <div ref="editorContainer" class="monaco-editor-container"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as monaco from 'monaco-editor'

// Props interface
interface Props {
  modelValue?: string
  language?: string
  theme?: string
  height?: string
  width?: string
  options?: monaco.editor.IStandaloneEditorConstructionOptions
}

// Props
const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  language: 'javascript',
  theme: 'vs-dark',
  height: '400px',
  width: '100%',
  options: () => ({})
})

// Emits
const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

// Refs
const editorContainer = ref<HTMLElement | null>(null)
let editor: monaco.editor.IStandaloneCodeEditor | null = null

// Initialize editor
onMounted(() => {
  if (editorContainer.value) {
    editor = monaco.editor.create(editorContainer.value, {
      value: props.modelValue,
      language: props.language,
      theme: props.theme,
      automaticLayout: true,
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      fontSize: 14,
      lineNumbers: 'on',
      ...props.options
    })

    // Set container dimensions
    editorContainer.value.style.height = props.height
    editorContainer.value.style.width = props.width

    // Listen for content changes
    editor.onDidChangeModelContent(() => {
      const value = editor.getValue()
      emit('update:modelValue', value)
    })

    // Resize editor when container size changes
    const resizeObserver = new ResizeObserver(() => {
      editor?.layout()
    })
    resizeObserver.observe(editorContainer.value)
  }
})

// Watch for external value changes
watch(() => props.modelValue, (newValue) => {
  if (editor && editor.getValue() !== newValue) {
    editor.setValue(newValue)
  }
})

// Watch for language changes
watch(() => props.language, (newLanguage) => {
  if (editor) {
    monaco.editor.setModelLanguage(editor.getModel(), newLanguage)
  }
})

// Watch for theme changes
watch(() => props.theme, (newTheme) => {
  if (editor) {
    monaco.editor.setTheme(newTheme)
  }
})

// Cleanup
onUnmounted(() => {
  if (editor) {
    editor.dispose()
  }
})

// Expose editor instance
defineExpose<{
  getEditor(): monaco.editor.IStandaloneCodeEditor | null
}>({
  getEditor: () => editor
})
</script>

<style scoped>
.monaco-editor-container {
  border: 1px solid #ccc;
  border-radius: 4px;
}
</style>