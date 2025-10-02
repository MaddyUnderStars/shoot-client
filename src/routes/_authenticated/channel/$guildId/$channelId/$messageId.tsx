/**
 * TODO: jumping to a specific message requires the ?around param
 * to be fixed on backend
 */

import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/channel/$guildId/$channelId/$messageId")({
	component: RouteComponent,
});

function RouteComponent() {
	const params = Route.useParams();

	return <Navigate to="/channel/$guildId/{-$channelId}" params={params}></Navigate>;
}
