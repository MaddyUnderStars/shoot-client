import { ChannelsPageComponent } from "@/pages/channels";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/channel/$guildId/$channelId/")({
	component: ChannelsPageComponent,
});
