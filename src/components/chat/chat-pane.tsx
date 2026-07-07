import { useChannel } from "@/hooks/use-channel";
import { ChannelHeader } from "../channel-header";
import { ChatHistory } from "./chat-history";
import { ChatInput } from "./chat-input";
import { FriendsPane } from "../friends-pane";
import { useGuild } from "@/hooks/use-guild";
import type { GuildChannel } from "@/lib/client/entity/guild-channel";
import type { DmChannel } from "@/lib/client/entity/dm-channel";

export const ChatPane = () => {
	const guild = useGuild();
	const channel = useChannel();

	let child = <NoChannel />;

	if (channel) child = <MainPane channel={channel} />;
	else if (!guild) child = <FriendsPane />;

	return (
		<div className="w-full flex flex-col h-dvh">
			<ChannelHeader />

			{child}
		</div>
	);
};

const MainPane = ({ channel }: { channel: GuildChannel | DmChannel }) => (
	<>
		<ChatHistory channel={channel} />

		<ChatInput />
	</>
);

const NoChannel = () => (
	<div className="w-full h-full flex items-center justify-center flex-col">
		<h1 className="text-xl">Nothing to see here...</h1>
		<p>There are no channels in this guild</p>
	</div>
);
