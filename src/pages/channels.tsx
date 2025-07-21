import { AppSidebar } from "@/components/app-sidebar"
import { ChatPane } from "@/components/chat-pane"
import { SidebarProvider } from "@/components/ui/sidebar"

export const ChannelsPageComponent = () => {
	return <SidebarProvider
		style={
			{
				"--sidebar-width": "300px",
			} as React.CSSProperties
		}
	>
		<AppSidebar />

		<ChatPane />
	</SidebarProvider>
}