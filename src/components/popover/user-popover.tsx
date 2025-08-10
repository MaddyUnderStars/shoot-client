import { useNavigate } from "@tanstack/react-router";
import type { ActorMention } from "@/lib/client/common/actor";
import { PublicUser } from "@/lib/client/entity/public-user";
import { getHttpClient } from "@/lib/http/client";
import { getAppStore } from "@/lib/store/app-store";
import { Button } from "../ui/button";
import { PopoverContent } from "../ui/popover";
import { UserComponent } from "../user";

export const UserPopover = ({ user: user_id }: { user: ActorMention }) => {
	const { $api, $fetch } = getHttpClient();

	const { data: apiUser, error } = $api.useQuery("get", "/users/{user_id}/", {
		params: {
			path: {
				user_id: user_id,
			},
		},
	});

	const navigate = useNavigate();
	const app = getAppStore();

	const openDm = async () => {
		if (!app.user) return; // hmm

		const existing = app.findDmChannel([app.user.mention, user.mention]);
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
					user_id: user.mention,
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

	if (error || !apiUser) return <p>Error</p>;

	const user = new PublicUser(apiUser);

	return (
		<PopoverContent className="p-0">
			<div className="p-4 bg-purple-900 flex items-center gap-2">
				<UserComponent user={user} />
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
