import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import type { Message } from "@/lib/client/entity/message";
import { FilePreview } from "./file-preview";

export const MessageComponent = ({ message }: { message: Message }) => {
	return (
		<div className="flex gap-3 p-2 content-visibility-auto">
			<Avatar className="w-10">
				<AvatarImage src={"https://www.freeiconspng.com/thumbs/profile-icon-png/profile-icon-9.png"} />
				<AvatarFallback>PFP</AvatarFallback>
			</Avatar>

			<div>
				<div>
					{message.author_id}
				</div>
				<div>
					{message.content}

					{message.files?.map(file => <FilePreview file={file} channel={message.channel} key={file.hash} />)}
				</div>
			</div>
		</div>
	);
};
