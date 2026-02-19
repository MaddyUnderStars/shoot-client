import { PanelLeftDashed } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { SidebarTrigger } from "./ui/sidebar";

export const SettingsHeader = ({ children }: React.PropsWithChildren) => {
	const isMobile = useIsMobile();

	return (
		<div className="w-full bg-sidebar pt-[env(safe-area-inset-top)]">
			<div className="p-4 w-full border-b h-min">
				{!isMobile ? null : (
					<SidebarTrigger variant="ghost">
						<PanelLeftDashed />
					</SidebarTrigger>
				)}
				{children}
			</div>
		</div>
	);
};
