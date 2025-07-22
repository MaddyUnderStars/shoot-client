import NiceModal from "@ebay/nice-modal-react";
import { DropdownMenuGroup } from "@radix-ui/react-dropdown-menu";
import { ChevronDown, PanelLeftClose, PanelLeftDashed } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import type { Guild } from "@/lib/client/entity/guild";
import { CreateChannelModal } from "./modal/create-channel-modal";
import { CreateInviteModal } from "./modal/invite-modal";
import { Button } from "./ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { SidebarTrigger, useSidebar } from "./ui/sidebar";

export const ChannelListHeader = ({ guild }: { guild?: Guild }) => {
	const isMobile = useIsMobile();

	const sidebar = useSidebar();

	return (
		<div className="flex w-full items-center justify-between">
			<div className="text-foreground text-base font-medium flex-1 flex items-center">
				{isMobile ? (
					<Button
						variant="ghost"
						onClick={() => sidebar.setOpenMobile(false)}
					>
						<PanelLeftClose />
					</Button>
				) : null}

				{!guild ? (
					"Private Channels"
				) : (
					<DropdownMenu>
						<DropdownMenuTrigger className="w-full flex items-center justify-between">
							{guild.name}

							<ChevronDown size={16} />
						</DropdownMenuTrigger>

						<DropdownMenuContent className="w-60">
							<DropdownMenuGroup>
								<DropdownMenuItem
									onClick={() =>
										NiceModal.show(CreateInviteModal, {
											guild,
										})
									}
								>
									Invite
								</DropdownMenuItem>
								<DropdownMenuSeparator />
								<DropdownMenuItem
									onClick={() =>
										NiceModal.show(CreateChannelModal, {
											guild,
										})
									}
								>
									Create Channel
								</DropdownMenuItem>
								<DropdownMenuItem
									disabled
									variant="destructive"
								>
									Delete Guild
								</DropdownMenuItem>
							</DropdownMenuGroup>
						</DropdownMenuContent>
					</DropdownMenu>
				)}
			</div>
		</div>
	);
};
