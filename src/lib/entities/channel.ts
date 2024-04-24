import { components } from "../http/generated/v1";

export type ChannelSchema = components["schemas"]["PublicChannel"];

// export type MessageSendOptions = Message | string;

// export type MessageFetchOptions = Partial<Omit<
// paths["/channel/{channel_id}/messages/"]["get"]["parameters"]["path"],
// "channel_id"
// >>;

export class Channel implements ChannelSchema {
	public id: string;
	public name: string;
	public domain: string;

	
	get mention() {
		return `${this.id}@${this.domain}`;
	}

	constructor(data: ChannelSchema) {
		this.id = data.id;
		this.name = data.name;
		this.domain = data.domain;
	}
}