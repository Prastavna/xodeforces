<template>
  <div class="h-full flex flex-col bg-white border border-gray-200 rounded-lg">
    <div class="flex items-center justify-between px-3 py-2 border-b border-gray-200 bg-gray-50 rounded-t-lg">
      <div class="flex items-center gap-2">
        <UIcon name="i-heroicons-terminal-box-arrow" class="w-4 h-4 text-gray-600" />
        <h3 class="text-sm font-medium text-gray-700">Output</h3>
        <UBadge 
          v-if="result?.status"
          :label="statusInfo.name"
          :color="statusInfo.color"
          variant="soft"
          size="xs"
        />
      </div>
      <div class="flex items-center gap-2">
        <UButton
          v-if="result"
          @click="clearOutput"
				color="error"
          size="xs"
          variant="ghost" 
          icon="i-heroicons-trash"
        >
          Clear
        </UButton>
      </div>
    </div>
    
    <div class="flex-1 overflow-auto mb-6">
      <div v-if="isLoading" class="h-full flex items-center justify-center">
        <div class="text-center">
          <UIcon name="i-heroicons-arrow-path" class="w-6 h-6 animate-spin text-blue-500 mx-auto mb-2" />
          <p class="text-sm text-gray-600">Executing code...</p>
        </div>
      </div>
      
      <div v-else-if="error" class="h-full p-4">
        <div class="bg-red-50 border border-red-200 rounded-lg p-3">
          <div class="flex items-start gap-2">
            <UIcon name="i-heroicons-exclamation-triangle" class="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <h4 class="text-sm font-medium text-red-800">Execution Error</h4>
              <p class="text-sm text-red-700 mt-1">{{ error }}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div v-else-if="result" class="h-full">
        <div class="h-full">
          <div v-if="result && result.time" class="mb-4 p-3 border-b">
            <div class="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span class="text-gray-600">Status:</span>
                <UBadge 
                  :label="statusInfo.name"
                  :color="statusInfo.color"
                  variant="soft"
                  class="ml-2"
                />
              </div>
              <div>
                <span class="text-gray-600">Language:</span>
                <span class="ml-2">{{ languageName || 'Unknown' }}</span>
              </div>
              <div>
                <span class="text-gray-600">Time:</span>
                <span class="ml-2">{{ result.time }}s</span>
              </div>
              <div v-if="result.memory">
                <span class="text-gray-600">Memory:</span>
                <span class="ml-2">{{ formatMemory(result.memory) }}</span>
              </div>
            </div>
          </div>

          <div v-if="result.stdout" class="mb-4 p-3">
            <h5 class="text-xs font-medium text-gray-600 mb-2 uppercase tracking-wide">Standard Output</h5>
            <pre class="bg-gray-50 border rounded p-3 text-sm font-mono whitespace-pre-wrap">{{ result.stdout }}</pre>
          </div>
          
          <div v-if="result.stderr" class="mb-4 p-3">
            <h5 class="text-xs font-medium text-red-600 mb-2 uppercase tracking-wide">Standard Error</h5>
            <pre class="bg-red-50 border border-red-200 rounded p-3 text-sm font-mono whitespace-pre-wrap text-red-800">{{ result.stderr }}</pre>
          </div>
          
          <div v-if="result.compile_output" class="mb-4 p-3">
            <h5 class="text-xs font-medium text-yellow-600 mb-2 uppercase tracking-wide">Compile Output</h5>
            <pre class="bg-yellow-50 border border-yellow-200 rounded p-3 text-sm font-mono whitespace-pre-wrap text-yellow-800">{{ result.compile_output }}</pre>
          </div>
          
          
          <div v-if="!hasOutput" class="text-center py-8">
            <UIcon name="i-heroicons-document-text" class="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p class="text-sm text-gray-500">No output generated</p>
          </div>
        </div>
      </div>
      
      <div v-else class="h-full flex items-center justify-center">
        <div class="text-center">
          <UIcon name="i-heroicons-play" class="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p class="text-sm text-gray-500">Run your code to see output here</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { JUDGE0_STATUS_MAP } from "../constants/judge0";
import type { Judge0SubmissionResult } from "../services/judge0";

interface Props {
	result?: Judge0SubmissionResult | null;
	isLoading?: boolean;
	error?: string | null;
	languageName?: string;
}

type Emits = (e: "clear") => void;

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const statusInfo = computed(() => {
	if (!props.result?.status) {
		return { name: "Unknown", color: "gray" };
	}
	return (
		JUDGE0_STATUS_MAP[props.result.status.id] || {
			name: "Unknown",
			color: "gray",
		}
	);
});

const hasOutput = computed(() => {
	if (!props.result) return false;
	return !!(
		props.result.stdout ||
		props.result.stderr ||
		props.result.compile_output
	);
});

const formatMemory = (memory: number): string => {
	if (memory < 1024) {
		return `${memory} KB`;
	}
	return `${(memory / 1024).toFixed(2)} MB`;
};

const clearOutput = () => {
	emit("clear");
};
</script>
