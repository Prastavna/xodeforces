import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { DEFAULT_JUDGE0_CONFIG } from "../constants/judge0";
import { type Judge0Config, Judge0Service } from "../services/judge0";
import { storage } from "../services/storage";

const STORAGE_KEY = "judge0-config";

export const useJudge0Config = defineStore("judge0-config", () => {
	const config = ref<Judge0Config>({ ...DEFAULT_JUDGE0_CONFIG });
	const isConnected = ref(false);
	const isLoading = ref(false);
	const error = ref<string | null>(null);

	const judge0Service = computed(() => new Judge0Service(config.value));
	const hasValidConfig = computed(
		() => !!config.value.baseUrl && !!config.value.apiKey,
	);

	const loadConfig = () => {
		try {
			const savedConfig = storage.local.get(STORAGE_KEY);
			if (savedConfig) {
				config.value = { ...DEFAULT_JUDGE0_CONFIG, ...JSON.parse(savedConfig) };
			}
		} catch (error) {
			console.error("Failed to load Judge0 config:", error);
			config.value = { ...DEFAULT_JUDGE0_CONFIG };
		}
	};

	const saveConfig = (newConfig: Partial<Judge0Config>) => {
		try {
			config.value = { ...config.value, ...newConfig };
			storage.local.set(STORAGE_KEY, JSON.stringify(config.value));
			error.value = null;
		} catch (error) {
			console.error("Failed to save Judge0 config:", error);
			throw new Error("Failed to save configuration");
		}
	};

	const testConnection = async (): Promise<boolean> => {
		if (!config.value.baseUrl) {
			error.value = "Base URL is required";
			return false;
		}

		isLoading.value = true;
		error.value = null;

		try {
			const service = new Judge0Service(config.value);
			const connected = await service.testConnection();
			isConnected.value = connected;

			if (!connected) {
				error.value = "Failed to connect to Judge0 API";
			}

			return connected;
		} catch (err) {
			isConnected.value = false;
			error.value =
				err instanceof Error ? err.message : "Connection test failed";
			return false;
		} finally {
			isLoading.value = false;
		}
	};

	const updateConfig = async (newConfig: Partial<Judge0Config>) => {
		saveConfig(newConfig);
		await testConnection();
	};

	const resetConfig = () => {
		config.value = { ...DEFAULT_JUDGE0_CONFIG };
		storage.local.remove(STORAGE_KEY);
		isConnected.value = false;
		error.value = null;
	};

	// Load config on store initialization
	loadConfig();

	return {
		config: computed(() => config.value),
		hasValidConfig,
		judge0Service,
		isConnected: computed(() => isConnected.value),
		isLoading: computed(() => isLoading.value),
		error: computed(() => error.value),
		loadConfig,
		saveConfig,
		testConnection,
		updateConfig,
		resetConfig,
	};
});
