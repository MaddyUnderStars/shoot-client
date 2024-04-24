import React from "react";
import ReactDOM from "react-dom/client";
import { Channels, Login } from "./routes";
import "./index.css";
import { Fallback } from "./fallback";
import { Redirect, Route, Router, Switch } from "wouter";
import { LoginStore } from "./lib/loginStore";
import { shoot } from "./lib";
import { useShootConnected } from "./lib/hooks";

const login = LoginStore.load();
if (login) shoot.login(login);

// eslint-disable-next-line react-refresh/only-export-components
const Container = () => {
	const loggedIn = useShootConnected();
	const hasToken = !!login;

	if (hasToken && !loggedIn) {
		return <Fallback />;
	}

	return (
		<Router>
			{!loggedIn ? (
				<Redirect to="/login" />
			) : (
				<Redirect to="/channels/@me" />
			)}

			<Switch>
				<Route path="/login" component={() => <Login />} />
				<Route path="/channels/:id" component={() => <Channels />} />

				<Route component={() => <Fallback />} />
			</Switch>
		</Router>
	);
};

// TODO: react-error-boundary
ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<Container />
	</React.StrictMode>,
);
