import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { useNavigate } from "@tanstack/react-router";
import { Settings2 } from "lucide-react";
import { observer } from "mobx-react-lite";
import { getAppStore } from "@/lib/store/AppStore";
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
} from "./ui/sidebar";

export const NavUser = observer(() => {
	const user = getAppStore().user;

	const navigate = useNavigate();

	if (!user) return null;

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<SidebarMenuButton size="lg">
					<Avatar className="h-8 w-8 rounded-lg">
						<AvatarImage
							src={
								"https://www.freeiconspng.com/thumbs/profile-icon-png/profile-icon-9.png"
							}
							alt="Username"
						/>
						<AvatarFallback>PFP</AvatarFallback>
					</Avatar>

					<div className="grid flex-1 text-left text-sm leading-right">
						<span className="truncate font-medium">
							{user.display_name}
						</span>
						<span className="truncate font-xs">@{user.domain}</span>
					</div>

					<SidebarMenuSub className="m-0">
						<SidebarMenuSubItem>
							<SidebarMenuSubButton
								onClick={() =>
									navigate({ to: "/settings/theme" })
								}
							>
								<Settings2 />
							</SidebarMenuSubButton>
						</SidebarMenuSubItem>
					</SidebarMenuSub>
				</SidebarMenuButton>
			</SidebarMenuItem>
		</SidebarMenu>
	);
});
