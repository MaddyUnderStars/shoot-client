import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import ReactModal from "react-modal";
import { Channels, Login, Register } from "./routes";
import "./index.css";
import { Fallback } from "./fallback";
import { Route, Router, Switch, useLocation } from "wouter";
import { LoginStore } from "./lib/loginStore";
import { shoot } from "./lib";
import { useShootConnected } from "./lib/hooks";
import { WebrtcTest } from "./routes/webrtc";

const login = LoginStore.load();
if (login) shoot.login(login);

// eslint-disable-next-line react-refresh/only-export-components
const Container = () => {
	const loggedIn = useShootConnected();
	const hasToken = !!login;

	// const [location, setLocation] = useLocation();

	// useEffect(() => {
	// 	if (!loggedIn && location != "/login" && location != "/register")
	// 		setLocation("/login");
	// 	else setLocation("/channels/@me");
	// 	// eslint-disable-next-line react-hooks/exhaustive-deps
	// }, [loggedIn]);

	if (hasToken && !loggedIn) {
		return <Fallback />;
	}

	return (
		<>
			<Router>
				<Switch>
					<Route path="/login" component={() => <Login />} />
					<Route path="/register" component={() => <Register />} />

					<Route path="/webrtc" component={() => <WebrtcTest />} />

					<Route
						path="/channels/@me"
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

					<Route component={() => <Fallback />} />
				</Switch>
			</Router>
		</>
	);
};

ReactModal.setAppElement("#root");

// TODO: react-error-boundary
ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<Container />
	</React.StrictMode>,
);
