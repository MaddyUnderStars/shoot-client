import { useNavigate } from "@tanstack/react-router";
import { useUser } from "@/hooks/use-user";
import type { ActorMention } from "@/lib/client/common/actor";
import { getHttpClient } from "@/lib/http/client";
import { getAppStore } from "@/lib/store/app-store";
import { Button } from "../ui/button";
import { PopoverContent } from "../ui/popover";
import { UserComponent } from "../user";

export const UserPopover = ({ user: user_id }: { user: ActorMention }) => {
	const { $fetch } = getHttpClient();

	const app = getAppStore();
	const { user, error } = useUser(user_id);

	const navigate = useNavigate();

	const openDm = async () => {
		if (!app.user || !user) return; // hmm

		const existing = app.findDmChannel([app.user.mention, user_id]);
		if (existing) {
			return navigate({
				to: "/channel/$channelId",
				params: {
					channelId: existing.mention,
				},
			});
		}

		const { data, error } = await $fetch.POST("/users/{user_id}/channels/", {
			params: {
				path: {
					user_id,
				},
			},
			body: {
				name: `${user.display_name ?? user.name} & ${app.user.display_name ?? app.user.name}`,
			},
		});

		// TODO: better error handling. maybe a toast?
		if (error) throw new Error(error.message);

		navigate({
			to: "/channel/$channelId",
			params: {
				channelId: data.mention,
			},
		});
	};

	if (error || !user) return user_id;

	return (
		<PopoverContent className="p-0">
			<div className="p-4 text-white bg-purple-900 flex items-center gap-2">
				<UserComponent user_id={user_id} />
			</div>

			<div className="p-4 flex flex-col gap-2">
				<div>{user.summary}</div>

				<div>
					{app.user?.mention !== user.mention ? (
						<Button onClick={() => openDm()}>Open DM</Button>
					) : null}
				</div>
			</div>
		</PopoverContent>
	);
};
