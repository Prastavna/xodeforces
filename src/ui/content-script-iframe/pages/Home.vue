<template>
    <EditorControls
        :language="selectedLanguage"
        :theme="selectedTheme"
        @clear-editor="clearEditor"
        @languageChange="languageChange"
        @themeChange="themeChange"
    />

    <MonacoEditor
        v-model="code"
        :language="selectedLanguage"
        :theme="selectedTheme"
    />

</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { Languages, samples } from '../../../constants/languages'
import EditorControls from '../../../components/EditorControls.vue'

const selectedLanguage = ref<Languages>(Languages.JavaScript)
const code = ref(samples[selectedLanguage.value])
const selectedTheme = ref<'vs' | 'vs-dark' | 'hc-black'>('vs')

watch(selectedLanguage, () => {
    code.value = samples[selectedLanguage.value]
})

const clearEditor = () => {
    code.value = ''
}

const languageChange = (language: Languages) => {
    code.value = samples[language]
    selectedLanguage.value = language
}

const themeChange = (theme: 'vs' | 'vs-dark' | 'hc-black') => {
    selectedTheme.value = theme
}

</script>