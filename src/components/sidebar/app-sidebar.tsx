import type React from "react";
import { Sidebar } from "../ui/sidebar";
import { ChannelSidebar } from "./channel-sidebar";
import { GuildSidebar } from "./guild-sidebar";

export const AppSidebar = ({ ...props }: React.ComponentProps<typeof Sidebar>) => {
	return (
		<Sidebar
			collapsible="icon"
			className="overflow-hidden *:data-[sidebar=sidebar]:flex-row"
			{...props}
		>
			<GuildSidebar />

			<ChannelSidebar />
		</Sidebar>
	);
};
