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

// todo: https://web.dev/articles/push-notifications-subscribing-a-user

export const SettingsSidebar = () => {
	const sidebar = useSidebar();

	const navigate = useNavigate();

	return (
		<Sidebar>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupContent>
						<SidebarMenu>
							<SidebarMenuButton asChild>
								<Link
									to="/channel/@me"
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
			</SidebarContent>

			<SidebarFooter>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton asChild>
							<Button
								variant="destructive"
								onClick={() => {
									gatewayClient.logout();
									navigate({
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
