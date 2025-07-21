import { createRouter, RouterProvider } from "@tanstack/react-router";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";

import "./index.css";

import { createGatewayClient, getGatewayClient } from "./lib/client/gateway";
import { getLogin } from "./lib/storage";
// Import the generated route tree
import { routeTree } from "./routeTree.gen";

// Create a new router instance
const router = createRouter({ routeTree, pathParamsAllowedCharacters: ["@"] });

// Register the router instance for type safety
declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}

// If we're logged in, connect to gateway
const login = getLogin();
if (login) {
	createGatewayClient(login);
	getGatewayClient().login();
}

// Render the app
// biome-ignore lint/style/noNonNullAssertion: .
const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
	const root = ReactDOM.createRoot(rootElement);
	root.render(
		<StrictMode>
			<RouterProvider router={router} />
		</StrictMode>,
	);
}
