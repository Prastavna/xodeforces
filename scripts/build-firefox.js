#!/usr/bin/env node

import { execSync } from 'child_process';
import { copyFileSync, writeFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, '..');
const distDir = resolve(rootDir, 'dist-firefox');

// Build with Vite
console.log('Building Firefox extension...');
execSync('vite build --config vite.firefox.config.ts', { 
  cwd: rootDir, 
  stdio: 'inherit' 
});

// Create manifest.json from Firefox config
console.log('Generating Firefox manifest...');
const { readFileSync } = await import('fs');
const packageJson = JSON.parse(readFileSync(resolve(rootDir, 'package.json'), 'utf8'));

const manifest = {
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
			js: ["src/content-script/index.js"],
			run_at: "document_end",
		},
	],
	content_security_policy:
		"script-src 'self' http://localhost:5173; worker-src 'self' http://localhost:5173; connect-src 'self' https://api.iconify.design https://api.simplesvg.com ws://localhost:5173 http://localhost:5173; object-src 'self'; style-src 'self' 'unsafe-inline';",
	web_accessible_resources: [
		"src/ui/content-script-iframe/index.html",
		"src/ui/content-script-iframe/index.js", 
		"src/ui/content-script-iframe/index.css",
		"*.worker.js",
		"monaco-editor/**/*",
		"assets/*",
		"*.js",
		"*.css",
		"*.ttf",
		"iframe*.js",
		"iframe*.css"
	],
	applications: {
		gecko: {
			id: "xodeforces@prastavna.com",
			strict_min_version: "109.0",
		},
	},
};

writeFileSync(
  resolve(distDir, 'manifest.json'),
  JSON.stringify(manifest, null, 2)
);

// Copy icons
console.log('Copying icons...');
const publicDir = resolve(rootDir, 'public');
const icons = ['icon16.png', 'icon32.png', 'icon48.png', 'icon128.png'];

for (const icon of icons) {
  const srcPath = resolve(publicDir, icon);
  const destPath = resolve(distDir, icon);
  if (existsSync(srcPath)) {
    copyFileSync(srcPath, destPath);
  }
}

console.log('Firefox extension built successfully in dist-firefox/');