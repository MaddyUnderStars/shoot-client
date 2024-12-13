import { shoot } from "../client";
import type { components } from "../http/generated/v1";

export type UserSchema = Omit<
	components["schemas"]["PublicUser"] & {
		email?: string;
	},
	"id"
>;

export class User implements UserSchema {
	name: string;
	summary: string;
	display_name: string;
	domain: string;
	email?: string;
	avatar?: string;

	public get mention() {
		return `${this.name}@${this.domain}`;
	}

	constructor(data: UserSchema) {
		this.name = data.name;
		this.summary = data.summary;
		this.display_name = data.display_name;
		this.domain = data.domain;
		this.email = data?.email;
		this.avatar = data?.avatar
			? `${shoot.instance!.http}media/${data.avatar}`
			: undefined;
		shoot.users.set(this.mention, this);
	}
}
