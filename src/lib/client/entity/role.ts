import { makeObservable, observable } from "mobx";
import type { ApiPublicRole } from "@/lib/http/types";

export class Role implements ApiPublicRole {
	id: string;
	name: string;
	allow: number[];
	deny: number[];
	guild: `${string}@${string}`;
	position: number;

	constructor(opts: ApiPublicRole) {
		this.id = opts.id;
		this.name = opts.name;
		this.allow = opts.allow;
		this.deny = opts.deny;
		this.guild = opts.guild;
		this.position = opts.position;

		makeObservable(this, {
			id: observable,
			name: observable,
			allow: observable,
			deny: observable,
			guild: observable,
			position: observable,
		});
	}
}
