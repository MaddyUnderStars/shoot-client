import { makeObservable, observable } from "mobx";
import type { ApiPrivateUser } from "@/lib/http/types";
import { PublicUser } from "./public-user";

export class PrivateUser extends PublicUser implements ApiPrivateUser {
	@observable email: string;

	constructor(opts: ApiPrivateUser) {
		super(opts);
		this.email = opts.email;

		makeObservable(this);
	}
}
