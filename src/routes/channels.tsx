import styled from "styled-components";
import { useParams } from "wouter";
import { Chat } from "../components/chat";
import { observer } from "mobx-react-lite";
import { Profile } from "../components/profile";
import { MembersList } from "../components/membersList";
import { GuildsList } from "../components/guildsList";
import { ChannelList } from "../components/channelList";
import { Friends } from "../components/friends";
import { UserProfile } from "../components/UserProfile";

const Container = styled.div`
	display: flex;
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
		user_id: string | undefined;
		channel_id: string | undefined;
		guild_id: string | undefined;
	}>();
	const { channel_id, guild_id, user_id } = params;

	let inner: JSX.Element;
	if (user_id) inner = <UserProfile user_id={user_id} />
	else {
		if (!channel_id || channel_id === "@me") inner = <Friends />
		else inner = <Chat channel_id={channel_id} guild_id={guild_id} />
	}
	return (
		<Container>
			<LeftBar>
				<GuildsList />

				<LeftBarInner>
					<ChannelList guild_id={guild_id} />

					<Profile />
				</LeftBarInner>
			</LeftBar>

			{inner}

			{channel_id && channel_id !== "@me" ? (
				<RightBar>
					<MembersList channel_id={channel_id} />
				</RightBar>
			) : null}
		</Container>
	);
});
