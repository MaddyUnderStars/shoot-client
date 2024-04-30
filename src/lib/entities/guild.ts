import { components } from "../http/generated/v1";
import { Channel } from "./channel";

export type GuildSchema = components["schemas"]["PublicGuild"]

export class Guild implements GuildSchema {
	public id: string;
	public name: string;
	public domain: string;

	public channels?: Channel[] = [];

	get mention() {
		return `${this.id}@${this.domain}`;
	}

	constructor(data: GuildSchema) {
		this.id = data.id;
		this.name = data.name;
		this.domain = data.domain;

		for (const ch of data.channels || []) {
			const channel = new Channel(ch)
			this.channels?.push(channel);
		}
	}
}