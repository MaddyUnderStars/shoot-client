import { GiPocketBow } from "react-icons/gi";
import styled from "styled-components";
import { Link, useParams } from "wouter";
import { useShootChannels } from "../lib/hooks";

import InfiniteScroll from "react-infinite-scroll-component";
import { useState } from "react";
import { Message } from "../lib/entities";
import { observer } from "mobx-react-lite";
import { shoot } from "../lib";

const Container = styled.div`
	display: flex;
	padding-top: 20px;
	flex: 1;
`;

const LeftBar = styled.div`
	display: flex;
`;

const GuildsList = styled.div``;

const Guild = styled.div`
	padding: 5px;
	margin: 0 10px 10px 10px;
	width: 40px;
	height: 40px;
	background-color: rgb(10, 10, 10);
	display: flex;
	justify-content: center;
	align-items: center;
`;

const ChannelsList = styled.div`
	width: 250px;
	margin-right: 10px;
`;

const ChannelsHeader = styled.div`
	margin-left: 5px;
	border-bottom: 1px solid white;
`;

const Channel = styled.a`
	display: block;
	padding: 5px;
`;

const ChatContainer = styled.div`
	display: flex;
	flex: 1;
	flex-direction: column;
`;

const Chat = styled.div`
	overflow: auto;
	flex: 1;
	display: flex;
	flex-direction: column-reverse;
`;

const ChatMessage = styled.div`
	margin: 5px 0 5px 0;
`;

const ChatInput = styled.input`
	margin-top: 10px;
	padding: 10px;
	background-color: rgb(10, 10, 10);
	border: 1px solid white;
`;

const RightBar = styled.div`
	width: 250px;
`;

export const Channels = observer(() => {
	const params = useParams();
	const id = params.id;

	const channels = useShootChannels();

	const guilds = shoot.guilds;

	const channel = id ? channels.get(id) : undefined;

	const MESSAGES_PER_PAGE = 50;

	const [messages, setMessages] = useState<Message[]>([]);
	const [hasNext, setHasNext] = useState(true);

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

	return (
		<Container>
			<LeftBar>
				<GuildsList>
					<Link to="/channels/@me">
						<Guild>
							<GiPocketBow size={40} />
						</Guild>
					</Link>

					{guilds.map((x) => (
						<Link to={`/channels/${x.id}@${x.domain}/${x.channels[0]?.mention}`}>
												<Guild>
							{x.name
								.split(" ")
								.slice(0, 4)
								.map((x) => x.charAt(0).toUpperCase())
								.join("")}
						</Guild></Link>
					))}
				</GuildsList>

				<ChannelsList>
					<ChannelsHeader>Private channels</ChannelsHeader>

					{[...channels].map(([id, ch]) => (
						<Link key={id} to={`/channels/${ch.mention}`} asChild>
							<Channel>{ch.name}</Channel>
						</Link>
					))}
				</ChannelsList>
			</LeftBar>

			{channel && (
				<>
					<ChatContainer>
						<Chat id="chat-scroll">
							<InfiniteScroll
								dataLength={messages.length}
								next={getNext}
								hasMore={hasNext}
								loader={<h4>Loading</h4>}
								endMessage={<h4>Thats the end!</h4>}
								inverse={true}
								scrollableTarget="chat-scroll"
								style={{
									display: "flex",
									flexDirection: "column-reverse",
								}}
							>
								{[...messages].map((msg) => (
									<ChatMessage key={id}>
										<div>{msg.author_id}</div>
										<div>{msg.content}</div>
									</ChatMessage>
								))}
							</InfiniteScroll>
						</Chat>

						<ChatInput />
					</ChatContainer>

					<RightBar>
						<div>Members</div>
					</RightBar>
				</>
			)}
		</Container>
	);
});
