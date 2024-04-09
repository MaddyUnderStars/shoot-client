import { Message, http } from "..";
import type { components, paths } from "../http";

export type ChannelSchema = components["schemas"]["PublicChannel"];

export type MessageSendOptions = Message | string;

export type MessageFetchOptions = Partial<Omit<
paths["/channel/{channel_id}/messages/"]["get"]["parameters"]["path"],
"channel_id"
>>;

export class Channel implements ChannelSchema {
	public id!: string;
	public name!: string;
	public domain!: string;

	get mention() {
		return `${this.id}@${this.domain}`
	}

	messages = new Map<string, Message>();

	constructor(data: ChannelSchema) {
		this.id = data.id;
		this.name = data.name;
		this.domain = data.domain;
	}

	getMessages = async (opts: MessageFetchOptions) => {
		const raw = await http.GET("/channel/{channel_id}/messages/", {
			params: {
				//@ts-ignore
				path: {
					channel_id: this.mention,
					...opts,
				}
			}
		});

		if (!raw.data) throw new Error("failed to load");

		const ret: Map<string, Message> = new Map();

		for (var curr of raw.data) {
			const msg = new Message(curr);
			this.messages.set(msg.id, msg);
			// this.messages.update((value) => {
			// 	value.set(msg.id, msg);
			// 	return value;
			// })
			ret.set(msg.id, msg);
		}

		this.messages = this.messages;

		return ret;
	};

	send = async (message: MessageSendOptions) => {
		const content = typeof message == "string" ? message : message.content;

		await http.POST(`/channel/{channel_id}/messages/`, {
			params: {
				path: {
					channel_id: this.mention,
				},
			},
			body: {
				content,
			},
		});
	};
}