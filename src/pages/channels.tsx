import { SwipeBarProvider } from "@luciodale/swipe-bar";
import { ChatPane } from "@/components/chat-pane";
import { MemberList } from "@/components/member-list";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useChannel } from "@/hooks/use-channel";

export const ChannelsPageComponent = () => {
	const channel = useChannel();

	return (
		<SwipeBarProvider
			edgeActivationWidthPx={window.innerWidth / 3}
			sidebarWidthPx={window.innerWidth}
		>
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
		</SwipeBarProvider>
	);
};
