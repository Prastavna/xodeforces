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
                    class="w-40"
                    icon="i-heroicons-language"
                />
            </div>

            <div class="flex gap-2 pr-4">
                <UButton @click="editorConfig.resetCode" icon="i-heroicons-trash" variant="ghost" color="error"></UButton>
                <UPopover mode="hover" :open-delay="300" :close-delay="100">
                    <UButton @click="loadTemplate" :icon="hasSnippet ? 'i-heroicons-code-bracket-square' : 'i-heroicons-code-bracket'" variant="ghost" :title="hasSnippet ? 'Load Custom Snippet' : 'Load Competitive Template'" size="sm" :color="hasSnippet ? 'primary' : 'gray'"></UButton>
                    <template #content>
                        <div class="p-3 max-w-md">
                            <h4 class="text-sm font-medium mb-2">{{ hasSnippet ? 'Custom Snippet Preview' : 'Competitive Template Preview' }}</h4>
                            <pre class="text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded overflow-x-auto max-h-48 overflow-y-auto"><code>{{ currentTemplatePreview }}</code></pre>
                        </div>
                    </template>
                </UPopover>
                    <UButton @click="editorConfig.formatCode" icon="i-heroicons-sparkles" variant="ghost" title="Format Code" size="sm"></UButton>
                <UButton @click="editorConfig.submitCode" icon="i-heroicons-paper-clip">Attach File</UButton>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";
import { languages } from "../constants/languages";
import { useEditorConfig } from "../stores/editor-config";
import { useSnippetStore } from "../stores/snippet-store";

const editorConfig = useEditorConfig();
const snippetStore = useSnippetStore();

onMounted(() => {
	snippetStore.loadSnippets();
});

const languageItems = Object.values(languages)
	.map((language) => ({
		value: language.value,
		label: language.label,
	}))
	.sort((a, b) => a.label.localeCompare(b.label));

const hasSnippet = computed(() => {
	return snippetStore.getSnippet(editorConfig.language) !== null;
});

const currentTemplatePreview = computed(() => {
	const customSnippet = snippetStore.getSnippet(editorConfig.language);
	if (customSnippet) {
		return customSnippet;
	} else {
		return (
			languages[editorConfig.language as keyof typeof languages]?.sample || ""
		);
	}
});

const loadTemplate = () => {
	// Prioritize user's custom snippet over competitive template
	const customSnippet = snippetStore.getSnippet(editorConfig.language);
	if (customSnippet) {
		editorConfig.onCodeChange(customSnippet);
	} else {
		// Fallback to competitive template (now stored in languages.sample)
		const competitiveTemplate =
			languages[editorConfig.language as keyof typeof languages]?.sample || "";
		editorConfig.onCodeChange(competitiveTemplate);
	}
};
</script>