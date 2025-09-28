import { action, computed, observable } from "mobx";
import type { ActorMention } from "../client/common/actor";
import { PublicUser } from "../client/entity/public-user";
import { getHttpClient } from "../http/client";

export class UserStore {
	@observable
	private users: Map<ActorMention, PublicUser> = new Map();

	private promises: Map<ActorMention, ReturnType<UserStore["getUser"]>> = new Map();

	@computed
	public resolve = async (id: ActorMention) => {
		if (this.users.has(id)) return this.users.get(id) as PublicUser;

		if (this.promises.has(id)) return this.promises.get(id);

		const promise = this.getUser(id);
		this.promises.set(id, promise);

		const ret = await promise;

		this.promises.delete(id);

		return ret;
	};

	private getUser = async (user_id: ActorMention): Promise<PublicUser> => {
		if (!user_id) throw new Error("did not specify user_id");

		console.log(user_id);

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

	@action
	public setUser = <T extends PublicUser | null>(id: ActorMention, user: T) => {
		user ? this.users.set(id, user) : this.users.delete(id);
		return user;
	};
}
