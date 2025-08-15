<template>
    <div class="header">
        <div class="controls flex justify-between">
            <div class="flex gap-2">
                <USelect
                    v-model="editorConfig.language"
                    @update:modelValue="editorConfig.changeLanguage"
                    :items="languageItems"
                    value-attribute="value"
                    label-attribute="label"
                    class="w-32"
                    icon="i-heroicons-language"
                />

                <USelect
                    v-model="editorConfig.theme"
                    @update:modelValue="editorConfig.changeTheme"
                    :items="themeItems"
                    value-attribute="value"
                    label-attribute="label"
                    class="w-32"
                />
            </div>

            <div class="flex gap-2 pr-4">
                <!-- <button @click="editorConfig.formatCode">Format Code</button> -->
                <UButton @click="editorConfig.resetCode" icon="i-heroicons-trash" variant="ghost" color="error"></UButton>
                <UButton @click="editorConfig.submitCode" icon="i-heroicons-paper-clip">Attach File</UButton>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { languages } from "../constants/languages";
import { themes } from "../constants/themes";
import { useEditorConfig } from "../stores/editor-config";

const editorConfig = useEditorConfig();
const languageItems = Object.values(languages).map((language) => ({
	value: language.value,
	label: language.label,
}));

const themeItems = Object.values(themes).map((theme) => ({
	value: theme.value,
	label: theme.label,
}));
</script>