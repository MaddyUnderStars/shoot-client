import type { components } from "../http";

export type UserSchema = components["schemas"]["PublicUser"] &
	Partial<components["schemas"]["PrivateUser"]>;

export class User implements UserSchema {
	public name!: string;
	public summary!: string;
	public display_name!: string;
	public domain!: string;
	public email?: string;

	constructor(data: UserSchema) {
		this.name = data.name;
		this.summary = data.summary;
		this.display_name = data.display_name;
		this.domain = data.domain;
		this.email = data.email;
	}
}