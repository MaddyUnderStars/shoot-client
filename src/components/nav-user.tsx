import { useNavigate } from "@tanstack/react-router";
import { Phone, Settings2, Signal } from "lucide-react";
import { observer } from "mobx-react-lite";
import { GuildChannel } from "@/lib/client/entity/guild-channel";
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

export const NavUser = observer(() => {
	const app = getAppStore();
	const user = app.user;
	const webrtc = app.webrtc;

	const navigate = useNavigate();

	if (!user) return null;

	return (
		<SidebarMenu>
			{webrtc ? (
				<SidebarMenuItem className="flex items-center">
					<SidebarMenuButton size="lg">
						<div className="flex flex-1 gap-2 items-center">
							<Signal size={14} className="text-green-700 w-8" />
							<div className="flex flex-col">
								<span className="text-sm">
									{webrtc.channel.name}
								</span>
								<span>
									{webrtc.channel instanceof GuildChannel
										? webrtc.channel.getGuild.name
										: ""}
								</span>
							</div>
						</div>
					</SidebarMenuButton>

					<SidebarMenuSub className="m-0">
						<SidebarMenuSubButton onClick={() => app.stopWebrtc()}>
							<Phone size={14} className="rotate-135" />
						</SidebarMenuSubButton>
					</SidebarMenuSub>
				</SidebarMenuItem>
			) : null}

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
							<Settings2 />
						</SidebarMenuSubButton>
					</SidebarMenuSubItem>
				</SidebarMenuSub>
			</SidebarMenuItem>
		</SidebarMenu>
	);
});
