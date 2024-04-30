import styled from "styled-components";
import { useParams } from "wouter";
import { ChannelList, GuildsList } from "../components";
import { Chat } from "../components/chat";
import { observer } from "mobx-react-lite";

const Container = styled.div`
	display: flex;
	padding-top: 20px;
	flex: 1;
`;

const LeftBar = styled.div`
	display: flex;
`;

const RightBar = styled.div`
	width: 250px;
`;

export const Channels = observer(() => {
	const params = useParams<{
		channel_id: string;
		guild_id: string | undefined;
	}>();
	const { channel_id, guild_id } = params;

	return (
		<Container>
			<LeftBar>
				<GuildsList />

				<ChannelList guild_id={guild_id} />
			</LeftBar>

			<Chat channel_id={channel_id} guild_id={guild_id} />

			<RightBar>
				<div>Members</div>
			</RightBar>
		</Container>
	);
});