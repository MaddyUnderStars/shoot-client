import type { ActorMention } from "@/lib/client/common/actor";
import { getAppStore } from "@/lib/store/app-store";
import { ChannelsPageComponent } from "@/pages/channels";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/channel/$guildId/")({
	component: ChannelsPageComponent,
	params: {
		parse: ({ guildId }) => {
			// oxlint-disable-next-line typescript/no-unsafe-type-assertion
			if (!getAppStore().getGuild(guildId as ActorMention)) return false;
			return { guildId };
		},
	},
});
