import NiceModal from "@ebay/nice-modal-react";
import { ChevronDown, PanelLeftClose } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import type { Guild } from "@/lib/client/entity/guild";
import { CreateChannelModal } from "./modal/create-channel-modal";
import { CreateInviteModal } from "./modal/invite-modal";
import { Button } from "./ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useSidebar } from "./ui/sidebar";

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
									onClick={() => {
										sidebar.setOpenMobile(false);
										NiceModal.show(CreateInviteModal, {
											guild,
										});
									}}
								>
									Invite
								</DropdownMenuItem>
								<DropdownMenuSeparator />
								<DropdownMenuItem
									onClick={() => {
										sidebar.setOpenMobile(false);
										NiceModal.show(CreateChannelModal, {
											guild,
										});
									}}
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
