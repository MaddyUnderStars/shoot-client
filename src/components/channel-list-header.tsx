import NiceModal from "@ebay/nice-modal-react";
import { DropdownMenuGroup } from "@radix-ui/react-dropdown-menu";
import { ChevronDown } from "lucide-react";
import type { Guild } from "@/lib/client/entity/guild";
import { CreateChannelModal } from "./modal/create-channel-modal";
import { CreateInviteModal } from "./modal/invite-modal";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export const ChannelListHeader = ({ guild }: { guild?: Guild }) => {
	return (
		<div className="flex w-full items-center justify-between">
			<div className="text-foreground text-base font-medium flex-1">
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
