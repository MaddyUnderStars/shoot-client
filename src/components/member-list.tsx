import { useEffect, useState } from "react";
import type { MEMBERS_CHUNK } from "@/lib/client/common/receive";
import type { Channel } from "@/lib/client/entity/channel";
import type { Guild } from "@/lib/client/entity/guild";
import { getGatewayClient } from "@/lib/client/gateway";
import { splitQualifiedMention } from "@/lib/utils";
import { UserPopover } from "./popover/user-popover";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Popover, PopoverTrigger } from "./ui/popover";
import { Skeleton } from "./ui/skeleton";

export const MemberList = ({
	channel,
	guild,
}: {
	channel: Channel;
	guild?: Guild;
}) => {
	const [members, setMembers] = useState<MEMBERS_CHUNK["d"]["items"]>([]);

	useEffect(() => {
		const cb = (data: MEMBERS_CHUNK) => {
			setMembers(data.d.items);
		};

		const gw = getGatewayClient();

		gw.addListener("MEMBERS_CHUNK", cb);

		return () => {
			gw.removeListener("MEMBERS_CHUNK", cb);
		};
	}, []);

	useEffect(() => {
		const gw = getGatewayClient();

		gw.send({
			t: "members",
			range: [0, 100],
			channel_id: channel.mention,
		});
	}, [channel]);

	return (
		<div className="bg-sidebar w-sm border-l">
			<div className="flex flex-col gap-3.5 border-b p-4">Members</div>

			<div className="flex-1 flex flex-col gap-2 w-full">
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
								<div className="flex gap-2 p-1 hover:bg-black/20">
									<Avatar className="h-8 w-8 rounded-lg">
										<AvatarImage
											src={
												"https://www.freeiconspng.com/thumbs/profile-icon-png/profile-icon-9.png"
											}
											alt="Username"
										/>
										<AvatarFallback>
											<Skeleton className="h-8 w-8 rounded-full" />
										</AvatarFallback>
									</Avatar>

									<div className="grid flex-1 text-left text-sm leading-right">
										<span className="truncate font-medium">
											{x.name}
										</span>
										<span className="truncate font-xs">
											@
											{
												splitQualifiedMention(x.user_id)
													.domain
											}
										</span>
									</div>
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
