import NiceModal from "@ebay/nice-modal-react";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Link } from "@tanstack/react-router";
import { BowArrow, Hash, Plus } from "lucide-react";
import { observer } from "mobx-react-lite";
import { useGuild } from "@/hooks/use-guild";
import { getAppStore } from "@/lib/store/AppStore";
import { ChannelListHeader } from "./channel-list-header";
import { CreateGuildModal } from "./modal/create-guild-modal";
import { NavUser } from "./nav-user";
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
} from "./ui/sidebar";

const GuildSidebar = observer(() => {
	const guilds = getAppStore().guilds;

	return (
		<Sidebar
			collapsible="none"
			className="w-[calc(var(--sidebar-width-icon)+1px)]! border-r"
		>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton
							size="lg"
							asChild
							className="md:h-8 md:p-0"
						>
							<Link to="/channel/@me">
								<div className="bg-accent dark:bg-sidebar-primary dark:text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
									<BowArrow className="size-4" />
								</div>
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>

			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupContent className="px-1.5 md:px-0">
						{/* render guilds here */}

						{guilds.map((guild) => (
							<SidebarMenu key={guild.mention} className="mt-2">
								<SidebarMenuItem>
									<SidebarMenuButton
										size="lg"
										asChild
										className="h-8 p-0"
									>
										<Link
											to="/channel/$guildId/{-$channelId}"
											params={{
												guildId: guild.mention,
												channelId:
													guild.channels?.[0]
														?.mention,
											}}
										>
											<Avatar className="bg-accent dark:bg-sidebar-primary dark:text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
												<AvatarImage />
												<AvatarFallback>
													{guild.initials}
												</AvatarFallback>
											</Avatar>
										</Link>
									</SidebarMenuButton>
								</SidebarMenuItem>
							</SidebarMenu>
						))}
					</SidebarGroupContent>
				</SidebarGroup>

				<SidebarGroup>
					<SidebarGroupContent className="px-1.5 md:px-0">
						{/* Extra buttons that are not guilds */}

						{/* add guild button */}
						<SidebarMenu>
							<SidebarMenuButton
								size="lg"
								asChild
								className="h-8 p-0"
							>
								<button
									type="button"
									onClick={() =>
										NiceModal.show(CreateGuildModal)
									}
									className="bg-accent dark:bg-sidebar-primary dark:text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg"
								>
									<Plus className="size-4" />
								</button>
							</SidebarMenuButton>
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
		</Sidebar>
	);
});

const ChannelSidebar = observer(() => {
	const guild = useGuild();
	const channels = guild ? guild.channels : getAppStore().dmChannels;

	const sidebar = useSidebar();

	return (
		<Sidebar collapsible="none" className="flex-1 flex">
			<SidebarHeader className="gap-3.5 border-b p-4">
				<ChannelListHeader guild={guild} />
			</SidebarHeader>

			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupContent className="px-1.5 md:px-0">
						<SidebarMenu>
							{/* render guild channels here, or private dm channels */}

							{channels.map((channel) => (
								<SidebarMenuItem key={channel.mention}>
									<SidebarMenuButton>
										<Link
											to={
												guild
													? "/channel/$guildId/{-$channelId}"
													: "/channel/$channelId"
											}
											params={(prev) => ({
												...prev,
												channelId: channel.mention,
											})}
											className="flex flex-1 items-center justify-between"
											onClick={() =>
												sidebar.setOpenMobile(false)
											}
										>
											{channel.name}
											<Hash size={14} />
										</Link>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>

			<SidebarFooter>
				<NavUser />
			</SidebarFooter>
		</Sidebar>
	);
});

export const AppSidebar = ({
	...props
}: React.ComponentProps<typeof Sidebar>) => {
	return (
		<Sidebar
			collapsible="icon"
			className="overflow-hidden *:data-[sidebar=sidebar]:flex-row"
			{...props}
		>
			<GuildSidebar />

			<ChannelSidebar />
		</Sidebar>
	);
};
