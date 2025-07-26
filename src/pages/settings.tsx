import { Link, useNavigate } from "@tanstack/react-router";
import { Mic, Palette, UserPen, XIcon } from "lucide-react";
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
import { getGatewayClient } from "@/lib/client/gateway";

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
										onClick={() =>
											sidebar.setOpenMobile(false)
										}
									>
										<UserPen />
										<span>Profile</span>
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
									to="/settings/theme"
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
									getGatewayClient().logout();
									navigate({ to: "/login" });
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
