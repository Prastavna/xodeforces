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
                <UButton @click="editorConfig.resetCode" icon="i-heroicons-trash" variant="ghost" color="error"></UButton>
                <UButton @click="loadSnippet" :icon="hasSnippet ? 'i-heroicons-code-bracket-square' : 'i-heroicons-code-bracket'" variant="ghost" :title="hasSnippet ? 'Load Custom Snippet' : 'Load Default Template'" size="sm" :color="hasSnippet ? 'primary' : 'gray'"></UButton>
                <UButton @click="editorConfig.formatCode" icon="i-heroicons-sparkles" variant="ghost" title="Format Code" size="sm"></UButton>
                <UButton @click="saveCurrentAsSnippet" icon="i-heroicons-bookmark" variant="ghost" title="Save as Snippet" size="sm"></UButton>
                <UButton @click="editorConfig.submitCode" icon="i-heroicons-paper-clip">Attach File</UButton>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from "vue";
import { languages } from "../constants/languages";
import { themes } from "../constants/themes";
import { useEditorConfig } from "../stores/editor-config";
import { useSnippetStore } from "../stores/snippet-store";

const editorConfig = useEditorConfig();
const snippetStore = useSnippetStore();
const toast = useToast();

onMounted(() => {
	snippetStore.loadSnippets();
});

const languageItems = Object.values(languages).map((language) => ({
	value: language.value,
	label: language.label,
}));

const themeItems = Object.values(themes).map((theme) => ({
	value: theme.value,
	label: theme.label,
}));

const hasSnippet = computed(() => {
	return snippetStore.getSnippet(editorConfig.language) !== null;
});

const loadSnippet = () => {
	const snippet = snippetStore.getSnippet(editorConfig.language);
	if (snippet) {
		editorConfig.onCodeChange(snippet);
	} else {
		const defaultSnippet =
			languages[editorConfig.language as keyof typeof languages]?.sample || "";
		editorConfig.onCodeChange(defaultSnippet);
	}
};

const saveCurrentAsSnippet = () => {
	snippetStore.saveSnippet(editorConfig.language, editorConfig.code);
	const languageLabel =
		languages[editorConfig.language as keyof typeof languages]?.label ||
		editorConfig.language;
	toast.add({
		title: "Snippet saved",
		description: `${languageLabel} template saved successfully`,
		color: "success",
	});
};
</script>