import { action, computed, makeObservable, observable } from "mobx";
import type { ApiPublicGuild } from "@/lib/http/types";
import type { ActorMention } from "../common/actor";
import { Actor } from "./actor";
import { GuildChannel } from "./guild-channel";
import { Role } from "./role";

export class Guild extends Actor implements ApiPublicGuild {
	@observable
	channels: GuildChannel[];

	@observable roles: Role[];

	public getChannel = (mention: ActorMention) => {
		return this.channels.find((x) => x.mention === mention);
	};

	@action public addChannel = (channel: GuildChannel) => {
		this.channels.push(channel);
	};

	@computed public get initials() {
		return this.name
			.split(" ")
			.map((x) => x.charAt(0))
			.join("");
	}

	constructor(opts: ApiPublicGuild) {
		super(opts);

		this.channels = opts.channels?.map((x) => new GuildChannel(x, opts.mention)) ?? [];
		this.roles = opts.roles?.map((x) => new Role(x)) ?? [];

		makeObservable(this);
	}
}
