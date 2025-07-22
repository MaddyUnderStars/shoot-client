import { Hash } from "lucide-react";
import { useChannel } from "@/hooks/use-channel";

export const ChannelHeader = () => {
	const channel = useChannel();
	if (!channel) return undefined;

	return (
		<div className="p-4 bg-sidebar w-full border-b h-min">
			<h1>
				<Hash size={16} className="inline" /> {channel.name}
			</h1>
		</div>
	);
};
