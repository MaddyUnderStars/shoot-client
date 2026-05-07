import { StrictMode } from "react";
import ReactDOM from "react-dom/client";

import { App } from "./app";
import { gatewayClient } from "./lib/client/gateway";
import { getLogin } from "./lib/storage";

import "./index.css";
import { getSupportedPush } from "./lib/notifications";
import { subscribeUnifiedPush } from "./lib/notifications/unifiedpush";
import { subscribeWebPush } from "./lib/notifications/webpush";
import { getAppStore } from "./lib/store/app-store";

// If we're logged in, connect to gateway
const login = getLogin();
if (login) {
	gatewayClient.login(login);

	if (getAppStore().settings.notifications.enabled) {
		// Resubscribe to notifications if there's enabled
		const supported = getSupportedPush();

		if (supported === "web") subscribeWebPush();
		else if (supported === "unifiedpush")
			subscribeUnifiedPush();
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
