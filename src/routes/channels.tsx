import { GiPocketBow } from "react-icons/gi";
import styled from "styled-components";
import { Link, useParams } from "wouter";
import { useShootChannels } from "../lib/hooks";
import { useEffect, useState } from "react";
import { Message } from "../lib/entities";

const Container = styled.div`
	display: flex;
	padding-top: 20px;
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

const Chat = styled.div``;

const Message = styled.div``;

const RightBar = styled.div``;

export function Channels() {
	const params = useParams();
	const id = params.id;

	const channels = useShootChannels();

	const channel = id ? channels.get(id) : undefined;

	const [messages, setMessages] = useState(new Map<string, Message>());

	useEffect(() => {
		(async () => {
			const ret = await channel?.getMessages({});
			if (!ret) return;

			setMessages(ret);
		})();
	}, [channel]);

	if (!id) throw new Error("Invalid channel");

	return (
		<Container>
			<LeftBar>
				<GuildsList>
					<Link to="/channels/@me">
						<Guild>
							<GiPocketBow size={40} />
						</Guild>
					</Link>

					{[0, 1, 2, 3, 4].map((x) => (
						<Link key={x} to="">
							<Guild>{x}</Guild>
						</Link>
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

			<Chat>
				{[...messages].map(([id, msg]) => (
					<Message key={id}>{msg.content}</Message>
				))}
			</Chat>

			<RightBar>{/* members */}</RightBar>
		</Container>
	);
}
