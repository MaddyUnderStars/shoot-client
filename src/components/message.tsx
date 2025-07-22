import { ChevronDown } from "lucide-react";
import type { Message } from "@/lib/client/entity/message";
import { FilePreview } from "./file-preview";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export const MessageComponent = ({ message }: { message: Message }) => {
	return (
		<div className="flex justify-between items-center me-5">
			<div className="flex gap-3 p-2 content-visibility-auto">
				<Avatar>
					<AvatarImage
						src={
							"https://www.freeiconspng.com/thumbs/profile-icon-png/profile-icon-9.png"
						}
					/>
					<AvatarFallback>PFP</AvatarFallback>
				</Avatar>

				<div>
					<div>{message.author_id}</div>
					<div>
						{message.content}

						{message.files?.map((file) => (
							<FilePreview
								file={file}
								channel={message.channel}
								key={file.hash}
							/>
						))}
					</div>
				</div>
			</div>

			<DropdownMenu>
				<DropdownMenuTrigger className="p-2 bg-accent rounded">
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
	);
};
