import { createRouter, RouterProvider } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

const router = createRouter({
	routeTree,
	pathParamsAllowedCharacters: ["@"],
	basepath: import.meta.env.BASE_URL,
});

declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}

export const App = () => {
	return <RouterProvider router={router} />;
};
