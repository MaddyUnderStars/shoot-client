import { useParams } from "@tanstack/react-router";
import { isActorMention } from "@/lib/client/common/actor";
import { getAppStore } from "@/lib/store/app-store";
import { useGuild } from "./use-guild";

export const useChannel = () => {
	const { channelId } = useParams({
		strict: false,
	});
	const guild = useGuild();

	if (!channelId) return undefined;

	if (!isActorMention(channelId)) throw new Error("Channel ID is not valid mention");

	const app = getAppStore();

	if (!guild) return app.getDmChannel(channelId);

	return guild.getChannel(channelId);
};
