import { createHttpClient } from "../http";
import { components, paths } from "../http/generated/v1";
import { Message } from "./message";

export type ChannelSchema = components["schemas"]["PublicChannel"];

export type MessageSendOptions = Message | string;

export type MessageFetchOptions = Partial<
	Omit<
		paths["/channel/{channel_id}/messages/"]["get"]["parameters"]["path"],
		"channel_id"
	>
>;

export class Channel implements ChannelSchema {
	public id: string;
	public name: string;
	public domain: string;

	public messages = new Map<string, Message>();

	get mention() {
		return `${this.id}@${this.domain}`;
	}

	constructor(data: ChannelSchema) {
		this.id = data.id;
		this.name = data.name;
		this.domain = data.domain;
	}

	getMessages = async (opts: MessageFetchOptions) => {
		const { data, error } = await createHttpClient().GET(
			"/channel/{channel_id}/messages/",
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			//@ts-ignore
			{ params: { path: { channel_id: this.mention, ...opts } } },
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
}
