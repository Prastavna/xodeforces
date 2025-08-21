import { competitiveTemplates } from "./competitive-templates";

export const languages = {
	javascript: {
		label: "JavaScript",
		value: "javascript",
		sample: competitiveTemplates.javascript,
		extension: ".js",
		mime: "text/javascript",
	},
	typescript: {
		label: "TypeScript",
		value: "typescript",
		sample: `console.log("Hello World");`, // No competitive template available
		extension: ".ts",
		mime: "text/typescript",
	},
	python: {
		label: "Python",
		value: "python",
		sample: competitiveTemplates.python,
		extension: ".py",
		mime: "text/python",
	},
	java: {
		label: "Java",
		value: "java",
		sample: competitiveTemplates.java,
		extension: ".java",
		mime: "text/java",
	},
	csharp: {
		label: "C#",
		value: "csharp",
		sample: competitiveTemplates.csharp,
		extension: ".cs",
		mime: "text/csharp",
	},
	php: {
		label: "PHP",
		value: "php",
		sample: `<?php\necho "Hello World";\n?>`, // No competitive template available
		extension: ".php",
		mime: "text/php",
	},
	sql: {
		label: "SQL",
		value: "sql",
		sample: `SELECT * FROM users;`, // No competitive template available
		extension: ".sql",
		mime: "text/sql",
	},
	go: {
		label: "Go",
		value: "go",
		sample: competitiveTemplates.go,
		extension: ".go",
		mime: "text/go",
	},
	rust: {
		label: "Rust",
		value: "rust",
		sample: competitiveTemplates.rust,
		extension: ".rs",
		mime: "text/rust",
	},
	cpp: {
		label: "C++",
		value: "cpp",
		sample: competitiveTemplates.cpp,
		extension: ".cpp",
		mime: "text/cpp",
	},
	c: {
		label: "C",
		value: "c",
		sample: competitiveTemplates.c,
		extension: ".c",
		mime: "text/c",
	},
};
