import InfiniteScroll from "react-infinite-scroll-component";
import styled from "styled-components";
import { useChannel } from "../lib/hooks";
import { FormEvent, useEffect, useState } from "react";
import { Message } from "../lib/entities";
import { Friends } from "./friends";
import { shoot } from "../lib";

const Container = styled.div`
	display: flex;
	flex: 1;
	flex-direction: column;
`;

const Messages = styled.div`
	overflow: auto;
	flex: 1;
	display: flex;
	flex-direction: column-reverse;
`;

const ChatMessage = styled.div`
	margin: 5px 0 5px 0;
`;

const ChatInput = styled.input`
	margin: 20px 0 20px 0;
	padding: 10px;
	background-color: rgb(10, 10, 10);
	border: 1px solid white;
	color: white;
	width: 100%;
`;

interface ChatProps {
	guild_id?: string;
	channel_id: string;
}

export const Chat = ({ guild_id, channel_id }: ChatProps) => {
	const channel = useChannel(channel_id, guild_id);

	const [messages, setMessages] = useState<Message[]>([]);
	const [hasNext, setHasNext] = useState(true);

	const MESSAGES_PER_PAGE = 50;

	const getNext = async () => {
		const msgs = await channel?.getMessages({});
		if (!msgs) return;

		setHasNext(msgs.size > MESSAGES_PER_PAGE);

		setMessages(
			[...msgs.values()].sort((a, b) =>
				a.published > b.published ? 0 : 1,
			),
		);
	};

	useEffect(() => {
		getNext();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [channel]);

	useEffect(() => {
		const cb = (msg: Message) => {
			if (msg.channel_id != channel_id) return;

			setMessages((value) => [msg, ...value]);
		};

		shoot.addListener("MESSAGE_CREATE", cb);

		return () => {
			shoot.removeListener("MESSAGE_CREATE", cb);
		};
	}, []);

	const sendMessage = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		const form = event.currentTarget;
		const formData = new FormData(form);

		const content = formData.get("content")?.toString();

		form.reset();

		await channel?.sendMessage(content!);
	};

	if (!channel) return <Friends />;

	return (
		<Container>
			<Messages id="chat-scroll">
				<InfiniteScroll
					dataLength={messages.length}
					next={getNext}
					hasMore={hasNext}
					loader={<h4>Loading</h4>}
					endMessage={<EndMessage />}
					inverse={true}
					scrollableTarget="chat-scroll"
					style={{
						display: "flex",
						flexDirection: "column-reverse",
					}}
				>
					{[...messages].map((msg) => (
						<ChatMessage key={msg.id}>
							<div>{msg.author_id}</div>
							<div>{msg.content}</div>
						</ChatMessage>
					))}
				</InfiniteScroll>
			</Messages>

			<form onSubmit={sendMessage}>
				<ChatInput name="content" />
			</form>
		</Container>
	);
};

const EndMessageContainer = styled.div`
	padding: 50px 0 50px 0;
	display: flex;
	flex-direction: column;
	align-items: center;
`;

const EndMessageHeader = styled.span`
	font-weight: bold;
`;

const EndMessage = () => {
	return (
		<EndMessageContainer>
			<EndMessageHeader>That's the end!</EndMessageHeader>
			<p>
				You can send messages to this channel using the text box below.
			</p>
		</EndMessageContainer>
	);
};
