import { ChevronDown } from "lucide-react";
import type { Message } from "@/lib/client/entity/message";
import { EmbedComponent } from "./embed";
import { FilePreview } from "./file-preview";
import { UserPopover } from "./popover/user-popover";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Popover, PopoverTrigger } from "./ui/popover";
import { Skeleton } from "./ui/skeleton";

export const MessageComponent = ({ message }: { message: Message }) => {
	return (
		<div className="flex justify-between items-center me-5">
			<div className="flex gap-3 p-2 content-visibility-auto">
				<Popover>
					<PopoverTrigger className="flex items-start mt-2">
						<Avatar className="cursor-pointer">
							<AvatarImage
								src={
									"https://www.freeiconspng.com/thumbs/profile-icon-png/profile-icon-9.png"
								}
							/>
							<AvatarFallback>
								<Skeleton className="h-8 w-8 rounded-full" />
							</AvatarFallback>
						</Avatar>
					</PopoverTrigger>
					<UserPopover user={message.author_id} />
				</Popover>

				<div>
					<Popover>
						<PopoverTrigger>
							<span className="cursor-pointer">{message.author_id}</span>
						</PopoverTrigger>
						<UserPopover user={message.author_id} />
					</Popover>
					<div>
						{message.content}

						{message.files?.map((file) => (
							<FilePreview file={file} channel={message.channel} key={file.hash} />
						))}

						{!message.embeds ? null : (
							<div className="mt-2">
								{message.embeds?.map((embed) => (
									<EmbedComponent embed={embed} key={embed.target} />
								))}
							</div>
						)}
					</div>
				</div>
			</div>

			<DropdownMenu>
				<DropdownMenuTrigger className="p-2 bg-accent rounded">
					<ChevronDown size={16} />
				</DropdownMenuTrigger>

				<DropdownMenuContent>
					<DropdownMenuItem variant="destructive" onClick={() => message.delete()}>
						Delete
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
};
