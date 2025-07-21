import type { ApiPublicGuildTextChannel } from "@/lib/http/types";
import { Channel } from "./channel";

type TGuildChannel = Omit<ApiPublicGuildTextChannel, "guild">;

export class GuildChannel extends Channel implements TGuildChannel {
	// @observable guild: Guild;

	constructor(opts: ApiPublicGuildTextChannel) {
		super(opts);
	}
}
