import { PanelLeftDashed } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { SidebarTrigger } from "./ui/sidebar";

export const SettingsHeader = ({ children }: React.PropsWithChildren) => {
	const isMobile = useIsMobile();

	return (
		<div className="w-full">
			<div className="p-4 bg-sidebar w-full border-b h-min">
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
