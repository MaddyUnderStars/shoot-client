import { createFileRoute, Navigate } from "@tanstack/react-router";
import { getLogin } from "@/lib/storage";

export const Route = createFileRoute("/")({
	component: IndexRoute,
});

function IndexRoute() {
	const login = getLogin();
	return <Navigate to={login ? "/channel/@me" : "/login"} replace={true} />;
}
