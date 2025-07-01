import { Suspense, lazy, useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import ReactModal from "react-modal";
import styled from "styled-components";
import { shoot } from "../lib/client";
import type { Message } from "../lib/entities/message";
import type { User } from "../lib/entities/user";
import { useChannel } from "../lib/hooks";
import { ChatHeader } from "./chatheader";
import { ChatInput } from "./chatinput";
import { MessageComponent } from "./message";

const UserPopout = lazy(async () => ({
	default: (await import("./modals/userPopout")).UserPopout,
}));

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

const History = styled.div`
	display: flex;
	margin-left: 20px;
	flex: 1;
	flex-direction: column;
	overflow-y: auto;
`;

interface ChatProps {
	guild_id?: string;
	channel_id: string;
}

export const Chat = ({ guild_id, channel_id }: ChatProps) => {
	const [user, setUser] = useState<User>();
	const [popup, setPopup] = useState<boolean>(false);
	const [position, setPosition] = useState<{ x: number; y: number }>({
		x: 0,
		y: 0,
	});

	const openUserPopup = async (u: string, x: number, y: number) => {
		const user = shoot.users.get(u);
		if (!user) return; // TODO: fetch

		setPosition({ x, y });
		setPopup(true);
		setUser(user);
	};

	const channel = useChannel(channel_id, guild_id);

	const [messages, setMessages] = useState<Message[]>([]);
	const [hasNext, setHasNext] = useState(true);

	const MESSAGES_API_LIMIT = 50;
	const MESSAGES_PER_PAGE = Math.min(12, MESSAGES_API_LIMIT);

	const getNext = async (before?: string) => {
		console.log(`getting before ${before}`);

		const msgs = await channel?.getMessages({
			before,
			limit: MESSAGES_PER_PAGE,
		});
		if (!msgs) {
			console.log("f");
			setHasNext(false);
			setMessages([]);
			return;
		}

		console.log(`has next: ${msgs.size >= MESSAGES_PER_PAGE}`);
		setHasNext(msgs.size >= MESSAGES_PER_PAGE);

		setMessages((value) => [...value, ...msgs.values()]);
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		setMessages([]);
		getNext();
	}, [channel_id]);

	useEffect(() => {
		const cb = (msg: Message) => {
			if (msg.channel_id !== channel_id) return;

			setMessages((value) => [msg, ...value]);
		};

		shoot.addListener("MESSAGE_CREATE", cb);

		return () => {
			shoot.removeListener("MESSAGE_CREATE", cb);
		};
	}, [channel_id]);

	if (!channel)
		return (
			<Container>
				<p>No channel selected</p>
			</Container>
		);

	return (
		<>
			<Container>
				<ChatHeader channel_id={channel_id} guild_id={guild_id} />

				<History>
					<Messages id="chat-scroll">
						<InfiniteScroll
							dataLength={messages.length}
							next={() =>
								getNext(messages[messages.length - 1]?.id)
							}
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
								<MessageComponent
									key={msg.id}
									message={msg}
									openUserPopup={openUserPopup}
								/>
							))}
						</InfiniteScroll>
					</Messages>

					<ChatInput channel={channel} />
				</History>
			</Container>

			<ReactModal
				isOpen={popup}
				shouldCloseOnOverlayClick={true}
				shouldCloseOnEsc={true}
				onRequestClose={() => setPopup(false)}
				style={{
					overlay: {
						background: "transparent",
					},
					content: {
						position: "absolute",
						width: "min-content",
						height: "min-content",
						top: position.y,
						left: position.x,
						backgroundColor: "transparent",
						border: "none",
					},
				}}
			>
				<Suspense fallback={<p>Loading...</p>}>
					<UserPopout user={user} />
				</Suspense>
			</ReactModal>
		</>
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
