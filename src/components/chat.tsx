import InfiniteScroll from "react-infinite-scroll-component";
import styled from "styled-components";
import { useChannel } from "../lib/hooks";
import {
	type FormEvent,
	lazy,
	Suspense,
	useEffect,
	useState,
	type ChangeEvent,
} from "react";
import type { Message } from "../lib/entities/message";
import type { User } from "../lib/entities/user";
import { shoot } from "../lib/client";
import { ChatHeader } from "./chatheader";
import ReactModal from "react-modal";
import { createHttpClient } from "../lib/http";

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

const ChatMessage = styled.div`
	margin-top: 10px;
	display: flex;
	align-items: center;
	border-bottom: 1px solid rgba(255, 255, 255, 0.04);
	padding-bottom: 10px;
	content-visibility: auto;

	&:first-child {
		border-bottom: none;
	}
`;

const ChatMessageHeader = styled.div``;

const ChatContent = styled.div`
	margin-top: 5px;
`;

const ChatAuthor = styled.div`
	display: inline;
	cursor: pointer;
`;

const ChatTimestamp = styled.div`
	display: inline;
	margin-left: 10px;
	color: var(--text-secondary);
`;

const MessageContentSection = styled.div`
	display: inline-flex;
	flex-direction: column;
`;

const ChatInput = styled.input`
	margin: 20px 0 20px 0;
	padding: 10px;
	background-color: rgb(10, 10, 10);
	border: 1px solid white;
	color: white;
	flex: 1;
`;

const History = styled.div`
	display: flex;
	margin-left: 20px;
	flex: 1;
	flex-direction: column;
	overflow-y: auto;
`;

const ProfilePicture = styled.img`
	width: 30px;
	height: 30px;
	border-radius: 100%;
	margin-right: 10px;
	display: inline;
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
	const [attached, setAttached] = useState<{ hash: string; name: string }[]>(
		[],
	);

	const openUserPopup = async (u: string) => {
		const user = shoot.users.get(u);
		if (!user) return; // TODO: fetch

		setPopup(true);
		setUser(user);
	};

	const channel = useChannel(channel_id, guild_id);

	const [messages, setMessages] = useState<Message[]>([]);
	const [hasNext, setHasNext] = useState(true);

	const MESSAGES_PER_PAGE = 50;

	const getNext = async () => {
		const msgs = await channel?.getMessages({});
		if (!msgs) return;

		console.log(msgs);
		setHasNext(msgs.size > MESSAGES_PER_PAGE);

		setMessages(
			[...msgs.values()].sort((a, b) => (a.published > b.published ? 0 : 1)),
		);
	};

	useEffect(() => {
		getNext();
	}, []);

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

	const sendMessage = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		const form = event.currentTarget;
		const formData = new FormData(form);

		const content = formData.get("content")?.toString();

		if (!content) return;

		form.reset();

		await channel?.sendMessage({ content, files: attached });
	};

	const doImageUploads = async (event: ChangeEvent<HTMLInputElement>) => {
		if (!channel) return;

		const files = event.target.files;
		if (!files) return;

		// get the upload endpoints
		const { data, error } = await createHttpClient().POST(
			"/channel/{channel_id}/attachments/",
			{
				body: [...files].map((x) => ({ name: x.name, size: x.size })),
				params: {
					path: {
						channel_id: channel.mention,
					},
				},
			},
		);

		if (!data || error) return;

		setAttached(data.map((x, i) => ({ hash: x.hash, name: files[i]!.name })));

		// and then upload the files
		for (let i = 0; i < data?.length; i++) {
			const file = files[i];
			const signed = data[i];

			if (!file || !signed) continue;

			await fetch(signed.url, {
				method: "PUT",
				body: await file.arrayBuffer(),
			});
		}
	};

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
									<ProfilePicture src="https://www.freeiconspng.com/thumbs/profile-icon-png/profile-icon-9.png" />

									<MessageContentSection>
										<ChatMessageHeader>
											<ChatAuthor
												onClick={(event) => {
													setPosition({
														x: event.clientX,
														y: event.clientY,
													});
													openUserPopup(msg.author_id);
												}}
											>
												{shoot.users.get(msg.author_id)?.display_name ??
													msg.author_id}
											</ChatAuthor>
											<ChatTimestamp>
												{(msg.updated ?? msg.published).toLocaleString()}
											</ChatTimestamp>
										</ChatMessageHeader>

										<ChatContent>
											{msg.content}

											<ImageContainer>
												{msg.files.map((file) => (
													<Image
														src={`https://chat.understars.dev/channel/${channel.mention}/attachments/${file.hash}`}
														alt={file.name}
														key={file.hash}
														width={200}
													/>
												))}
											</ImageContainer>
										</ChatContent>
									</MessageContentSection>
								</ChatMessage>
							))}
						</InfiniteScroll>
					</Messages>

					<form style={{ display: "flex" }} onSubmit={sendMessage}>
						<ChatInput placeholder="Send a message..." name="content" />

						<input
							type="file"
							multiple
							name="files"
							onChange={doImageUploads}
						/>
					</form>
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

const Image = styled.img`
`;

const ImageContainer = styled.div`
    display: flex;
    flex-direction: row;
    gap: 5px;
    margin-top: 10px;
`;

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
			<p>You can send messages to this channel using the text box below.</p>
		</EndMessageContainer>
	);
};
