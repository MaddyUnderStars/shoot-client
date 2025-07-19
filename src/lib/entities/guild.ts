import type { components } from "../http/generated/v1";
import { splitQualifiedMention } from "../util";
import { Channel } from "./channel";

export type GuildSchema = components["schemas"]["PublicGuild"];

export class Guild implements Omit<GuildSchema, "channels"> {
	public mention: string;

	public name: string;

	public channels: Channel[] = [];

	public get domain() {
		const { domain } = splitQualifiedMention(this.mention);
		return domain;
	}

	constructor(data: GuildSchema) {
		this.mention = data.mention;
		this.name = data.name;

		for (const ch of data.channels || []) {
			const channel = new Channel(ch, this);
			if (this.channels.find((x) => x.mention === channel.mention))
				continue;
			this.channels.push(channel);
		}
	}
}
