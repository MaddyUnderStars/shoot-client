import { shoot } from "../client";
import { components } from "../http/generated/v1";

export type UserSchema = components["schemas"]["PublicUser"] & {
	email?: string;
};

export class User implements UserSchema {
	name: string;
	summary: string;
	display_name: string;
	domain: string;
	email?: string;

	public get mention() {
		return `${this.name}@${this.domain}`;
	}

	constructor(data: UserSchema) {
		this.name = data.name;
		this.summary = data.summary;
		this.display_name = data.display_name;
		this.domain = data.domain;
		this.email = data?.email;
		shoot.users.set(this.mention, this);
	}
}
