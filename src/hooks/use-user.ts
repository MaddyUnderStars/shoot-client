import { useEffect, useState } from "react";
import type { ActorMention } from "@/lib/client/common/actor";
import type { PublicUser } from "@/lib/client/entity/public-user";
import { getAppStore } from "@/lib/store/app-store";

export const useUser = (user_id: ActorMention) => {
	const [user, setUser] = useState<PublicUser>();
	const [error, setError] = useState<Error>();

	const app = getAppStore();

	useEffect(() => {
		setUser(undefined);
		setError(undefined);

		app.users
			.resolve(user_id)
			.then((res) => setUser(res))
			.catch((err) => setError(err));
	}, [user_id, app.users.resolve]);

	if (error || !user) return { error };

	return { user };
};
