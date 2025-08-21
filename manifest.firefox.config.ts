import type { ManifestV3Export } from "@crxjs/vite-plugin";
import manifestConfig from "./manifest.config";

export default {
	...manifestConfig,
	// Firefox-specific overrides for Manifest V3
	background: {
		scripts: ["src/background/index.ts"],
		type: "module",
		persistent: false,
	},
	// @ts-expect-error
	browser_specific_settings: {
		gecko: {
		  id: "xodeforces@prastavna.com",
		},
	},
} satisfies ManifestV3Export;