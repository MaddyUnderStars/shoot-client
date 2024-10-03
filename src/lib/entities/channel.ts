import { action, observable } from "mobx";
import { shoot } from "../client";
import { createHttpClient } from "../http";
import type { components, paths } from "../http/generated/v1";
import type { Guild } from "./guild";
import { Message } from "./message";
import type { User } from "./user";

export type ChannelSchema = components["schemas"]["PublicChannel"] & {
	guild_id?: string;
} & { owner_id?: string; recipients?: string[] };

export type MessageSendOptions = Message | string;

export type MessageFetchOptions = Partial<
	paths["/channel/{channel_id}/messages/"]["get"]["parameters"]["query"]
>;

export class Channel {
	public id: string;
	public name: string;
	public domain: string;

	public guild?: Guild;

	public recipients?: User[];

	@observable messages = new Map<string, Message>();

	get mention() {
		return `${this.id}@${this.domain}`;
	}

	constructor(data: ChannelSchema, guild?: Guild) {
		this.id = data.id;
		this.name = data.name;
		this.domain = data.domain;
		this.guild = guild ?? shoot.guilds.find((x) => x.id == data.guild_id);
		this.recipients = data.recipients?.map((x) => shoot.users.get(x)!);

		if (this.guild) {
			if (!this.guild.channels.find((x) => x.mention === this.mention))
				this.guild.channels = [...this.guild.channels, this];
		}

		if (this.recipients)
			this.name =
				this.recipients.length > 1 ? this.name : this.recipients[0]!.name;
	}

	@action
	addMessage = (msg: Message) => {
		this.messages.set(msg.id, msg);
	};

	@action
	getMessages = async (opts: MessageFetchOptions) => {
		const { data, error } = await createHttpClient().GET(
			"/channel/{channel_id}/messages/",
			{
				params: {
					path: {
						channel_id: this.mention,
					},
					query: opts
				},
			},
		);

		if (!data) throw new Error("TODO: failed to load messages");
		if (error) throw new Error(error);

		const ret: Map<string, Message> = new Map();

		for (const curr of data) {
			const msg = new Message(curr);
			this.messages.set(msg.id, msg);
			ret.set(msg.id, msg);
		}

		return ret;
	};

	sendMessage = async (message: MessageSendOptions) => {
		const { data, error } = await createHttpClient().POST(
			"/channel/{channel_id}/messages/",
			{
				params: {
					path: { channel_id: this.mention },
				},
				body: {
					content: typeof message == "string" ? message : message.content,
				},
			},
		);

		if (error) throw error;

		this.addMessage(new Message(data));

		return data;
	};
}
