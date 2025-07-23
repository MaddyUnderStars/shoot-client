import { createFileRoute } from "@tanstack/react-router";
import { SidebarProvider } from "@/components/ui/sidebar";
import { SettingsSidebar } from "@/pages/settings";

export const Route = createFileRoute("/settings/")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<SidebarProvider>
			<SettingsSidebar />
		</SidebarProvider>
	);
}
