import ui from "@nuxt/ui/vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";
import { defineConfig } from "vite";

const IS_DEV = process.env.NODE_ENV === "development";
console.log(IS_DEV);

// https://vite.dev/config/
export default defineConfig({
	plugins: [
		vue(),
		ui(),
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
		outDir: "dist-firefox",
		rollupOptions: {
			input: {
				"content-script": resolve(__dirname, "src/content-script/index.ts"),
				"background": resolve(__dirname, "src/background/index.ts"),
				iframe: resolve(__dirname, "src/ui/content-script-iframe/index.html"),
			},
			output: {
				entryFileNames: (chunkInfo) => {
					const name = chunkInfo.name;
					if (name === "content-script") {
						return "src/content-script/index.js";
					}
					if (name === "background") {
						return "src/background/index.js";
					}
					return "[name]-[hash].js";
				},
				assetFileNames: (assetInfo) => {
					const fileName = assetInfo.names?.[0] || 'asset';
					if (fileName.endsWith('.html')) {
						return fileName;
					}
					return "[name]-[hash].[ext]";
				},
			},
		},
	},
});