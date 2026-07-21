import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { SwipeBarProvider } from "@luciodale/swipe-bar";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/channel")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<SwipeBarProvider
			edgeActivationWidthPx={window.innerWidth / 3}
			sidebarWidthPx={window.innerWidth}
		>
			<SidebarProvider
				style={
					// oxlint-disable-next-line typescript/no-unsafe-type-assertion
					{
						"--sidebar-width": "300px",
					} as React.CSSProperties
				}
			>
				<AppSidebar />

				<Outlet />
			</SidebarProvider>
		</SwipeBarProvider>
	);
}
