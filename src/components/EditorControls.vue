<template>
    <div class="controls h-12 flex items-center justify-between">
        <div class="flex items-center gap-2">
            <label>
                Language:
                <USelectMenu
                    class="w-48"
                    :modelValue="props.language" 
                    arrow
                    :items="Object.keys(Languages)"
                    @update:modelValue="emit('languageChange', $event)"
                />
            </label>

            <label>
                Theme:
                <USelectMenu
                    class="w-32"
                    :modelValue="props.theme"
                    arrow
                    :items="['vs', 'vs-dark', 'hc-black']"
                    @update:modelValue="emit('themeChange', $event)"
                    />
            </label>
        </div>

        <div class="flex items-center gap-2 mr-4">
            <UButton @click="clearEditor" variant="ghost" color="error" icon="heroicons:trash" />
        </div>
    </div>
</template>


<script setup lang="ts">
const props = defineProps<{ language: Languages, theme: 'vs' | 'vs-dark' | 'hc-black' }>()

import { Languages } from '../constants/languages'

const emit = defineEmits(['clearEditor', 'languageChange', 'themeChange'])

const clearEditor = () => {
    emit('clearEditor')
}
</script>
