import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { observer } from "mobx-react-lite";
import { getAppStore } from "@/lib/store/AppStore";
import { ThemeToggle } from "./theme-toggle";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "./ui/sidebar";

export const NavUser = observer(() => {
	const user = getAppStore().user;
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
				</SidebarMenuButton>
			</SidebarMenuItem>

			<SidebarMenuItem>
				{/* TODO: remove this from here. add it to settings */}
				<ThemeToggle />
			</SidebarMenuItem>
		</SidebarMenu>
	);
});
