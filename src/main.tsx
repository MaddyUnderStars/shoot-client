import React, { lazy, Suspense, useCallback } from "react";
import ReactDOM from "react-dom/client";
import ReactModal from "react-modal";
import { Channels } from "./routes/channels";
import "./index.css";
import { Fallback } from "./fallback";
import { Route, Router, Switch } from "wouter";
import { LoginStore } from "./lib/loginStore";
import { shoot } from "./lib/client";
import { useShootConnected } from "./lib/hooks";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// eslint-disable-next-line react-refresh/only-export-components
const Login = lazy(async () => ({
	default: (await import("./routes/login")).Login,
}));

// eslint-disable-next-line react-refresh/only-export-components
const Register = lazy(async () => ({
	default: (await import("./routes/register")).Register,
}));

const login = LoginStore.load();
if (login) shoot.login(login);

const queryClient = new QueryClient();

// eslint-disable-next-line react-refresh/only-export-components
const Container = () => {
	const loggedIn = useShootConnected();
	const hasToken = !!login;

	const voiceCallRef = useCallback((ref: HTMLAudioElement) => {
		if (ref) shoot.webrtc.voiceElement = ref;
	}, []);

	if (hasToken && !loggedIn) {
		return <Fallback />;
	}

	return (
		<Suspense fallback={<Fallback />}>
			<QueryClientProvider client={queryClient}>
				{/* biome-ignore lint/a11y/useMediaCaption: cannot generate captions for voice calls */}
				<audio autoPlay ref={voiceCallRef} />
				<Router>
					<Switch>
						<Route path="/login" component={() => <Login />} />
						<Route
							path="/register"
							component={() => <Register />}
						/>

						<Route
							path="/users/:user_id"
							component={() => <Channels />}
						/>

						<Route
							path="/channels/:channel_id"
							component={() => <Channels />}
						/>
						<Route
							path="/channels/:guild_id/:channel_id"
							component={() => <Channels />}
						/>

						<Route
							path="/channels/@me"
							component={() => <Channels />}
						/>

						<Route
							component={() => {
								if (!loggedIn) return <Login />;
								return <Channels />;
							}}
						/>
					</Switch>
				</Router>
			</QueryClientProvider>
		</Suspense>
	);
};

ReactModal.setAppElement("#root");

// biome-ignore lint/style/noNonNullAssertion: <explanation>
ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<Container />
	</React.StrictMode>,
);
