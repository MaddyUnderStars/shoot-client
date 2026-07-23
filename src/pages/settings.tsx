import { Link, useNavigate } from "@tanstack/react-router";
import { BellRing, KeyRound, Mic, Palette, UserPen, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "@/components/ui/sidebar";
import { gatewayClient } from "@/lib/client/gateway";
import { getAppStore } from "@/lib/store/app-store";
import { GuildIcon } from "@/components/ui/guild-icon";

export const SettingsSidebar = () => {
	const sidebar = useSidebar();

	const navigate = useNavigate();

	const guilds = getAppStore().guilds;

	const previousNav = localStorage.getItem("SAVED_LOCATION_HREF");

	return (
		<Sidebar>
			<SidebarContent className="pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
				<SidebarGroup>
					<SidebarGroupContent>
						<SidebarMenu>
							<SidebarMenuButton asChild>
								<Link
									to={previousNav ?? "/channel/@me"}
									onClick={() => sidebar.setOpenMobile(false)}
								>
									<XIcon />
									<span>Back</span>
								</Link>
							</SidebarMenuButton>
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>

				<SidebarGroup>
					<SidebarGroupLabel>Account</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							<SidebarMenuItem>
								<SidebarMenuButton asChild>
									<Link
										to="/settings/account/profile"
										onClick={() => sidebar.setOpenMobile(false)}
									>
										<UserPen />
										<span>Profile</span>
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>

							<SidebarMenuItem>
								<SidebarMenuButton asChild>
									<Link
										to="/settings/account/security"
										onClick={() => sidebar.setOpenMobile(false)}
									>
										<KeyRound />
										<span>Security</span>
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>

				<SidebarGroup>
					<SidebarGroupLabel>App</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							<SidebarMenuButton asChild>
								<Link
									to="/settings/app/theme"
									onClick={() => sidebar.setOpenMobile(false)}
								>
									<Palette />
									<span>Look and Feel</span>
								</Link>
							</SidebarMenuButton>
						</SidebarMenu>

						<SidebarMenu>
							<SidebarMenuButton asChild>
								<Link
									to="/settings/app/notifications"
									onClick={() => sidebar.setOpenMobile(false)}
								>
									<BellRing />
									<span>Notifications</span>
								</Link>
							</SidebarMenuButton>
						</SidebarMenu>

						<SidebarMenu>
							<SidebarMenuButton asChild>
								<Link
									to="/settings/voice/devices"
									onClick={() => sidebar.setOpenMobile(false)}
								>
									<Mic />
									<span>Voice</span>
								</Link>
							</SidebarMenuButton>
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>

				<SidebarGroup>
					<SidebarGroupLabel>Guilds</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{guilds.map((guild) => (
								<SidebarMenuButton asChild key={guild.mention}>
									<Link
										onClick={() => sidebar.setOpenMobile(false)}
										to="/settings/guild/$guildId"
										params={{ guildId: guild.mention }}
									>
										<GuildIcon guild={guild} />
										{guild.name}
									</Link>
								</SidebarMenuButton>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>

			<SidebarFooter className="mt-[env(safe-area-inset-top)]">
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton asChild>
							<Button
								variant="destructive"
								onClick={() => {
									gatewayClient.logout();
									void navigate({
										to: "/login",
									});
								}}
							>
								Logout
							</Button>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarFooter>
		</Sidebar>
	);
};
