import { Phone, PhoneMissed, Signal, XIcon } from "lucide-react";
import { observer } from "mobx-react-lite";
import { GuildChannel } from "@/lib/client/entity/guild-channel";
import { getAppStore } from "@/lib/store/app-store";
import {
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
} from "./ui/sidebar";

const FRIENDLY_NAME = {
	NotAllowedError: "Microphone access denied",
	NotFoundError: "Microphone not found",
	OverconstrainedError: "Device not supported",
	IceCandidateError: "Webrtc ICE candidate error",
} as Record<string, string>;

export const WebrtcControls = observer(() => {
	const app = getAppStore();
	const { webrtc } = app;

	if (!webrtc) return null;

	if (webrtc.error)
		return (
			<SidebarMenuItem className="flex items-center">
				<SidebarMenuButton size="lg">
					<div className="flex flex-1 gap-2 items-center">
						<PhoneMissed size={14} className="text-red-700 w-8" />
						<div className="flex flex-col">
							<span className="text-sm">{FRIENDLY_NAME[webrtc.error.name]}</span>
						</div>
					</div>
				</SidebarMenuButton>

				<SidebarMenuSub className="m-0">
					<SidebarMenuSubButton
						onClick={() => app.stopWebrtc()}
						className="flex items-center justify-center"
					>
						<XIcon size={14} />
					</SidebarMenuSubButton>
				</SidebarMenuSub>
			</SidebarMenuItem>
		);

	return (
		<SidebarMenuItem className="flex items-center">
			<SidebarMenuButton size="lg">
				<div className="flex flex-1 gap-2 items-center">
					<Signal size={14} className="text-green-700 w-8" />
					<div className="flex flex-col">
						<span className="text-sm">{webrtc.channel.name}</span>
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
					<Phone size={14} className="rotate-135 flex items-center justify-center" />
				</SidebarMenuSubButton>
			</SidebarMenuSub>
		</SidebarMenuItem>
	);
});
