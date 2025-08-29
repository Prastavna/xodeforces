import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { JUDGE0_LANGUAGE_MAP } from "../constants/judge0";
import type { Judge0SubmissionResult } from "../services/judge0";
import { useEditorConfig } from "./editor-config";
import { useJudge0Config } from "./judge0-config";

export const useExecutionStore = defineStore("execution", () => {
	const judge0Config = useJudge0Config();
	const editorConfig = useEditorConfig();

	const isRunning = ref(false);
	const result = ref<Judge0SubmissionResult | null>(null);
	const error = ref<string | null>(null);
	const customInput = ref("");

	const currentLanguageId = computed(() => {
		const language = editorConfig.language.toLowerCase();
		return JUDGE0_LANGUAGE_MAP[language];
	});

	const canExecute = computed(() => {
		return (
			judge0Config.hasValidConfig &&
			editorConfig.code.trim().length > 0 &&
			currentLanguageId.value !== undefined
		);
	});

	const executeCode = async (): Promise<void> => {
		if (!canExecute.value) {
			error.value = "Cannot execute: missing configuration or code";
			return;
		}

		if (!currentLanguageId.value) {
			error.value = `Language "${editorConfig.language}" is not supported by Judge0`;
			return;
		}

		isRunning.value = true;
		error.value = null;
		result.value = null;

		try {
			const submissionResult = await judge0Config.judge0Provider.executeCode(
				editorConfig.code,
				currentLanguageId.value,
				customInput.value || undefined,
			);

			result.value = submissionResult;

			// Check for execution errors
			if (submissionResult.status?.id === 6) {
				error.value = "Compilation Error";
			} else if (submissionResult.status?.id === 5) {
				error.value = "Time Limit Exceeded";
			} else if (
				submissionResult.status &&
				submissionResult.status.id >= 7 &&
				submissionResult.status.id <= 12
			) {
				error.value = "Runtime Error";
			} else if (submissionResult.status?.id === 13) {
				error.value = "Internal Error";
			} else if (submissionResult.status?.id === 4) {
				// Wrong Answer is not really an error in this context
				error.value = null;
			}
		} catch (err) {
			error.value = err instanceof Error ? err.message : "Execution failed";
			result.value = null;
		} finally {
			isRunning.value = false;
		}
	};

	const clearResult = () => {
		result.value = null;
		error.value = null;
	};

	const setCustomInput = (input: string) => {
		customInput.value = input;
	};

	return {
		// State
		isRunning: computed(() => isRunning.value),
		result: computed(() => result.value),
		error: computed(() => error.value),
		customInput,
		currentLanguageId,
		canExecute,

		// Actions
		executeCode,
		clearResult,
		setCustomInput,
	};
});
