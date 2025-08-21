import * as monaco from "monaco-editor";

// Theme file mapping
const themeFiles: Record<string, string> = {
	github: "github.json",
	"github-dark": "github-dark.json",
	"github-light": "github-light.json",
	monokai: "monokai.json",
	dracula: "dracula.json",
	"solarized-dark": "solarized-dark.json",
	"solarized-light": "solarized-light.json",
	"tomorrow-night": "tomorrow-night.json",
	"tomorrow-night-blue": "tomorrow-night-blue.json",
	"oceanic-next": "oceanic-next.json",
	nord: "nord.json",
	"night-owl": "night-owl.json",
	cobalt2: "cobalt2.json",
	twilight: "twilight.json",
	"all-hallows-eve": "all-hallows-eve.json",
	blackboard: "blackboard.json",
	"vibrant-ink": "vibrant-ink.json",
};

// Track loaded themes to avoid reloading
const loadedThemes = new Set<string>();

// Theme loader function using fetch approach
export const loadTheme = async (themeName: string) => {
	// Skip built-in Monaco themes
	if (["vs", "vs-dark", "hc-black", "hc-light"].includes(themeName)) {
		return;
	}

	// Skip if already loaded
	if (loadedThemes.has(themeName)) {
		return;
	}

	try {
		const fileName = themeFiles[themeName];
		if (!fileName) {
			console.warn(`Theme not found: ${themeName}`);
			return;
		}

		// Cross-browser compatible runtime URL getter
		const getRuntimeURL = (path: string): string => {
			if (typeof chrome !== "undefined" && chrome.runtime?.getURL) {
				return chrome.runtime.getURL(path);
			}
			// @ts-expect-error - Firefox browser API
			if (typeof browser !== "undefined" && browser.runtime?.getURL) {
				// @ts-expect-error
				return browser.runtime.getURL(path);
			}
			return window.location.origin;
		};

		const baseUrl = getRuntimeURL("");

		const themeUrl = `${baseUrl}/themes/${fileName}`;

		// Fetch the theme data
		const response = await fetch(themeUrl);
		if (!response.ok) {
			throw new Error(`HTTP ${response.status}: ${response.statusText}`);
		}

		const themeData = await response.json();

		// Define the theme in Monaco
		monaco.editor.defineTheme(themeName, themeData);
		loadedThemes.add(themeName);
	} catch (error) {
		console.error(`Failed to load theme '${themeName}':`, error);
	}
};

// Setup function - preload all themes
export const setupCustomThemes = async () => {
	const themeNames = Object.keys(themeFiles);
	const loadPromises = themeNames.map((themeName) => loadTheme(themeName));

	try {
		await Promise.all(loadPromises);
	} catch (error) {
		console.error("Error preloading themes:", error);
	}
};

// Debug function to check loaded themes
export const getLoadedThemes = () => {
	return Array.from(loadedThemes);
};
