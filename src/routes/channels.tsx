import styled from "styled-components";
import { useParams } from "wouter";
import { ChannelList, GuildsList } from "../components";
import { Chat } from "../components/chat";
import { observer } from "mobx-react-lite";
import { Profile } from "../components/profile";
import { MembersList } from "../components/membersList";

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

const LeftBarInner = styled.div`
	display: flex;
	flex-direction: column;
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

				<LeftBarInner>
					<ChannelList guild_id={guild_id} />

					<Profile />
				</LeftBarInner>
			</LeftBar>

			<Chat channel_id={channel_id} guild_id={guild_id} />

			<RightBar>
				<MembersList guild_id={guild_id} />
			</RightBar>
		</Container>
	);
});
