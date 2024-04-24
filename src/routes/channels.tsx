import styled from "styled-components";
import { Link, useParams } from "wouter";
import { shoot } from "../lib";

const Container = styled.div``;

const LeftBar = styled.div``;

const GuildsList = styled.div``;

const ChannelsList = styled.div``;

const Channel = styled.a`
	display: block;
	padding: 5px;
`;

const Chat = styled.div``;

const RightBar = styled.div``;

export function Channels() {
	const params = useParams();
	const id = params.id;

	const channels = [...shoot.channels];

	if (!id) throw new Error("Invalid channel");

	return (
		<Container>
			<LeftBar>
				<GuildsList>{/* guilds */}</GuildsList>
				<ChannelsList>
					{channels.map(([, ch]) => (
						<Link to={`/channels/${ch.mention}`} asChild>
							<Channel>{ch.name}</Channel>
						</Link>
					))}
				</ChannelsList>
			</LeftBar>

			<Chat>{/* messages */}</Chat>

			<RightBar>{/* members */}</RightBar>
		</Container>
	);
}
