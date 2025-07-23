import { AppSidebar } from "@/components/app-sidebar";
import { ChatPane } from "@/components/chat-pane";
import { MemberList } from "@/components/member-list";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useChannel } from "@/hooks/use-channel";

export const ChannelsPageComponent = () => {
	const channel = useChannel();

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

			{!channel ? null : <MemberList channel={channel} />}
		</SidebarProvider>
	);
};
