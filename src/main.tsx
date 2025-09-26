import { StrictMode } from "react";
import ReactDOM from "react-dom/client";

import { App } from "./app";
import { gatewayClient } from "./lib/client/gateway";
import { getLogin } from "./lib/storage";

import "./index.css";
import { subscribeNotifications } from "./lib/notifications";
import { getAppStore } from "./lib/store/app-store";

// If we're logged in, connect to gateway
const login = getLogin();
if (login) {
	gatewayClient.login(login);

	if (getAppStore().settings.notifications.enabled) {
		// Resubscribe to notifications if there's enabled
		subscribeNotifications();
	}
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
