import { crx } from "@crxjs/vite-plugin";
import ui from "@nuxt/ui/vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";
import { defineConfig } from "vite";
import manifest from "./manifest.config.ts";

const IS_DEV = process.env.NODE_ENV === "development";
console.log(IS_DEV);

// https://vite.dev/config/
export default defineConfig({
	plugins: [
		vue(),
		ui(),
		crx({
			manifest,
		}),
	],
	optimizeDeps: {
		include: ["monaco-editor"],
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
		rollupOptions: {
			input: {
				iframe: resolve(__dirname, "src/ui/content-script-iframe/index.html"),
			},
		},
	},
});
