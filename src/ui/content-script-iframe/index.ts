import ui from "@nuxt/ui/vue-plugin";
import { createApp } from "vue";
import App from "./App.vue";
import "./index.css";

import { createPinia } from "pinia";
import { appRouter } from "./router";

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
