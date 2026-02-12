import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { useUser } from "@/hooks/use-user";
import type { Message } from "@/lib/client/entity/message";
import { cn } from "@/lib/utils";
import { EmbedComponent } from "./embed";
import { FilePreview } from "./file-preview";
import { MarkdownRenderer } from "./markdown";
import { UserPopover } from "./popover/user-popover";
import { Timestamp } from "./timestamp";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Popover, PopoverTrigger } from "./ui/popover";
import { Skeleton } from "./ui/skeleton";

export const MessageComponent = ({
	message,
	showAuthor = true,
	showControls = true,
}: {
	message: Message;
	showAuthor?: boolean;
	showControls?: boolean;
}) => {
	const [open, setOpen] = useState<boolean>();

	const { user } = useUser(message.author_id);

	return (
		<div className="flex justify-between items-start pe-5 group hover:bg-secondary">
			<div
				className={cn("flex gap-3 content-visibility-auto ps-2", showAuthor ? "pt-2" : "")}
			>
				{showAuthor ? (
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
				) : (
					<span className="min-w-8"></span>
				)}

				<div className="wrap-anywhere">
					{showAuthor ? (
						<Popover>
							<div className="flex gap-2">
								<PopoverTrigger className="cursor-pointer inline">
									<span>{user?.display_name ?? message.author_id}</span>
								</PopoverTrigger>

								<Timestamp date={new Date(message.published)} />
							</div>

							<UserPopover user={message.author_id} />
						</Popover>
					) : null}

					<MarkdownRenderer content={message.content} />

					{message.files?.map((file) => (
						<FilePreview file={file} channel={message.channel} key={file.hash} />
					))}

					{!message.embeds?.length ? null : (
						<div className="mt-2 flex gap-2 flex-wrap">
							{message.embeds?.map((embed) => (
								<EmbedComponent embed={embed} key={embed.target} />
							))}
						</div>
					)}
				</div>
			</div>

			{showControls ? (
				<div className="relative">
					<DropdownMenu onOpenChange={(open) => setOpen(open)}>
						<DropdownMenuTrigger
							className={cn([
								"bg-accent rounded group-hover:block absolute right-1 p-1",
								open ? "" : "hidden",
							])}
						>
							<ChevronDown size={16} />
						</DropdownMenuTrigger>

						<DropdownMenuContent>
							<DropdownMenuItem
								variant="destructive"
								onClick={() => message.delete()}
							>
								Delete
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			) : null}
		</div>
	);
};
