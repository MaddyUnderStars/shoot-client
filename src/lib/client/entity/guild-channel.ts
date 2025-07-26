import { makeObservable, observable } from "mobx";
import type { ApiPublicGuildTextChannel } from "@/lib/http/types";
import { getAppStore } from "@/lib/store/app-store";
import type { ActorMention } from "../common/actor";
import { Channel } from "./channel";

export class GuildChannel extends Channel implements ApiPublicGuildTextChannel {
	private app = getAppStore();

	@observable
	public guild: ActorMention;

	public get getGuild() {
		const guild = this.app.getGuild(this.guild);
		if (!guild) throw new Error("guild channel has no guild?");
		return guild;
	}

	constructor(opts: ApiPublicGuildTextChannel, guild: ActorMention) {
		super(opts);
		this.guild = guild;

		makeObservable(this);
	}
}
