import type { components } from "../http";
import type { Channel } from "./channel";

export type MessageSchema = components["schemas"]["PublicMessage"];

export class Message implements Omit<MessageSchema, "published" | "updated"> {
	public id: string;
	public content: string;
	public author_id: string;
	public channel_id: string;

	public published: Date;
	public updated: Date;

	public channel?: Channel;
	// public author: User;

	constructor(data: MessageSchema) {
		this.id = data.id;
		this.content = data.content;
		this.author_id = data.author_id;
		this.channel_id = data.channel_id;

		this.published = new Date(data.published);
		this.updated = new Date(data.updated);

		// const channel = channels.get(data.channel_id);
		// if (channel) this.channel = channel;
	}

	public toString() {
		return `${this.channel ? `[${this.channel.mention}] ` : ""}${
			this.author_id
		} : ${this.content}`;
	}
}
