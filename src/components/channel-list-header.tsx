import NiceModal from "@ebay/nice-modal-react";
import { ChevronDown } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import type { Guild } from "@/lib/client/entity/guild";
import { CreateChannelModal } from "./modal/create-channel-modal";
import { DeleteGuildModal } from "./modal/delete-guild-modal";
import { CreateInviteModal } from "./modal/invite-modal";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { SidebarTrigger, useSidebar } from "./ui/sidebar";
import { Link } from "@tanstack/react-router";

export const ChannelListHeader = ({ guild }: { guild?: Guild }) => {
	const isMobile = useIsMobile();

	const sidebar = useSidebar();

	return (
		<div className="flex p-2 h-full w-full items-center justify-between">
			<div className="text-foreground text-base font-medium flex-1 flex items-center">
				{isMobile ? <SidebarTrigger /> : null}

				{!guild ? (
					"Private Channels"
				) : (
					<DropdownMenu>
						<DropdownMenuTrigger className="w-full flex items-center justify-between">
							<div className="flex flex-col items-start">
								<span>{guild.name}</span>
								<span className="text-xs truncate max-w-50">{guild.summary}</span>
							</div>

							<ChevronDown size={16} />
						</DropdownMenuTrigger>

						<DropdownMenuContent className="w-60">
							<DropdownMenuGroup>
								<DropdownMenuItem
									onClick={() => {
										sidebar.setOpenMobile(false);
										void NiceModal.show(CreateInviteModal, {
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
										void NiceModal.show(CreateChannelModal, {
											guild,
										});
									}}
								>
									Create Channel
								</DropdownMenuItem>
								<DropdownMenuItem asChild>
									<Link
										to="/settings/guild/$guildId"
										params={{ guildId: guild.mention }}
									>
										Guild Settings
									</Link>
								</DropdownMenuItem>
								<DropdownMenuItem
									variant="destructive"
									onClick={() => {
										sidebar.setOpenMobile(false);
										void NiceModal.show(DeleteGuildModal, {
											guild,
										});
									}}
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
