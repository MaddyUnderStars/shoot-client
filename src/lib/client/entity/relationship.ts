import { makeObservable, observable } from "mobx";
import type { RelationshipType } from "@/lib/http/generated/v1";
import type { ApiPrivateRelationship } from "@/lib/http/types";
import { PublicUser } from "./public-user";

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
