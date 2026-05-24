import { makeAutoObservable } from "mobx";
import type { ActorMention } from "../client/common/actor";
import { PublicUser } from "../client/entity/public-user";
import { getHttpClient } from "../http/client";

export class UserStore {
	private users: Map<ActorMention, PublicUser> = new Map();

	private promises: Map<ActorMention, ReturnType<UserStore["getUser"]>> = new Map();

	constructor() {
		makeAutoObservable(this);
	}

	public resolve = async (id: ActorMention) => {
		if (this.users.has(id)) return this.users.get(id)!;

		if (this.promises.has(id)) return this.promises.get(id);

		const promise = this.getUser(id);
		this.promises.set(id, promise);

		const ret = await promise;

		this.promises.delete(id);

		return ret;
	};

	public has = (id: ActorMention) => {
		return this.users.has(id);
	};

	private getUser = async (user_id: ActorMention): Promise<PublicUser> => {
		if (!user_id) throw new Error("did not specify user_id");

		const { $fetch } = getHttpClient();

		const { data, error } = await $fetch.GET("/users/{user_id}/", {
			params: {
				path: {
					user_id,
				},
			},
		});

		if (error || !data) throw new Error(error.message);

		const ret = new PublicUser(data);
		this.users.set(data.mention, ret);

		return ret;
	};

	public setUser = <T extends PublicUser | null>(id: ActorMention, user: T) => {
		if (user) this.users.set(id, user);
		else this.users.delete(id);

		return user;
	};
}
