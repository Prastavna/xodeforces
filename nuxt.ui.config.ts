import type { NuxtUIOptions } from "@nuxt/ui/unplugin";

export const uiConfig: NuxtUIOptions = {
    ui: {
        popover: {
            slots: {
                content: 'z-5'
            }
        }   
    }
}
