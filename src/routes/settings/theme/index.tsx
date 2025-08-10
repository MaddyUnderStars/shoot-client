import { createFileRoute } from "@tanstack/react-router";
import { PanelLeftDashed } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { SettingsSidebar } from "@/pages/settings";

export const Route = createFileRoute("/settings/theme/")({
	component: RouteComponent,
});

function RouteComponent() {
	const { setTheme } = useTheme();
	const isMobile = useIsMobile();

	return (
		<SidebarProvider>
			<SettingsSidebar />

			<div className="w-full">
				<div className="w-full">
					<div className="p-4 bg-sidebar w-full border-b h-min">
						{!isMobile ? null : (
							<SidebarTrigger variant="ghost">
								<PanelLeftDashed />
							</SidebarTrigger>
						)}
						Look and Feel
					</div>
				</div>

				<div className="p-4">
					<Label>Theme</Label>

					<div className="flex gap-2 mt-2">
						<Button onClick={() => setTheme("light")}>Light</Button>
						<Button onClick={() => setTheme("dark")}>Dark</Button>
						<Button onClick={() => setTheme("system")}>System</Button>
					</div>
				</div>
			</div>
		</SidebarProvider>
	);
}
