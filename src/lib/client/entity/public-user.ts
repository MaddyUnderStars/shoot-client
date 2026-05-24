import { makeObservable, observable } from "mobx";
import type { ApiPublicUser } from "@/lib/http/types";
import { Actor } from "./actor";

export class PublicUser extends Actor implements ApiPublicUser {
	summary: string;
	display_name: string;
	banner?: string;
	avatar: string;

	constructor(opts: ApiPublicUser) {
		super(opts);

		this.summary = opts.summary;
		this.display_name = opts.display_name;
		this.avatar =
			opts.avatar ||
			"https://www.freeiconspng.com/thumbs/profile-icon-png/profile-icon-9.png";
		this.banner = opts.banner;

		makeObservable(this, {
			summary: observable,
			display_name: observable,
			banner: observable,
			avatar: observable,
		});
	}
}
