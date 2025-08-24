import ui from "@nuxt/ui/vue-plugin";
import { createApp } from "vue";
import App from "./App.vue";
import "./index.css";

import "monaco-editor/esm/vs/language/typescript/monaco.contribution";
import editorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker";
import cssWorker from "monaco-editor/esm/vs/language/css/css.worker?worker";
import htmlWorker from "monaco-editor/esm/vs/language/html/html.worker?worker";
import jsonWorker from "monaco-editor/esm/vs/language/json/json.worker?worker";
import tsWorker from "monaco-editor/esm/vs/language/typescript/ts.worker?worker";
import { createPinia } from "pinia";

import "./completions";
import "./hover-providers";
import "./language-configs";
import { appRouter } from "./router";

// Set up web workers for different language features
self.MonacoEnvironment = {
	getWorker(_, label) {
		if (label === "json") {
			return new jsonWorker();
		}
		if (label === "css" || label === "scss" || label === "less") {
			return new cssWorker();
		}
		if (label === "html" || label === "handlebars" || label === "razor") {
			return new htmlWorker();
		}
		if (label === "typescript" || label === "javascript") {
			return new tsWorker();
		}
		return new editorWorker();
	},
};

appRouter.addRoute({
	path: "/",
	component: () => import("./pages/Home.vue"),
});

appRouter.addRoute({
	path: "/settings",
	component: () => import("./pages/Settings/index.vue"),
});

const app = createApp(App).use(ui).use(createPinia()).use(appRouter);

app.mount("#app");

self.onerror = (message, source, lineno, colno, error) => {
	console.info("Error: " + message);
	console.info("Source: " + source);
	console.info("Line: " + lineno);
	console.info("Column: " + colno);
	console.info("Error object: " + error);
};
