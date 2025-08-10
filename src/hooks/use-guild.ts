import { useParams } from "@tanstack/react-router";
import { isActorMention } from "../lib/client/common/actor";
import { getAppStore } from "../lib/store/app-store";

export const useGuild = () => {
	const { guildId } = useParams({
		strict: false,
	});

	if (!guildId) return undefined;

	if (!isActorMention(guildId)) throw new Error("Guild ID is not valid mention");

	return getAppStore().getGuild(guildId);
};
