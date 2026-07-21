import { ChevronDown, UserIcon } from "lucide-react";
import { useState } from "react";
import { useUser } from "@/hooks/use-user";
import type { Message } from "@/lib/client/entity/message";
import { cn } from "@/lib/utils";
import { EmbedComponent } from "./embed";
import { FilePreview } from "./file-preview";
import { MarkdownRenderer } from "../ui/markdown";
import { UserPopover } from "../popover/user-popover";
import { Timestamp } from "../ui/timestamp";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Popover, PopoverTrigger } from "../ui/popover";

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
		<div className="flex justify-between items-start pe-5 group hover:bg-secondary flex-1">
			<div
				className={cn(
					"flex gap-3 content-visibility-auto ps-2 flex-1",
					showAuthor ? "pt-2" : "",
				)}
			>
				{showAuthor ? (
					<Popover>
						<PopoverTrigger className="flex items-start mt-2">
							<Avatar>
								<AvatarImage src={user?.avatar} />
								<AvatarFallback>
									<UserIcon />
								</AvatarFallback>
							</Avatar>
						</PopoverTrigger>
						<UserPopover user={message.author_id} />
					</Popover>
				) : (
					<span className="min-w-9"></span>
				)}

				<div className="flex-1">
					{showAuthor ? (
						<Popover>
							<div className="flex gap-2">
								<PopoverTrigger className="inline">
									<span>{user?.display_name ?? message.author_id}</span>
								</PopoverTrigger>

								<Timestamp date={message.published} />
							</div>

							<UserPopover user={message.author_id} />
						</Popover>
					) : null}

					<MarkdownRenderer content={message.content} />

					{message.files?.map((file) => (
						<FilePreview
							file={file}
							channel={message.channel}
							key={file.hash}
							className="max-h-100 max-w-100"
						/>
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
