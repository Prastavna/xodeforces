<template>
  <div class="py-4 px-2 h-full overflow-y-auto">
    <div class="mb-6">
      <h2 class="text-xl font-semibold mb-2">Settings</h2>
      <p class="text-sm text-gray-600">Manage your editor preferences and code snippets</p>
    </div>

    <div class="space-y-6">
      <div class="border border-gray-200 rounded-lg p-4">
        <h3 class="text-lg font-medium mb-4">Judge0 Code Execution</h3>
        <p class="text-sm text-gray-600 mb-4">
          Configure Judge0 API to run your code with custom inputs
        </p>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-2">Base URL</label>
            <USelect
              v-model="judge0BaseUrl"
              :items="baseUrlOptions"
              value-attribute="value"
              label-attribute="label"
              class="w-full"
              @update:modelValue="handleBaseUrlChange"
            />
          </div>
          
          <div v-if="judge0BaseUrl === ''" class="space-y-2">
            <label class="block text-sm font-medium">Custom Base URL</label>
            <UInput
              v-model="customBaseUrl"
              placeholder="https://your-judge0-instance.com"
              class="w-full"
              @blur="handleCustomUrlChange"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium mb-2">
              API Key
              <span class="text-xs text-gray-500 ml-2">
                {{ isRapidApi ? '(Required for RapidAPI)' : '(Optional)' }}
              </span>
            </label>
            <UInput
              v-model="judge0ApiKey"
              type="password"
              placeholder="Enter your API key"
              class="w-full"
              @blur="handleApiKeyChange"
            />
          </div>
          
          <div class="flex items-center gap-3 pt-2">
            <UButton
              @click="testJudge0Connection"
              :loading="judge0Config.isLoading"
              :disabled="!judge0Config.config.baseUrl"
              size="sm"
            >
              Test Connection
            </UButton>
            
            <div v-if="judge0Config.isConnected" class="flex items-center gap-2 text-green-600">
              <Icon name="i-heroicons-check-circle" class="w-4 h-4" />
              <span class="text-sm">Connected</span>
            </div>
            
            <div v-else-if="judge0Config.error" class="flex items-center gap-2 text-red-600">
              <Icon name="i-heroicons-x-circle" class="w-4 h-4" />
              <span class="text-sm">{{ judge0Config.error }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="border border-gray-200 rounded-lg p-4">
        <h3 class="text-lg font-medium mb-4">Editor Settings</h3>
        <p class="text-sm text-gray-600 mb-4">
          Configure your editor behavior and appearance
        </p>
        
        <div class="space-y-4">
          <div class="grid grid-cols-4 gap-4">
            <div>
              <label class="block text-sm font-medium mb-2">Tab Size</label>
              <USelect
                class="w-20"
                v-model="tabSize"
                :items="tabSizeOptions"
                value-attribute="value"
                label-attribute="label"
                @change="updateEditorConfig"
              />
            </div>
            <div>
              <label class="block text-sm font-medium mb-2">Indentation</label>
              <USelect
                class="w-32"
                v-model="indentationType"
                :items="indentationOptions"
                value-attribute="value"
                label-attribute="label"
                @change="updateEditorConfig"
              />
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium mb-2">Editor Theme</label>
            <USelect
              :model-value="editorConfig.theme"
              @update:modelValue="editorConfig.changeTheme"
              :items="themeItems"
              value-attribute="value"
              label-attribute="label"
              class="w-full"
              icon="i-heroicons-paint-brush"
            />
          </div>
        </div>
      </div>

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
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { languages } from "../../../constants/languages";
import { themes } from "../../../constants/themes";
import { useEditorConfig } from "../../../stores/editor-config";
import { useSnippetStore } from "../../../stores/snippet-store";
import { useJudge0Config } from "../../../stores/judge0-config";
import { JUDGE0_BASE_URLS } from "../../../constants/judge0-languages";

const snippetStore = useSnippetStore();
const editorConfig = useEditorConfig();
const judge0Config = useJudge0Config();
const selectedLanguage = ref(editorConfig.language);
const snippetCode = ref("");
const fileInput = ref<HTMLInputElement>();
const toast = useToast();

const tabSize = ref(editorConfig.tabSize);
const indentationType = ref(editorConfig.insertSpaces ? "spaces" : "tabs");

// Judge0 settings
const judge0BaseUrl = ref(judge0Config.config.baseUrl);
const judge0ApiKey = ref(judge0Config.config.apiKey || "");
const customBaseUrl = ref("");

const tabSizeOptions = [
	{ value: 2, label: "2" },
	{ value: 4, label: "4" },
	{ value: 8, label: "8" },
];

const indentationOptions = [
	{ value: "spaces", label: "Spaces" },
	{ value: "tabs", label: "Tabs" },
];

const languageItems = Object.values(languages).map((language) => ({
	value: language.value,
	label: language.label,
}));

const themeItems = Object.values(themes).map((theme) => ({
	value: theme.value,
	label: theme.label,
}));

const baseUrlOptions = computed(() => JUDGE0_BASE_URLS);

const isRapidApi = computed(
	() => judge0BaseUrl.value?.includes("rapidapi.com") || false,
);

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

const updateEditorConfig = () => {
	const insertSpaces = indentationType.value === "spaces";
	editorConfig.updateEditorConfig(tabSize.value, insertSpaces);
	toast.add({
		title: "Editor settings updated",
		description: "Editor settings updated successfully",
		color: "success",
	});
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

// Judge0 handlers
const handleBaseUrlChange = (value: string) => {
	if (value === "") {
		// Custom URL selected
		return;
	}
	updateJudge0Config({ baseUrl: value });
};

const handleCustomUrlChange = () => {
	if (judge0BaseUrl.value === "" && customBaseUrl.value.trim()) {
		updateJudge0Config({ baseUrl: customBaseUrl.value.trim() });
	}
};

const handleApiKeyChange = () => {
	updateJudge0Config({ apiKey: judge0ApiKey.value });
};

const updateJudge0Config = async (config: {
	baseUrl?: string;
	apiKey?: string;
}) => {
	try {
		await judge0Config.updateConfig(config);
		toast.add({
			title: "Judge0 settings updated",
			description: "Judge0 configuration updated successfully",
			color: "success",
		});
	} catch (error) {
		toast.add({
			title: "Failed to update Judge0 settings",
			description: error instanceof Error ? error.message : "Unknown error",
			color: "error",
		});
	}
};

const testJudge0Connection = async () => {
	const success = await judge0Config.testConnection();
	if (success) {
		toast.add({
			title: "Connection successful",
			description: "Successfully connected to Judge0 API",
			color: "success",
		});
	} else {
		toast.add({
			title: "Connection failed",
			description: judge0Config.error || "Failed to connect to Judge0 API",
			color: "error",
		});
	}
};
</script>