import packageJson from "./package.json";

export default {
	name: packageJson.name,
	version: packageJson.version,
	description: packageJson.description,
	manifest_version: 2,
	icons: {
		"16": "icon16.png",
		"32": "icon32.png",
		"48": "icon48.png",
		"128": "icon128.png",
	},
	permissions: ["https://codeforces.com/*"],
	content_scripts: [
		{
			all_frames: false,
			matches: [
				"https://codeforces.com/problemset/problem/*",
				"https://codeforces.com/contest/*/problem/*",
			],
			js: ["src/content-script/index.ts"],
			run_at: "document_end",
		},
	],
	// browser_action: {
	//     default_popup: "src/ui/action-popup/index.html"
	// },
	content_security_policy:
		"script-src 'self' http://localhost:5173; worker-src 'self' http://localhost:5173; connect-src 'self' https://api.iconify.design https://api.simplesvg.com ws://localhost:5173 http://localhost:5173; object-src 'self'; style-src 'self' 'unsafe-inline';",
	web_accessible_resources: [
		"src/ui/content-script-iframe/index.html",
		"src/ui/content-script-iframe/index.ts",
		"src/ui/content-script-iframe/index.css",
		"*.worker.js",
		"monaco-editor/**/*",
	],
	applications: {
		gecko: {
			id: "xodeforces@prastavna.com",
			strict_min_version: "109.0",
		},
	},
};