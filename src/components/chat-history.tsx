import InfiniteScroll from "react-infinite-scroll-component";
import { MESSAGE_API_PAGE_LIMIT, useMessageHistory } from "@/hooks/use-message-history";
import type { DmChannel } from "@/lib/client/entity/dm-channel";
import type { GuildChannel } from "@/lib/client/entity/guild-channel";
import { MessageComponent } from "./message";
import type { Message } from "@/lib/client/entity/message";
import React from "react";

const MSG_GROUP_LIMIT_DT = 1000 * 60 * 5; // 5 minutes

export const ChatHistory = ({ channel }: { channel: DmChannel | GuildChannel }) => {
	const { data, hasNextPage, fetchNextPage, isFetching } = useMessageHistory(channel.mention);

	const getNext = () => hasNextPage && !isFetching && fetchNextPage();

	return (
		<div id="chat-history" className="overflow-auto flex flex-col-reverse flex-1">
			<InfiniteScroll
				dataLength={(data?.pages?.length ?? 0) * MESSAGE_API_PAGE_LIMIT}
				next={getNext}
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
				{data?.pages.flat().map((msg, i, arr) => (
					<PaginatedMessage last={arr[i + 1]} curr={msg} key={msg.id} />
				))}
			</InfiniteScroll>
		</div>
	);
};

const PaginatedMessage = ({ last, curr }: { last?: Message; curr: Message }) => {
	const showAuthor =
		last &&
		(last.author_id !== curr.author_id ||
			curr.published.valueOf() - last.published.valueOf() > MSG_GROUP_LIMIT_DT);

	return <MessageComponent message={curr} showAuthor={showAuthor} />;
};

const EndMessage = () => {
	return (
		<div className="p-14 flex flex-col items-center">
			<h1 className="font-bold">That's the end!</h1>
			<p>You can send messages to this channel using the text box below.</p>
		</div>
	);
};
