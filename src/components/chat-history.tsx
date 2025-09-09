import InfiniteScroll from "react-infinite-scroll-component";
import { MESSAGE_API_PAGE_LIMIT, useMessageHistory } from "@/hooks/use-message-history";
import type { DmChannel } from "@/lib/client/entity/dm-channel";
import type { GuildChannel } from "@/lib/client/entity/guild-channel";
import { Message } from "@/lib/client/entity/message";
import { MessageComponent } from "./message";

export const ChatHistory = ({ channel }: { channel: DmChannel | GuildChannel }) => {
	const { data, hasNextPage, fetchNextPage, isFetching } = useMessageHistory(channel.mention);

	return (
		<div id="chat-history" className="overflow-auto flex flex-col-reverse flex-1">
			<InfiniteScroll
				dataLength={(data?.pages?.length ?? 0) * MESSAGE_API_PAGE_LIMIT}
				next={() => hasNextPage && !isFetching && fetchNextPage()}
				hasMore={hasNextPage}
				loader={<h4>Loading...</h4>}
				endMessage={<EndMessage />}
				style={{
					display: "flex",
					flexDirection: "column-reverse",
				}}
				inverse={true}
				scrollableTarget="chat-history"
			>
				{data?.pages.map((page) =>
					page.map((raw) => {
						const message = new Message(raw);

						return <MessageComponent message={message} key={message.id} />;
					}),
				)}
			</InfiniteScroll>
		</div>
	);
};

const EndMessage = () => {
	return (
		<div className="p-14 flex flex-col items-center">
			<h1 className="font-bold">That's the end!</h1>
			<p>You can send messages to this channel using the text box below.</p>
		</div>
	);
};
