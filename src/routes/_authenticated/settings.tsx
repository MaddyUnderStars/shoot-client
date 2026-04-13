import { SwipeBarProvider } from "@luciodale/swipe-bar";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { SidebarProvider } from "@/components/ui/sidebar";
import { SettingsSidebar } from "@/pages/settings";

export const Route = createFileRoute("/_authenticated/settings")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<SwipeBarProvider
			edgeActivationWidthPx={window.innerWidth / 3}
			sidebarWidthPx={window.innerWidth}
		>
			<SidebarProvider>
				<SettingsSidebar />

				<div className="w-full">
					<Outlet />
				</div>
			</SidebarProvider>
		</SwipeBarProvider>
	);
}
