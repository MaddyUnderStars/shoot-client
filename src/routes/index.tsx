import { createFileRoute, Navigate } from "@tanstack/react-router";
import { getLogin } from "@/lib/storage";

export const Route = createFileRoute("/")({
	component: IndexRoute,
});

const defaultRoute = import.meta.env.VITE_IS_MOBILE_TAURI
	? (window.localStorage.getItem("SAVED_LOCATION_HREF") ?? "/channel/@me")
	: "/channel/@me";

function IndexRoute() {
	const login = getLogin();
	return <Navigate to={login ? defaultRoute : "/login"} replace={true} />;
}
