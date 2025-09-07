import { type InfiniteData, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import type { MESSAGE_CREATE, MESSAGE_DELETE, MESSAGE_UPDATE } from "@/lib/client/common/receive";
import type { DmChannel } from "@/lib/client/entity/dm-channel";
import type { GuildChannel } from "@/lib/client/entity/guild-channel";
import { Message } from "@/lib/client/entity/message";
import { getGatewayClient } from "@/lib/client/gateway";
import { getHttpClient } from "@/lib/http/client";
import type { ApiPublicMessage } from "@/lib/http/types";
import { MessageComponent } from "./message";

const API_PAGE_LIMIT = 50;

export const ChatHistory = ({ channel }: { channel: DmChannel | GuildChannel }) => {
	const client = useQueryClient();

	const { $api } = getHttpClient();

	const fetchOptions = {
		params: {
			path: {
				channel_id: channel?.mention,
			},
			query: {
				limit: API_PAGE_LIMIT,
			},
		},
	};

	const { data, fetchNextPage, hasNextPage, isFetching } = $api.useInfiniteQuery(
		"get",
		"/channel/{channel_id}/messages/",
		fetchOptions,
		{
			getNextPageParam: (lastPage: ApiPublicMessage[]) => lastPage[lastPage.length - 1]?.id,
			initialPageParam: "",
			pageParamName: "before",
			// select: (data: InfiniteData<ApiPublicMessage[]>) => ({
			// 	pages: [...data.pages].reverse(),
			// 	pageParams: [...data.pageParams].reverse(),
			// }),
		},
		client,
	);
	const queryKey = ["get", "/channel/{channel_id}/messages/", fetchOptions];

	useEffect(() => {
		const gw = getGatewayClient();

		const createListener = (event: MESSAGE_CREATE) => {
			if (!event) return;

			const msg = new Message(event.d.message);

			client.setQueryData(queryKey, (data: InfiniteData<ApiPublicMessage[]>) => {
				return {
					pages: [[msg], ...data.pages],
					pageParams: data.pageParams,
				};
			});
		};

		const deleteListener = (event: MESSAGE_DELETE) => {
			client.setQueryData(queryKey, (data: InfiniteData<ApiPublicMessage[]>) => {
				const ret = data.pages.map((page) =>
					page.filter((msg) => msg.id !== event.d.message_id),
				);

				return {
					pages: ret,
					pageParams: data.pageParams,
				};
			});
		};

		const updateListener = (event: MESSAGE_UPDATE) => {
			if (!event) return;

			const id = event.d.message.id;

			client.setQueryData(queryKey, (data: InfiniteData<ApiPublicMessage[]>) => {
				return {
					pages: data.pages.map((page) =>
						page.map((msg) => (msg.id === id ? { ...msg, ...event.d.message } : msg)),
					),
					pageParams: data.pageParams,
				};
			});
		};

		gw.addListener("MESSAGE_CREATE", createListener);
		gw.addListener("MESSAGE_UPDATE", updateListener);
		gw.addListener("MESSAGE_DELETE", deleteListener);

		return () => {
			gw.removeListener("MESSAGE_CREATE", createListener);
			gw.removeListener("MESSAGE_UPDATE", updateListener);
			gw.removeListener("MESSAGE_DELETE", deleteListener);
		};
	});

	return (
		<div id="chat-history" className="overflow-auto flex flex-col-reverse flex-1">
			<InfiniteScroll
				dataLength={(data?.pages?.length ?? 0) * API_PAGE_LIMIT}
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
