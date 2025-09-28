import { makeObservable, observable } from "mobx";
import type { ApiPrivateRelationship } from "@/lib/http/types";
import { PublicUser } from "./public-user";

export enum RelationshipType {
	pending = 0,
	accepted = 1,
	blocked = 2,
}

export class Relationship implements ApiPrivateRelationship {
	@observable created: string;
	@observable user: PublicUser;
	@observable type: RelationshipType;

	constructor(opts: ApiPrivateRelationship) {
		this.created = opts.created;
		this.user = new PublicUser(opts.user);
		this.type = opts.type;

		makeObservable(this);
	}
}
