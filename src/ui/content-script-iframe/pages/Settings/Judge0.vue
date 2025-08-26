<template>
    <UAccordion :items="judge0AccordionItems" class="border border-gray-200 rounded-lg px-4 py-2">
        <template #judge0>
            <div class="space-y-4">
                <div>
                    <label class="block text-sm font-medium mb-2">Base URL</label>
                    <div class="space-y-2">
                        <div class="flex items-center gap-2">
                            <UInput v-model="customBaseUrl" placeholder="https://your-judge0-instance.com"
                                :disabled="!baseurlEditAllowed"
                                class="flex-1 [&_input]:disabled:bg-gray-200 [&_input]:disabled:cursor-not-allowed"
                                @keydown.enter="handleCustomBaseUrlChange" />
                            <UButton v-if="!baseurlEditAllowed" @click="baseurlEditAllowed = !baseurlEditAllowed"
                                variant="ghost" size="sm" icon="i-heroicons-pencil"
                                title="Edit Base URL" />
                            <UButton v-else @click="handleCustomBaseUrlChange" variant="ghost"
                                size="sm" icon="i-heroicons-check" title="Save Base URL" />
                        </div>
                    </div>
                </div>

                <div>
                    <label class="block text-sm font-medium mb-2">
                        API Key
                    </label>
                    <div class="flex items-center gap-2">
                        <UInput v-model="judge0ApiKey" :type="showApiKey ? 'text' : 'password'"
                            placeholder="Enter your API key" class="w-full" @blur="handleApiKeyChange" />
                        <UButton @click="showApiKey = !showApiKey" variant="ghost" size="sm"
                            :icon="showApiKey ? 'i-heroicons-eye-slash' : 'i-heroicons-eye'"
                            :title="showApiKey ? 'Hide API Key' : 'Show API Key'" />
                    </div>
                </div>

                <div class="flex items-center justify-between pt-2">
                    <div class="flex items-center gap-3">
                        <UButton @click="testJudge0Connection" :loading="judge0Config.isLoading"
                            :disabled="!judge0Config.config.baseUrl" size="sm">
                            Test Connection
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
                        <a href="https://ce.judge0.com/#header-get-started" target="_blank"
                            class="flex items-center gap-2">
                            Get RapidAPI Key
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
import { useJudge0Config } from "../../../../stores/judge0-config";

const toast = useToast();
const judge0Config = useJudge0Config();

const baseurlEditAllowed = ref(false);
const showApiKey = ref(false);
const judge0ApiKey = ref(judge0Config.config.apiKey || "");
const customBaseUrl = ref(judge0Config.config.baseUrl || "");

const judge0AccordionItems = [
	{
		label: "Judge0",
		icon: "i-heroicons-play",
		description: "Configure Judge0 API to run your code with custom inputs",
		slot: "judge0",
	},
];

const handleCustomBaseUrlChange = () => {
	updateJudge0Config({ baseUrl: customBaseUrl.value.trim() });
	baseurlEditAllowed.value = false;
};

const handleApiKeyChange = () => {
	if (judge0ApiKey.value.trim() !== judge0Config.config.apiKey) {
		updateJudge0Config({ apiKey: judge0ApiKey.value });
	}
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