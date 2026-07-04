import { ChatPane } from "@/components/chat/chat-pane";
import { MemberList } from "@/components/member-list";
import { useChannel } from "@/hooks/use-channel";

export const ChannelsPageComponent = () => {
	const channel = useChannel();

	return (
		<>
			<ChatPane />

			{!channel ? null : <MemberList channel={channel} />}
		</>
	);
};
