import { shoot } from "../client";
import type { components } from "../http/generated/v1";
import { splitQualifiedMention } from "../util";

// omitting nothing here makes the tooltip nicer? there's a better trick but I don't remember it
export type UserSchema = Omit<
	components["schemas"]["PublicUser"] &
		Partial<components["schemas"]["PrivateUser"]>,
	""
>;

export class User implements UserSchema {
	mention: string;
	name: string;
	summary: string;
	display_name: string;
	email?: string;

	public get domain() {
		const { domain } = splitQualifiedMention(this.mention);
		return domain;
	}

	constructor(data: UserSchema) {
		this.mention = data.mention;
		this.name = data.name;
		this.summary = data.summary;
		this.display_name = data.display_name;
		this.email = data?.email;
		shoot.users.set(this.mention, this);
	}
}
