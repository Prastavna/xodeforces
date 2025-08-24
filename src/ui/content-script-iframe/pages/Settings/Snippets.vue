<template>
          <UAccordion :items="snippetAccordionItems" class=" border border-gray-200 rounded-lg px-4 py-2">
        <template #snippets>
          <div class="space-y-4">
            <USelect
              v-model="selectedLanguage"
              :items="languageItems"
              value-attribute="value"
              label-attribute="label"
              class="w-48"
              placeholder="Select a language"
            />

            <div v-if="selectedLanguage" class="space-y-3">
              <div class="flex justify-between items-center">
                <label class="text-sm font-medium">
                  {{ selectedLanguageLabel }} Template
                  <span v-if="hasCustomSnippet" class="text-xs text-blue-600 ml-2">(Custom)</span>
                  <span v-else class="text-xs text-gray-500 ml-2">(Default)</span>
                </label>
                <div class="flex gap-2">
                  <UButton 
                    @click="resetToTemplate"
                    variant="ghost"
                    size="sm"
                    icon="i-heroicons-arrow-path"
                    title="Reset to competitive programming template"
                  >
                    Reset to Template
                  </UButton>
                  <UButton 
                    @click="saveSnippet"
                    size="sm"
                    icon="i-heroicons-check"
                  >
                    Save
                  </UButton>
                </div>
              </div>
              
              <UTextarea
                v-model="snippetCode"
                :rows="12"
                placeholder="Enter your code template..."
                class="font-mono text-sm w-full"
              />
            </div>

            <div class="border-t pt-4">
              <h4 class="text-md font-medium mb-3">Snippet Management</h4>
              <div class="flex gap-3">
                <UButton 
                  @click="exportSnippets"
                  variant="outline"
                  size="sm"
                  icon="i-heroicons-arrow-down-tray"
                >
                  Export All
                </UButton>
                <UButton 
                  @click="importSnippets"
                  variant="outline"
                  size="sm"
                  icon="i-heroicons-arrow-up-tray"
                >
                  Import
                </UButton>
                <input 
                  ref="fileInput"
                  type="file"
                  accept=".json"
                  @change="handleFileImport"
                  class="hidden"
                />
              </div>
            </div>
          </div>
        </template>
      </UAccordion>

</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { languages } from "../../../../constants/languages";
import { useEditorConfig } from "../../../../stores/editor-config";
import { useSnippetStore } from "../../../../stores/snippet-store";

const snippetStore = useSnippetStore();
const editorConfig = useEditorConfig();
const toast = useToast();

const selectedLanguage = ref(editorConfig.language);
const snippetCode = ref("");

// Load template when language changes
const loadTemplateForLanguage = (lang: string) => {
	if (lang) {
		const snippet = snippetStore.getSnippet(lang);
		const defaultSnippet =
			languages[lang as keyof typeof languages]?.sample || "";
		snippetCode.value = snippet || defaultSnippet;
	}
};

watch(selectedLanguage, (newLang) => {
	if (newLang) {
		loadTemplateForLanguage(newLang);
	}
});

// Load initial content when component mounts
onMounted(() => {
	if (selectedLanguage.value) {
		loadTemplateForLanguage(selectedLanguage.value);
	}
});

const fileInput = ref<HTMLInputElement>();

const languageItems = Object.values(languages).map((language) => ({
	value: language.value,
	label: language.label,
}));

const snippetAccordionItems = [
	{
		label: "Snippets",
		icon: "i-heroicons-code-bracket",
		description:
			"Manage your code templates and snippets for different programming languages",
		slot: "snippets",
	},
];

const selectedLanguageLabel = computed(() => {
	if (!selectedLanguage.value) return "";
	return (
		languages[selectedLanguage.value as keyof typeof languages]?.label || ""
	);
});

const hasCustomSnippet = computed(() => {
	if (!selectedLanguage.value) return false;
	return snippetStore.getSnippet(selectedLanguage.value) !== null;
});

const saveSnippet = () => {
	if (selectedLanguage.value) {
		snippetStore.saveSnippet(selectedLanguage.value, snippetCode.value);
		const languageLabel =
			languages[selectedLanguage.value as keyof typeof languages]?.label ||
			selectedLanguage.value;
		toast.add({
			title: `${languageLabel} snippet saved`,
			description: `${languageLabel} snippet saved successfully`,
			color: "success",
		});
	}
};

const resetToTemplate = () => {
	if (selectedLanguage.value) {
		// Load the competitive template (now stored in languages.sample)
		const template =
			languages[selectedLanguage.value as keyof typeof languages]?.sample || "";
		snippetCode.value = template;
	}
};

const exportSnippets = () => {
	const snippets = snippetStore.getAllSnippets();
	if (Object.keys(snippets).length === 0) {
		toast.add({
			title: "No snippets to export",
			description: "No snippets to export",
			color: "warning",
		});
		return;
	}

	const dataStr = JSON.stringify(snippets, null, 2);
	const blob = new Blob([dataStr], { type: "application/json" });
	const file = new File([blob], "xodeforces-snippets.json", {
		type: "application/json",
	});

	self.parent.postMessage(
		{
			type: "exportSnippets",
			file,
		},
		"*",
	);

	toast.add({
		title: "Snippets exported",
		description: "Snippets exported successfully",
		color: "success",
	});
};

const importSnippets = () => {
	fileInput.value?.click();
};
const handleFileImport = (event: Event) => {
	const file = (event.target as HTMLInputElement).files?.[0];
	if (!file) return;

	const reader = new FileReader();
	reader.onload = (e) => {
		try {
			const snippets = JSON.parse(e.target?.result as string);
			snippetStore.importSnippets(snippets);
			if (selectedLanguage.value) {
				const snippet = snippetStore.getSnippet(selectedLanguage.value);
				if (snippet) {
					snippetCode.value = snippet;
				}
			}
			toast.add({
				title: "Snippets imported",
				description: "Snippets imported successfully",
				color: "success",
			});
		} catch (error) {
			console.error("Failed to import snippets:", error);
			toast.add({
				title: "Failed to import snippets",
				description: "Failed to import snippets. Invalid file format.",
				color: "error",
			});
		}
	};
	reader.readAsText(file);
};
</script>