<template>
    <div class="header">
        <div class="controls">
            <select v-bind:value="editorConfig.language"
                @change="editorConfig.changeLanguage(($event.target as HTMLSelectElement).value)">
                <option v-for="language in languages" :key="language.value" :value="language.value">
                    {{ language.label }}
                </option>
            </select>

            <select v-bind:value="editorConfig.theme"
                @change="editorConfig.changeTheme(($event.target as HTMLSelectElement).value)">
                <option v-for="theme in themes" :key="theme.value" :value="theme.value">
                    {{ theme.label }}
                </option>
            </select>

            <button @click="editorConfig.formatCode">Format Code</button>
            <button @click="editorConfig.resetCode">Reset</button>
            <button @click="editorConfig.submitCode">Submit</button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useEditorConfig } from "../stores/editor-config";
import { languages } from "../constants/languages";
import { themes } from "../constants/themes";

const editorConfig = useEditorConfig();

</script>