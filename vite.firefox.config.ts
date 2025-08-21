import { crx } from "@crxjs/vite-plugin";
import { defineConfig, mergeConfig, UserConfig } from "vite";
import manifest from "./manifest.firefox.config";
import baseConfig from "./vite.config";

const browser = "firefox";
const outDir = "dist";
const browserOutDir = `${outDir}/${browser}`;

// Define browser-specific configuration
export default defineConfig(() => {
	// Create browser-specific config
	const browserConfig: UserConfig = {
		build: {
			outDir: browserOutDir,
		},
		plugins: [
			crx({
				manifest,
				browser,
				contentScripts: { injectCss: true },
			}),
		],
	};

	// Merge with base config and return
	return mergeConfig(baseConfig, browserConfig);
});