import type { ManifestV3Export } from "@crxjs/vite-plugin";
import manifestConfig from "./manifest.config";

export default {
	...manifestConfig,
	// Optionally add Chrome-specific config here
} satisfies ManifestV3Export;