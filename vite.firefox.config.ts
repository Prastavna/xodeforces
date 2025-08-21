import { defineConfig, mergeConfig, UserConfig } from "vite";
import { resolve } from "path";
import baseConfig from "./vite.config";

const browser = "firefox";
const outDir = "dist";
const browserOutDir = `${outDir}/${browser}`;

// Define browser-specific configuration
export default defineConfig(() => {
	// Create browser-specific config without CRXJS (Firefox V2 not supported)
	const browserConfig: UserConfig = {
		build: {
			outDir: browserOutDir,
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
				},
			},
		},
		plugins: [],
	};

	// Merge with base config and return
	return mergeConfig(baseConfig, browserConfig);
});