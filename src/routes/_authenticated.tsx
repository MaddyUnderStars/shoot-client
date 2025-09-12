import { createFileRoute, Navigate, Outlet } from "@tanstack/react-router";
import { getLogin } from "@/lib/storage";

export const Route = createFileRoute("/_authenticated")({
	component: RouteComponent,
});

function RouteComponent() {
	const login = getLogin();

	if (!login) return <Navigate to="/login" replace={true} />;

	return <Outlet />;
}
