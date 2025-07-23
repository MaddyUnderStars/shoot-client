import { action, makeObservable, observable } from "mobx";
import type { ActorMention } from "../client/common/actor";
import type { DmChannel } from "../client/entity/dm-channel";
import type { Guild } from "../client/entity/guild";
import type { PrivateUser } from "../client/entity/private-user";
import type { Relationship } from "../client/entity/relationship";

export class AppStore {
	@observable user: PrivateUser | null = null;

	@observable dmChannels: DmChannel[] = [];

	@observable guilds: Guild[] = [];

	@observable relationships: Relationship[] = [];

	constructor() {
		makeObservable(this);
	}

	public getGuild = (mention: ActorMention) => {
		return this.guilds.find((x) => x.mention === mention);
	};

	public getDmChannel = (mention: ActorMention) => {
		return this.dmChannels.find((x) => x.mention === mention);
	};

	public getChannel = (mention: ActorMention) => {
		const dm = this.getDmChannel(mention);
		if (dm) return dm;

		for (const guild of this.guilds) {
			const channel = guild.getChannel(mention);
			if (channel) return channel;
		}

		return undefined;
	};

	@action public setRelationships = (relationships: Relationship[]) => {
		this.relationships = relationships;
	};

	@action
	public setPrivateUser = (user: PrivateUser) => {
		this.user = user;
	};

	@action addDmChannel = (channel: DmChannel) => {
		this.dmChannels.push(channel);
	};

	@action setDmChannels = (channels: DmChannel[]) => {
		this.dmChannels = channels;
	};
	@action setGuilds = (guilds: Guild[]) => {
		this.guilds = guilds;
	};
}

const appStore = new AppStore();

export const getAppStore = () => {
	return appStore;
};
