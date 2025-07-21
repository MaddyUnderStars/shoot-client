import { createFileRoute } from "@tanstack/react-router";
import { ChannelsPageComponent } from "@/pages/channels";

export const Route = createFileRoute(
	"/_authenticated/channel/$guildId/{-$channelId}",
)({
	component: ChannelsPageComponent,
});
