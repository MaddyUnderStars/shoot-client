import NiceModal from "@ebay/nice-modal-react";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Link } from "@tanstack/react-router";
import { BowArrow, Plus } from "lucide-react";
import { observer } from "mobx-react-lite";
import React from "react";
import type { Guild } from "@/lib/client/entity/guild";
import { getAppStore } from "@/lib/store/app-store";
import { CreateGuildModal } from "../modal/create-guild-modal";
import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "../ui/sidebar";

const GuildSidebarListItem = React.memo(({ guild }: { guild: Guild }) => (
	<SidebarMenuItem>
		<SidebarMenuButton
			size="lg"
			asChild
			className="p-0 size-8 hover:rounded-sm rounded-lg transition-colors border flex justify-center items-center hover:bg-accent"
		>
			<Link
				to="/channel/$guildId/{-$channelId}"
				params={{
					guildId: guild.mention,
					channelId: guild.channels?.[0]?.mention,
				}}
			>
				<Avatar className="rounded-none">
					<AvatarImage />
					<AvatarFallback className="rounded-none">{guild.initials}</AvatarFallback>
				</Avatar>
			</Link>
		</SidebarMenuButton>
	</SidebarMenuItem>
));

const GuildsSidebarList = observer(() => {
	const guilds = getAppStore().guilds;

	return (
		<SidebarGroupContent>
			{guilds.map((guild) => (
				<SidebarMenu key={guild.mention} className="mt-[--spacing(2)]">
					<GuildSidebarListItem guild={guild} />
				</SidebarMenu>
			))}
		</SidebarGroupContent>
	);
});

export const GuildSidebar = observer(() => {
	const sidebar = useSidebar();

	return (
		<Sidebar
			collapsible="none"
			className="w-[calc(var(--sidebar-width-icon)+1px)]! border-r flex items-center"
		>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton
							size="lg"
							asChild
							className="p-0 size-8 hover:rounded-sm rounded-lg transition-[border-radius]"
						>
							<Link to="/channel/@me">
								<div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-full items-center justify-center">
									<BowArrow className="size-4" />
								</div>
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>

			<SidebarContent>
				<SidebarGroup className="pb-0 pt-0">
					<GuildsSidebarList />
				</SidebarGroup>

				<SidebarGroup>
					<SidebarGroupContent>
						{/* Extra buttons that are not guilds */}

						{/* add guild button */}
						<SidebarMenu>
							{/* not using shadcn button here because it adds too much styling */}
							<button
								type="button"
								onClick={() => {
									sidebar.setOpenMobile(false);
									NiceModal.show(CreateGuildModal);
								}}
								className="h-8 text-sm p-0 hover:rounded-sm rounded-lg transition-[border-radius] flex items-center justify-center bg-sidebar-primary text-sidebar-primary-foreground aspect-square size-full"
							>
								<Plus className="size-4" />
							</button>
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
		</Sidebar>
	);
});
