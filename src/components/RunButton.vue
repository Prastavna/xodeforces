<template>
  <UButton
    :loading="isRunning"
    :disabled="disabled || !canRun"
    @click="handleRun"
    :color="buttonColor"
    variant="ghost"
    size="sm"
    :icon="buttonIcon"
  >
    {{ buttonText }}
  </UButton>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface Props {
	isRunning?: boolean;
	disabled?: boolean;
	hasJudge0Config?: boolean;
	hasCode?: boolean;
	error?: string | null;
}

type Emits = (e: "run") => void;

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const canRun = computed(() => {
	return props.hasJudge0Config && props.hasCode;
});

const buttonColor = computed(() => {
	if (props.isRunning) return "secondary";
	if (!props.hasJudge0Config) return "error";
	if (props.error) return "error";
	return "primary";
});

const buttonIcon = computed(() => {
	if (props.isRunning) return "i-heroicons-arrow-path";
	if (!props.hasJudge0Config) return "i-heroicons-cog-6-tooth";
	if (props.error) return "i-heroicons-exclamation-triangle";
	return "i-heroicons-play";
});

const buttonText = computed(() => {
	if (props.isRunning) return "Running...";
	if (!props.hasJudge0Config) return "Configure Judge0";
	if (!props.hasCode) return "No Code";
	return "Run Code";
});

const handleRun = () => {
	if (!canRun.value) return;
	emit("run");
};
</script>