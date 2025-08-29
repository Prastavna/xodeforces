<template>
    <UAccordion :items="judge0AccordionItems" class="border border-gray-200 rounded-lg px-4 py-2">
        <template #judge0>
            <div class="space-y-4">
                <div>
                    <label class="block text-sm font-medium mb-2">Provider</label>
                    <USelect 
                        v-model="selectedProvider"
                        :items="judge0Config.availableProviders"
                        value-attribute="value"
                        option-attribute="label"
                        class="w-full"
                    />
                </div>

                <div>
                    <label class="block text-sm font-medium mb-2">
                        API Key
                    </label>
                    <div class="flex items-center gap-2">
                      <UInput
                        v-model="judge0ApiKey"
                        :type="showApiKey ? 'text' : 'password'"
                        placeholder="Enter your API key"
                        class="w-full"
                      >
                        <template #trailing>
                          <UButton
                            color="neutral"
                            variant="link"
                            size="sm"
                            :icon="showApiKey ? 'i-heroicons-eye-slash' : 'i-heroicons-eye'"

                            :aria-label="showApiKey ? 'Hide password' : 'Show password'"
                            :aria-pressed="showApiKey"
                            aria-controls="password"
                            @click="showApiKey = !showApiKey"
                          />
                          </template>
                        </UInput>
                    </div>
                </div>

                <div class="flex items-center justify-between pt-2">
                    <div class="flex items-center gap-3">
                        <UButton @click="saveAndTestConnection" :loading="judge0Config.isLoading" size="sm">
                            Save & Test Connection
                        </UButton>

                        <div v-if="judge0Config.isConnected" class="flex items-center gap-2 text-green-600">
                            <UIcon name="i-heroicons-check-circle" class="w-4 h-4" />
                            <span class="text-sm">Connected</span>
                        </div>

                        <div v-else-if="judge0Config.error" class="flex items-center gap-2 text-red-600">
                            <UIcon name="i-heroicons-x-circle" class="w-4 h-4" />
                            <span class="text-sm">{{ judge0Config.error }}</span>
                        </div>
                    </div>
                    <div class="text-xs text-primary-300 hover:text-primary-500 mr-2">
                        <a :href="getApiKeyUrl()" target="_blank" class="flex items-center gap-2">
                            Get {{ selectedProvider === Judge0Providers.RAPIDAPI ? 'RapidAPI' : 'Sulu' }} API Key
                            <UIcon name="i-heroicons-link" class="w-3 h-3" />
                        </a>
                    </div>
                </div>
            </div>
        </template>
    </UAccordion>
</template>


<script setup lang="ts">
import { useToast } from "@nuxt/ui/composables/useToast";
import { ref } from "vue";
import { Judge0Providers } from "../../../../services/judge0-providers";
import { useJudge0Config } from "../../../../stores/judge0-config";

const toast = useToast();
const judge0Config = useJudge0Config();

const showApiKey = ref(false);
const judge0ApiKey = ref(judge0Config.config.apiKey || "");
const selectedProvider = ref(judge0Config.config.provider);

const judge0AccordionItems = [
	{
		label: "Judge0",
		icon: "i-heroicons-play",
		description: "Configure Judge0 API to run your code with custom inputs",
		slot: "judge0",
	},
];

const getApiKeyUrl = () => {
	if (selectedProvider.value === Judge0Providers.RAPIDAPI) {
		return "https://rapidapi.com/judge0-official/api/judge0-ce/playground";
	} else {
		return "https://platform.sulu.sh/apis/judge0/judge0-ce/readme";
	}
};

const saveAndTestConnection = async () => {
	try {
		// Save current settings
		await judge0Config.updateConfig({
			provider: selectedProvider.value,
			apiKey: judge0ApiKey.value,
		});

		// Test connection will be called automatically by updateConfig
		if (judge0Config.isConnected) {
			toast.add({
				title: "Success",
				description: "Settings saved and connection successful",
				color: "success",
			});
		} else {
			toast.add({
				title: "Settings saved",
				description:
					judge0Config.error || "Settings saved but connection failed",
				color: "warning",
			});
		}
	} catch (error) {
		toast.add({
			title: "Failed to save settings",
			description: error instanceof Error ? error.message : "Unknown error",
			color: "error",
		});
	}
};
</script>
