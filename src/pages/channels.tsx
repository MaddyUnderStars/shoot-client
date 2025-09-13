import { ChatPane } from "@/components/chat-pane";
import { MemberList } from "@/components/member-list";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useChannel } from "@/hooks/use-channel";
import { useIsMobile } from "@/hooks/use-mobile";

export const ChannelsPageComponent = () => {
	const channel = useChannel();
	const isMobile = useIsMobile();

	return (
		<SidebarProvider
			style={
				{
					"--sidebar-width": "300px",
				} as React.CSSProperties
			}
		>
			<AppSidebar />

			<ChatPane />

			{!channel || isMobile ? null : <MemberList channel={channel} />}
		</SidebarProvider>
	);
};
