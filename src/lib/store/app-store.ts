import { action, makeObservable, observable } from "mobx";
import type { ActorMention } from "../client/common/actor";
import type { DmChannel } from "../client/entity/dm-channel";
import type { Guild } from "../client/entity/guild";
import type { PrivateUser } from "../client/entity/private-user";
import type { Relationship } from "../client/entity/relationship";
import { ShootWebrtcClient } from "../client/webrtc";
import { SettingsStore } from "./settings-store";

export class AppStore {
	@observable user: PrivateUser | null = null;

	@observable dmChannels: DmChannel[] = [];

	@observable guilds: Guild[] = [];

	@observable relationships: Relationship[] = [];

	@observable webrtc?: ShootWebrtcClient = undefined;

	@observable settings: SettingsStore = new SettingsStore();

	@action
	public startWebrtc = (
		channel: ActorMention,
		endpoint: URL,
		token: string,
	) => {
		if (this.webrtc) {
			this.webrtc.leave();
		}

		const webrtc = new ShootWebrtcClient(channel, endpoint, token);
		this.webrtc = webrtc;

		webrtc.login();
	};

	@action public stopWebrtc = () => {
		this.webrtc?.leave();
		this.webrtc = undefined;
	};

	constructor() {
		makeObservable(this);
	}

	public getGuild = (mention: ActorMention) => {
		return this.guilds.find((x) => x.mention === mention);
	};

	public findDmChannel = (users: ActorMention[]) => {
		return this.dmChannels.find((x) => {
			const arr = [x.owner, ...x.recipients];

			return (
				arr.length === users.length &&
				arr.every((u) => users.includes(u))
			);
		});
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
