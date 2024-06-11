import { components } from "../http/generated/v1";
import { User } from "./user";

export type RelationshipSchema = components["schemas"]["PrivateRelationship"];

export enum RelationshipType {
	pending = 0,
	accepted = 1,
	blocked = 2,
}

export class Relationship {
	created: Date;
	user: User;
	type: RelationshipType;

	constructor(data: RelationshipSchema) {
		this.created = new Date(data.created);
		this.user = new User(data.user);
		this.type = data.type;
	}
}
