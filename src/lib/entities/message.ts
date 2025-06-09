import { shoot } from "../client";
import type { components } from "../http/generated/v1";
import type { Channel } from "./channel";

export type MessageSchema = components["schemas"]["PublicMessage"];

export class Message implements Omit<MessageSchema, "published" | "updated"> {
	public id: string;
	public content: string;
	public author_id: string;
	public channel_id: string;

	public published: Date;
	public updated: Date;

	public channel: Channel | null = null;

	public files: {
		name: string;
		hash: string;
		type: string;
		size: number;
		width?: number | null;
		height?: number | null;
	}[];

	constructor(data: MessageSchema) {
		this.id = data.id;
		this.content = data.content;
		this.author_id = data.author_id;
		this.channel_id = data.channel_id;

		this.published = new Date(data.published);
		this.updated = new Date(data.updated);

		this.files = data.files;

		let channel = shoot.channels.get(data.channel_id);
		if (!channel) {
			for (const guild of shoot.guilds) {
				channel = guild.channels.find(
					(x) => x.mention === data.channel_id,
				);
				if (channel) break;
			}
		}
		if (channel) {
			this.channel = channel;
			this.channel.addMessage(this);
		}
	}
}
