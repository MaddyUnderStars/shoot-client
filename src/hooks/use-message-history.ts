import { type InfiniteData, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import type { ActorMention } from "@/lib/client/common/actor";
import type { MESSAGE_CREATE, MESSAGE_DELETE, MESSAGE_UPDATE } from "@/lib/client/common/receive";
import { Message } from "@/lib/client/entity/message";
import { gatewayClient } from "@/lib/client/gateway";
import { getHttpClient } from "@/lib/http/client";
import type { ApiPublicMessage } from "@/lib/http/types";

export const MESSAGE_API_PAGE_LIMIT = 50;

export const useMessageHistory = (channel: ActorMention) => {
	const client = useQueryClient();

	const { $api } = getHttpClient();

	const fetchOptions = {
		params: {
			path: {
				channel_id: channel,
			},
			query: {
				limit: MESSAGE_API_PAGE_LIMIT,
			},
		},
	};

	const queryKey = ["get", "/channel/{channel_id}/messages/", fetchOptions];

	const query = $api.useInfiniteQuery(
		"get",
		"/channel/{channel_id}/messages/",
		fetchOptions,
		{
			getNextPageParam: (lastPage: ApiPublicMessage[]) => lastPage[lastPage.length - 1]?.id,
			initialPageParam: "",
			pageParamName: "before",
			select: (data: InfiniteData<ApiPublicMessage[]>) => ({
				pages: [...data.pages].map((page) => page.map((msg) => new Message(msg))),
				pageParams: [...data.pageParams],
			}),
		},
		client,
	);

	useEffect(() => {
		const createListener = (event: MESSAGE_CREATE) => {
			if (!event) return;

			const msg = new Message(event.d.message);

			client.setQueryData(queryKey, (data: InfiniteData<Message[]>) => {
				return {
					pages: [[msg], ...data.pages],
					pageParams: data.pageParams,
				};
			});
		};

		const deleteListener = (event: MESSAGE_DELETE) => {
			client.setQueryData(queryKey, (data: InfiniteData<Message[]>) => {
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

			client.setQueryData(queryKey, (data: InfiniteData<Message[]>) => {
				return {
					pages: data.pages.map((page) =>
						page.map((msg) => (msg.id === id ? { ...msg, ...event.d.message } : msg)),
					),
					pageParams: data.pageParams,
				};
			});
		};

		gatewayClient.addListener("MESSAGE_CREATE", createListener);
		gatewayClient.addListener("MESSAGE_UPDATE", updateListener);
		gatewayClient.addListener("MESSAGE_DELETE", deleteListener);

		return () => {
			gatewayClient.removeListener("MESSAGE_CREATE", createListener);
			gatewayClient.removeListener("MESSAGE_UPDATE", updateListener);
			gatewayClient.removeListener("MESSAGE_DELETE", deleteListener);
		};
	});

	return query;
};
