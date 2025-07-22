import { Hash, PanelLeftDashed } from "lucide-react";
import { useChannel } from "@/hooks/use-channel";
import { useIsMobile } from "@/hooks/use-mobile";
import { SidebarTrigger } from "./ui/sidebar";

export const ChannelHeader = () => {
	const channel = useChannel();
	const isMobile = useIsMobile();

	if (!channel) return undefined;

	return (
		<div className="p-4 bg-sidebar w-full border-b h-min">
			<h1>
				{!isMobile ? null : (
					<SidebarTrigger variant="ghost">
						<PanelLeftDashed />
					</SidebarTrigger>
				)}
				<Hash size={16} className="inline" /> {channel.name}
			</h1>
		</div>
	);
};
