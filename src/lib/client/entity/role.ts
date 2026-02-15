import { makeObservable, observable } from "mobx";
import type { ApiPublicRole } from "@/lib/http/types";

export class Role implements ApiPublicRole {
	@observable id: string;
	@observable name: string;
	@observable allow: number[];
	@observable deny: number[];
	@observable
	guild: `${string}@${string}`;
	position: number;

	constructor(opts: ApiPublicRole) {
		this.id = opts.id;
		this.name = opts.name;
		this.allow = opts.allow;
		this.deny = opts.deny;
		this.guild = opts.guild;
		this.position = opts.position;

		makeObservable(this);
	}
}
