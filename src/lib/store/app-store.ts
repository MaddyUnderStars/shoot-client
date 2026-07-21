import { action, makeObservable, observable } from "mobx";
import type { ActorMention } from "../client/common/actor";
import type { DmChannel } from "../client/entity/dm-channel";
import type { Guild } from "../client/entity/guild";
import type { PrivateUser } from "../client/entity/private-user";
import type { Relationship } from "../client/entity/relationship";
import { ShootWebrtcClient } from "../client/webrtc";
import { SettingsStore } from "./settings-store";
import { UserStore } from "./user-store";

export class AppStore {
	user: PrivateUser | null = null;

	dmChannels: DmChannel[] = [];

	guilds: Guild[] = [];

	relationships: Relationship[] = [];

	webrtc?: ShootWebrtcClient = undefined;

	settings: SettingsStore = new SettingsStore();

	users = new UserStore();

	public startWebrtc = (channel: ActorMention, endpoint: URL, token: string) => {
		if (this.webrtc) {
			this.webrtc.leave();
		}

		const webrtc = new ShootWebrtcClient(channel, endpoint, token);
		this.webrtc = webrtc;

		return webrtc.login();
	};

	public stopWebrtc = () => {
		this.webrtc?.leave();
		this.webrtc = undefined;
	};

	constructor() {
		makeObservable(this, {
			user: observable,
			dmChannels: observable,
			guilds: observable,
			relationships: observable,
			webrtc: observable,
			settings: observable,
			users: observable,
			startWebrtc: action,
			stopWebrtc: action,
			setRelationships: action,
			setPrivateUser: action,
			addDmChannel: action,
			setDmChannels: action,
			setGuilds: action,
		});
	}

	public getGuild = (mention: ActorMention) => {
		return this.guilds.find((x) => x.mention === mention);
	};

	public findDmChannel = (users: ActorMention[]) => {
		return this.dmChannels.find((x) => {
			const arr = [x.owner, ...x.recipients];

			return arr.length === users.length && users.every((u) => arr.includes(u));
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

	public setRelationships = (relationships: Relationship[]) => {
		this.relationships = relationships;
	};

	public setPrivateUser = (user: PrivateUser) => {
		this.user = user;
	};

	addDmChannel = (channel: DmChannel) => {
		this.dmChannels.push(channel);
	};

	setDmChannels = (channels: DmChannel[]) => {
		this.dmChannels = channels;
	};
	setGuilds = (guilds: Guild[]) => {
		this.guilds = guilds;
	};
}

const appStore = new AppStore();

export const getAppStore = () => {
	return appStore;
};
