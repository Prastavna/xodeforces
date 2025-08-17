// Built-in Monaco themes
const builtInThemes = [
	{ label: "Light", value: "vs" },
	{ label: "Dark", value: "vs-dark" },
	{ label: "High Contrast Dark", value: "hc-black" },
	{ label: "High Contrast Light", value: "hc-light" },
];

// Local themes (downloaded from monaco-themes)
const localThemes = [
	{ label: "GitHub", value: "github" },
	{ label: "GitHub Dark", value: "github-dark" },
	{ label: "GitHub Light", value: "github-light" },
	{ label: "Monokai", value: "monokai" },
	{ label: "Dracula", value: "dracula" },
	{ label: "Solarized Dark", value: "solarized-dark" },
	{ label: "Solarized Light", value: "solarized-light" },
	{ label: "Tomorrow Night", value: "tomorrow-night" },
	{ label: "Tomorrow Night Blue", value: "tomorrow-night-blue" },
	{ label: "Oceanic Next", value: "oceanic-next" },
	{ label: "Nord", value: "nord" },
	{ label: "Night Owl", value: "night-owl" },
	{ label: "Cobalt2", value: "cobalt2" },
	{ label: "Twilight", value: "twilight" },
	{ label: "All Hallows Eve", value: "all-hallows-eve" },
	{ label: "Blackboard", value: "blackboard" },
	{ label: "Vibrant Ink", value: "vibrant-ink" },
];

export const themes = [...builtInThemes, ...localThemes];
