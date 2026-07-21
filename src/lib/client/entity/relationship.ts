import { makeObservable, observable } from "mobx";
import type { RelationshipType } from "@/lib/http/generated/v1";
import type { ApiPrivateRelationship } from "@/lib/http/types";
import { PublicUser } from "./public-user";

export class Relationship implements ApiPrivateRelationship {
	created: string;
	user: PublicUser;
	type: RelationshipType;

	constructor(opts: ApiPrivateRelationship) {
		this.created = opts.created;
		this.user = new PublicUser(opts.user);
		this.type = opts.type;

		makeObservable(this, {
			created: observable,
			user: observable,
			type: observable,
		});
	}
}
