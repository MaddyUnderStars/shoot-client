import { StrictMode } from "react";
import ReactDOM from "react-dom/client";

import { App } from "./app";
import { gatewayClient } from "./lib/client/gateway";
import { getLogin } from "./lib/storage";

import "./index.css";

// If we're logged in, connect to gateway
const login = getLogin();
if (login) {
	gatewayClient.login(login);
}

// Render the app
// biome-ignore lint/style/noNonNullAssertion: .
const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
	const root = ReactDOM.createRoot(rootElement);
	root.render(
		<StrictMode>
			<App />
		</StrictMode>,
	);
}
