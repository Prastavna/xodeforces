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
                <UPopover v-if="hasSnippet" mode="hover" :open-delay="300" :close-delay="100">
                    <UButton @click="loadSnippet" :icon="hasSnippet ? 'i-heroicons-code-bracket-square' : 'i-heroicons-code-bracket'" variant="ghost" :title="hasSnippet ? 'Load Custom Snippet' : 'Load Default Template'" size="sm" :color="hasSnippet ? 'primary' : 'gray'"></UButton>
                    <template #content>
                        <div class="p-3 max-w-md">
                            <h4 class="text-sm font-medium mb-2">Custom Snippet Preview</h4>
                            <pre class="text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded overflow-x-auto max-h-48 overflow-y-auto"><code>{{ snippetStore.getSnippet(editorConfig.language) }}</code></pre>
                        </div>
                    </template>
                </UPopover>
                <UButton v-else @click="loadSnippet" :icon="hasSnippet ? 'i-heroicons-code-bracket-square' : 'i-heroicons-code-bracket'" variant="ghost" :title="hasSnippet ? 'Load Custom Snippet' : 'Load Default Template'" size="sm" :color="hasSnippet ? 'primary' : 'gray'"></UButton>
                <UButton @click="editorConfig.formatCode" icon="i-heroicons-sparkles" variant="ghost" title="Format Code" size="sm"></UButton>
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
</script>