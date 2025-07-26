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
                />

                <USelect
                    v-model="editorConfig.theme"
                    @update:modelValue="editorConfig.changeTheme"
                    :items="themeItems"
                    value-attribute="value"
                    label-attribute="label"
                    class="w-24"
                />
            </div>

            <div class="flex gap-2">
                <!-- <button @click="editorConfig.formatCode">Format Code</button> -->
                <UButton @click="editorConfig.resetCode">Reset</UButton>
                <UButton @click="editorConfig.submitCode">Submit</UButton>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useEditorConfig } from "../stores/editor-config";
import { languages } from "../constants/languages";
import { themes } from "../constants/themes";

const editorConfig = useEditorConfig();
const languageItems = Object.values(languages).map((language) => ({
    value: language.value,
    label: language.label
}));

const themeItems = Object.values(themes).map((theme) => ({
    value: theme.value,
    label: theme.label
}));

</script>