import { useChannel } from "@/hooks/use-channel";
import { ChannelHeader } from "./channel-header";
import { ChatHistory } from "./chat-history";
import { ChatInput } from "./chat-input";
import { FriendsPane } from "./friends-pane";

export const ChatPane = () => {
	const channel = useChannel();

	return (
		<div className="w-full flex flex-col h-dvh">
			<ChannelHeader />

			{channel ? (
				<>
					<ChatHistory channel={channel} />

					<ChatInput />
				</>
			) : (
				<FriendsPane />
			)}
		</div>
	);
};
