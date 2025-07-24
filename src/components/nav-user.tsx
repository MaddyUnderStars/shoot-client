import { useNavigate } from "@tanstack/react-router";
import { Settings2 } from "lucide-react";
import { observer } from "mobx-react-lite";
import { getAppStore } from "@/lib/store/AppStore";
import { UserPopover } from "./popover/user-popover";
import { Popover, PopoverTrigger } from "./ui/popover";
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
					<Popover>
						<PopoverTrigger className="flex gap-2 items-center ">
							<UserComponent user={user} />
						</PopoverTrigger>
						<UserPopover user={user.mention} />
					</Popover>

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
