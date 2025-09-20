import {
	createBrowserHistory,
	createHashHistory,
	createRouter,
	RouterProvider,
} from "@tanstack/react-router";
import { observer } from "mobx-react-lite";
import type React from "react";
import { getAppStore } from "./lib/store/app-store";
import { routeTree } from "./routeTree.gen";

const history = import.meta.env.VITE_USE_HASH_ROUTER ? createHashHistory() : createBrowserHistory();

const router = createRouter({
	history,
	routeTree,
	pathParamsAllowedCharacters: ["@"],
	basepath: import.meta.env.BASE_URL,
});

declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}

export const App = observer(() => {
	const density = getAppStore().settings.ui_density;

	return (
		<div style={{ "--spacing": `${density}rem` } as React.CSSProperties}>
			<RouterProvider router={router} />
		</div>
	);
});
