<template>
  <UApp>
    <div class="pl-1 border-l-2 border-gray-300 h-full flex flex-col">
      <div class="flex border-b border-gray-200 justify-between">
        <div class="flex">
          <RouterLink 
            to="/"
            :class="['px-4 py-2 text-sm font-medium', $route.path === '/' ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-800']"
          >
            Editor
          </RouterLink>
          <RouterLink 
            to="/settings"
            :class="['px-4 py-2 text-sm font-medium', $route.path === '/settings' ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-800']"
          >
            Settings
          </RouterLink>
        </div>
        
        <div class="flex items-center space-x-3 px-4">
          <a 
            href="https://github.com/prastavna/xodeforces"
            target="_blank" 
            rel="noopener noreferrer"
            class="text-gray-600 hover:text-gray-800 text-sm"
            title="GitHub Repository"
          >
            GitHub
          </a>
          <a 
            href="https://github.com/prastavna/xodeforces/issues"
            target="_blank" 
            rel="noopener noreferrer"
            class="text-gray-600 hover:text-gray-800 text-sm"
            title="Report Issues"
          >
            Issues
          </a>
        </div>
      </div>
      
      <div class="flex-1 overflow-hidden">
        <RouterView />
      </div>
    </div>
  </UApp>
</template>

<script setup lang="ts">
import { useColorMode } from "@vueuse/core";
import { onMounted } from "vue";
import { useSnippetStore } from "../../stores/snippet-store";

const colorMode = useColorMode();
colorMode.value = "light";

const snippetStore = useSnippetStore();

onMounted(() => {
	snippetStore.loadSnippets();
});
</script>
