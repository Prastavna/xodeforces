<template>
  <div class="py-4 px-2 h-full overflow-y-auto">
    <div class="mb-6">
      <h2 class="text-xl font-semibold mb-2">Settings</h2>
      <p class="text-sm text-gray-600">Manage your settings/preferences here</p>
    </div>

    <div class="space-y-6">
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
              v-model="theme"
              @change="updateEditorConfig"
              :items="themeItems"
              value-attribute="value"
              label-attribute="label"
              class="w-full"
              icon="i-heroicons-paint-brush"
            />
          </div>
        </div>
      </div>

      <Snippets />
      <Judge0 />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useToast } from "@nuxt/ui/composables/useToast";
import { themes } from "../../../../constants/themes";
import { useEditorConfig } from "../../../../stores/editor-config";
import Judge0 from "./Judge0.vue";
import Snippets from "./Snippets.vue";

const toast = useToast();
const editorConfig = useEditorConfig();

const theme = ref(editorConfig.theme);
const tabSize = ref(editorConfig.tabSize);
const indentationType = ref<"spaces" | "tabs">(
	editorConfig.insertSpaces ? "spaces" : "tabs",
);

const tabSizeOptions = [
	{ value: 2, label: "2" },
	{ value: 4, label: "4" },
	{ value: 8, label: "8" },
];

const indentationOptions = [
	{ value: "spaces", label: "Spaces" },
	{ value: "tabs", label: "Tabs" },
];

const themeItems = Object.values(themes).map((theme) => ({
	value: theme.value,
	label: theme.label,
}));

const updateEditorConfig = () => {
	editorConfig.updateEditorConfig({
		tabSize: tabSize.value,
		indentationType: indentationType.value,
		theme: theme.value,
	});
	toast.add({
		title: "Editor settings updated",
		description: "Editor settings updated successfully",
		color: "success",
	});
};
</script>