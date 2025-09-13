import { Link } from "@tanstack/react-router";
import { Hash } from "lucide-react";
import { observer } from "mobx-react-lite";
import React from "react";
import { useGuild } from "@/hooks/use-guild";
import type { DmChannel } from "@/lib/client/entity/dm-channel";
import type { Guild } from "@/lib/client/entity/guild";
import type { GuildChannel } from "@/lib/client/entity/guild-channel";
import { getAppStore } from "@/lib/store/app-store";
import { ChannelListHeader } from "../channel-list-header";
import { NavUser } from "../nav-user";
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
	({ channel, guild }: { channel: GuildChannel | DmChannel; guild?: Guild }) => {
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
						<Hash size={14} />
					</Link>
				</SidebarMenuButton>
			</SidebarMenuItem>
		);
	},
);

const ChannelSidebarList = observer(() => {
	const guild = useGuild();
	const channels = guild ? guild.channels : getAppStore().dmChannels;

	return (
		<SidebarMenu>
			{/* render guild channels here, or private dm channels */}

			{channels.map((ch) => (
				<ChannelSidebarListItem channel={ch} guild={guild} key={ch.mention} />
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
