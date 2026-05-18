import { type InfiniteData, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import type { ActorMention } from "@/lib/client/common/actor";
import type { MESSAGE_CREATE, MESSAGE_DELETE, MESSAGE_UPDATE } from "@/lib/client/common/receive";
import { Message } from "@/lib/client/entity/message";
import { gatewayClient } from "@/lib/client/gateway";
import { getHttpClient } from "@/lib/http/client";
import type { components } from "../lib/http/generated/v1";
import { getAppStore } from "@/lib/store/app-store";
import { PublicUser } from "@/lib/client/entity/public-user";

export const MESSAGE_API_PAGE_LIMIT = 50;

type MessagesResponse = components["schemas"]["MessagesResponse"];

export const useMessageHistory = (channel: ActorMention) => {
	const client = useQueryClient();

	const { $api } = getHttpClient();

	const { users } = getAppStore();

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
			getNextPageParam: (lastPage: MessagesResponse) => lastPage.messages.slice(-1)[0]?.id,
			initialPageParam: "",
			pageParamName: "before",
			select: (data: InfiniteData<MessagesResponse>) => ({
				pageParams: data.pageParams,
				pages: data.pages.map((page) =>
					page.messages.map((msg) => {
						const author = page.authors[msg.author_id];

						if (author) {
							users.setUser(author.mention, new PublicUser(author));
						}

						return new Message(msg);
					}),
				),
			}),
		},
		client,
	);

	useEffect(() => {
		const createListener = (event: MESSAGE_CREATE) => {
			if (!event) return;

			const msg = new Message(event.d.message);

			client.setQueryData(queryKey, (data: InfiniteData<MessagesResponse[]>) => {
				return {
					pages: [
						{ messages: [msg], authors: {} },
						...data.pages.flat(),
					] satisfies MessagesResponse[],
					pageParams: data.pageParams,
				};
			});
		};

		const deleteListener = (event: MESSAGE_DELETE) => {
			client.setQueryData(queryKey, (data: InfiniteData<MessagesResponse>) => {
				const ret = data.pages.map((page) => ({
					messages: page.messages.filter((msg) => msg.id !== event.d.message_id),
					authors: page.authors,
				}));

				return {
					pages: ret,
					pageParams: data.pageParams,
				};
			});
		};

		const updateListener = (event: MESSAGE_UPDATE) => {
			if (!event) return;

			const id = event.d.message.id;

			client.setQueryData(queryKey, (data: InfiniteData<MessagesResponse>) => {
				return {
					pages: data.pages.map((page) => ({
						messages: page.messages.map((msg) =>
							msg.id === id ? { ...msg, ...event.d.message } : msg,
						),
						authors: page.authors,
					})),
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
