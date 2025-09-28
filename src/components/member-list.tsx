import { useEffect, useState } from "react";
import type { MEMBERS_CHUNK } from "@/lib/client/common/receive";
import type { Channel } from "@/lib/client/entity/channel";
import type { Guild } from "@/lib/client/entity/guild";
import { gatewayClient } from "@/lib/client/gateway";
import { UserPopover } from "./popover/user-popover";
import { Popover, PopoverTrigger } from "./ui/popover";
import { UserComponent } from "./user";

export const MemberList = ({ channel, guild }: { channel: Channel; guild?: Guild }) => {
	const [members, setMembers] = useState<MEMBERS_CHUNK["d"]["items"]>([]);

	useEffect(() => {
		const cb = (data: MEMBERS_CHUNK) => {
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
		<div className="bg-sidebar w-sm border-l">
			<div className="flex flex-col gap-3.5 border-b p-4 h-14">Members</div>

			<div className="flex-1 flex flex-col gap-2 w-full m-2">
				{members.map((x) => {
					if (typeof x === "string") {
						const role = guild?.roles.find((r) => r.id === x);
						if (!role) return null;

						return <div key={x}>{role.name}</div>;
					}

					// TODO: cannot use existing UserComponent as gateway does not
					// send full user objects for MEMBERS_CHUNK
					// see: shoot#82
					return (
						<Popover key={x.user_id}>
							<PopoverTrigger>
								<div className="text-white flex items-center gap-2">
									<UserComponent user_id={x.user_id} />
								</div>
							</PopoverTrigger>
							<UserPopover user={x.user_id} />
						</Popover>
					);
				})}
			</div>
		</div>
	);
};
