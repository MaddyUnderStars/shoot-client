import { Link } from "@tanstack/react-router";
import { Hash, PhoneCall } from "lucide-react";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { useGuild } from "@/hooks/use-guild";
import type { ActorMention } from "@/lib/client/common/actor";
import type { VOICE_JOIN, VOICE_LEAVE, VOICE_STATE } from "@/lib/client/common/receive";
import type { DmChannel } from "@/lib/client/entity/dm-channel";
import type { Guild } from "@/lib/client/entity/guild";
import type { GuildChannel } from "@/lib/client/entity/guild-channel";
import { PublicUser } from "@/lib/client/entity/public-user";
import { gatewayClient } from "@/lib/client/gateway";
import { getAppStore } from "@/lib/store/app-store";
import { cn } from "@/lib/utils";
import { ChannelListHeader } from "../channel-list-header";
import { NavUser } from "../nav-user";
import { UserPopover } from "../popover/user-popover";
import { Popover, PopoverTrigger } from "../ui/popover";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "../ui/sidebar";

const ChannelSidebarListItem = React.memo(
	({
		channel,
		guild,
		voice,
	}: {
		channel: GuildChannel | DmChannel;
		guild?: Guild;
		voice?: PublicUser[];
	}) => {
		const sidebar = useSidebar();

		return (
			<SidebarMenuItem key={channel.mention}>
				<SidebarMenuButton>
					<Link
						to={guild ? "/channel/$guildId/{-$channelId}" : "/channel/$channelId"}
						params={(prev) => ({
							...prev,
							channelId: channel.mention,
						})}
						className="flex flex-1 items-center justify-between"
						onClick={() => sidebar.setOpenMobile(false)}
					>
						{channel.name}

						{voice?.length ? (
							<PhoneCall className="text-green-700" size={14} />
						) : (
							<Hash size={14} />
						)}
					</Link>
				</SidebarMenuButton>

				{!voice?.length ? null : (
					<ul className="p-2 ms-4">
						{voice?.map((user) => (
							<li
								key={user.mention}
								className={cn(
									"before:border-1 before:w-0.5 before:content-[''] before:absolute before:top-0 before:bottom-0 before:left-[-0.5rem]",
									"relative m-0 pb-4 pl-5 last:pb-0 first:pt-0",
								)}
							>
								<Popover>
									<PopoverTrigger className="cursor-pointer">
										{user.display_name}
									</PopoverTrigger>
									<UserPopover user={user.mention} />
								</Popover>
							</li>
						))}
					</ul>
				)}
			</SidebarMenuItem>
		);
	},
);

const ChannelSidebarList = observer(() => {
	const guild = useGuild();
	const channels = guild ? guild.channels : getAppStore().dmChannels;

	const [voiceState, setVoiceState] = useState<Record<ActorMention, Array<PublicUser>>>({});

	useEffect(() => {
		const stateCb = (data: VOICE_STATE) => {
			setVoiceState(
				Object.fromEntries(
					Object.entries(data.d.states).map(([channel, users]) => [
						channel,
						users.map((x) => new PublicUser(x)),
					]),
				),
			);
		};

		const joinCb = (data: VOICE_JOIN) => {
			setVoiceState((old) => {
				const channel = old[data.d.channel] ?? [];

				if (!channel.find((x) => x.mention === data.d.user.mention)) {
					channel.push(new PublicUser(data.d.user));
				}

				return {
					...old,
					[data.d.channel]: [...channel],
				};
			});
		};

		const leaveCb = (data: VOICE_LEAVE) => {
			setVoiceState((old) => {
				let channel = old[data.d.channel];
				if (!channel) return old;

				channel = channel.filter((x) => x.mention !== data.d.user);

				return {
					...old,
					[data.d.channel]: [...channel],
				};
			});
		};

		gatewayClient.addListener("VOICE_STATE", stateCb);
		gatewayClient.addListener("VOICE_JOIN", joinCb);
		gatewayClient.addListener("VOICE_LEAVE", leaveCb);

		return () => {
			gatewayClient.removeListener("VOICE_STATE", stateCb);
			gatewayClient.removeListener("VOICE_JOIN", joinCb);
			gatewayClient.removeListener("VOICE_LEAVE", leaveCb);
		};
	}, []);

	useEffect(() => {
		if (!guild) return;

		gatewayClient.send({
			t: "voices",
			guild: guild.mention,
		});
	}, [guild]);

	return (
		<SidebarMenu>
			{/* render guild channels here, or private dm channels */}

			{channels.map((ch) => (
				<ChannelSidebarListItem
					channel={ch}
					guild={guild}
					key={ch.mention}
					voice={voiceState[ch.mention] ?? []}
				/>
			))}
		</SidebarMenu>
	);
});

export const ChannelSidebar = observer(() => {
	const guild = useGuild();

	return (
		<Sidebar collapsible="none" className="flex-1 flex">
			<SidebarHeader className="gap-3.5 border-b p-2 h-14">
				<ChannelListHeader guild={guild} />
			</SidebarHeader>

			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupContent className="px-1.5 md:px-0">
						<ChannelSidebarList />
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>

			<SidebarFooter>
				<NavUser />
			</SidebarFooter>
		</Sidebar>
	);
});
