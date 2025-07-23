import type { ApiPrivateRelationship } from "@/lib/http/types";
import { PublicUser } from "./public-user";

export const RelationshipTypeNames = {
	0: "Pending",
	1: "Accepted",
	2: "Blocked",
};

export class Relationship implements Omit<ApiPrivateRelationship, "user"> {
	created: string;
	user: PublicUser;
	type: 0 | 1 | 2;

	constructor(opts: ApiPrivateRelationship) {
		this.created = opts.created;
		this.user = new PublicUser(opts.user);
		this.type = opts.type;
	}
}
