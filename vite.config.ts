import ui from "@nuxt/ui/vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";
import { defineConfig } from "vite";
import { uiConfig } from "./nuxt.ui.config";

const IS_DEV = process.env.NODE_ENV === "development";

// Base configuration shared between Chrome and Firefox
export default defineConfig({
	plugins: [vue(), ui(uiConfig)],
	optimizeDeps: {
		include: ["monaco-editor"],
	},
	worker: {
		format: "es",
		rollupOptions: {
			output: {
				entryFileNames: "[name].worker.js",
				chunkFileNames: "[name]-[hash].js",
			},
		},
	},
	server: {
		port: 5173,
		strictPort: true,
		hmr: {
			port: 5173,
		},
		cors: {
			origin: true, // Reflects the request origin
			methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
			allowedHeaders: ["*"],
			credentials: true,
			preflightContinue: false,
			optionsSuccessStatus: 204,
		},
		headers: {
			"Access-Control-Allow-Origin": "*",
			"Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
			"Access-Control-Allow-Headers": "*",
		},
	},
	build: {
		watch: IS_DEV ? {} : undefined,
		sourcemap: IS_DEV ? "inline" : false,
		chunkSizeWarningLimit: 1000,
		rollupOptions: {
			input: {
				iframe: resolve(__dirname, "src/ui/content-script-iframe/index.html"),
			},
		},
	},
});
