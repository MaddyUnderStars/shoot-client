import { useNavigate } from "@tanstack/react-router";
import { Settings2 } from "lucide-react";
import { observer } from "mobx-react-lite";
import { getAppStore } from "@/lib/store/app-store";
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
import { WebrtcControls } from "./webrtc-controls";

export const NavUser = observer(() => {
	const app = getAppStore();
	const user = app.user;

	const navigate = useNavigate();

	if (!user) return null;

	return (
		<SidebarMenu>
			<WebrtcControls />

			<SidebarMenuItem className="flex items-center">
				<SidebarMenuButton size="lg" asChild>
					<div>
						<Popover>
							<PopoverTrigger className="flex flex-1 gap-2 items-center ">
								<UserComponent user={user} />
							</PopoverTrigger>
							<UserPopover user={user.mention} />
						</Popover>
					</div>
				</SidebarMenuButton>

				<SidebarMenuSub className="m-0">
					<SidebarMenuSubItem>
						<SidebarMenuSubButton
							onClick={() => navigate({ to: "/settings/theme" })}
						>
							<Settings2 className="flex items-center justify-center" />
						</SidebarMenuSubButton>
					</SidebarMenuSubItem>
				</SidebarMenuSub>
			</SidebarMenuItem>
		</SidebarMenu>
	);
});
