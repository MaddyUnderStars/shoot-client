import { makeObservable, observable } from "mobx";
import type { ApiPublicUser } from "@/lib/http/types";
import { Actor } from "./actor";

export class PublicUser extends Actor implements ApiPublicUser {
	@observable summary: string;
	@observable display_name: string;

	constructor(opts: ApiPublicUser) {
		super(opts);

		this.summary = opts.summary;
		this.display_name = opts.display_name;

		makeObservable(this);
	}
}
