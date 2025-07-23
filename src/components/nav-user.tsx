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
import { UserComponent } from "./user";

export const NavUser = observer(() => {
	const user = getAppStore().user;

	const navigate = useNavigate();

	if (!user) return null;

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<SidebarMenuButton size="lg">
					<UserComponent user={user} />

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
