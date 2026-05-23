import { useEffect, useState } from "react";
import type { MEMBERS_CHUNK } from "@/lib/client/common/receive";
import type { Channel } from "@/lib/client/entity/channel";
import type { Guild } from "@/lib/client/entity/guild";
import { gatewayClient } from "@/lib/client/gateway";
import { UserPopover } from "./popover/user-popover";
import { Popover, PopoverTrigger } from "./ui/popover";
import { Sidebar } from "./ui/sidebar";
import { UserComponent } from "./user";
import { getAppStore } from "@/lib/store/app-store";
import { PublicUser } from "@/lib/client/entity/public-user";

export const MemberList = ({ channel, guild }: { channel: Channel; guild?: Guild }) => {
	const [members, setMembers] = useState<MEMBERS_CHUNK["d"]["items"]>([]);

	const { users } = getAppStore();

	useEffect(() => {
		const cb = (data: MEMBERS_CHUNK) => {
			for (const row of data.d.items) {
				if (typeof row === "string") continue;

				users.setUser(row.user.mention, new PublicUser(row.user));
			}

			setMembers(data.d.items);
		};

		gatewayClient.addListener("MEMBERS_CHUNK", cb);

		return () => {
			gatewayClient.removeListener("MEMBERS_CHUNK", cb);
		};
	}, []);

	useEffect(() => {
		gatewayClient.send({
			t: "members",
			range: [0, 100],
			channel_id: channel.mention,
		});
	}, [channel]);

	return (
		<Sidebar side={"right"}>
			<div className="bg-sidebar flex-1 border-l pt-[env(safe-area-inset-top)]">
				<div className="flex flex-col gap-3.5 border-b p-4 h-14">Members</div>

				<div className="flex-1 flex flex-col gap-2 w-full m-2">
					{members.map((x) => {
						if (typeof x === "string") {
							const role = guild?.roles.find((r) => r.id === x);
							if (!role) return null;

							return <div key={x}>{role.name}</div>;
						}

						return (
							<Popover key={x.user.mention}>
								<PopoverTrigger>
									<div className="text-white flex items-center gap-2">
										<UserComponent user_id={x.user.mention} />
									</div>
								</PopoverTrigger>
								<UserPopover user={x.user.mention} />
							</Popover>
						);
					})}
				</div>
			</div>
		</Sidebar>
	);
};
