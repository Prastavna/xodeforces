import {
	createRouter,
	createWebHistory,
	type RouteRecordRaw,
} from "vue-router";

const routes: RouteRecordRaw[] = [];

routes.push({
	path: "/:catchAll(.*)*",
	redirect: "/",
});

export const appRouter = createRouter({
	history: createWebHistory(),
	routes: routes,
});