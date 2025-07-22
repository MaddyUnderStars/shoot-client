import { PanelLeftDashed } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { SidebarTrigger } from "./ui/sidebar";

export const FriendsPane = () => {
	const isMobile = useIsMobile();

	return (
		<div>
			<div className="p-4 bg-sidebar w-full border-b h-min">
				<h1>
					{!isMobile ? null : (
						<SidebarTrigger variant="ghost">
							<PanelLeftDashed />
						</SidebarTrigger>
					)}
					Friends
				</h1>
			</div>
		</div>
	);
};
