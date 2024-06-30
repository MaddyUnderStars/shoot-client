import styled from "styled-components";
import { useChannel } from "../lib/hooks";
import { createHttpClient, shoot } from "../lib";

interface ChatHeaderProps {
	guild_id?: string;
	channel_id: string;
}

export const ChatHeader = ({ guild_id, channel_id }: ChatHeaderProps) => {
	const channel = useChannel(channel_id, guild_id);

	if (!channel) return null;

	const startCall = async () => {
		const client = createHttpClient();
		const { data, error } = await client.POST(
			"/channel/{channel_id}/call/",
			{
				params: { path: { channel_id } },
			},
		);

		if (error) return;

		if (typeof data == "string") return; // TODO: wait for it

		shoot.webrtc.login({ address: data.ip, token: data.token });
	};

	return (
		<Container>
			<Username>
				<NamePart>{channel.name}</NamePart>
				<DomainPart>{channel.domain}</DomainPart>
			</Username>

			<Controls>
				<Call onClick={startCall}>Call</Call>
			</Controls>
		</Container>
	);
};

const Call = styled.button``;

const Controls = styled.div``;

const Username = styled.div``;

const NamePart = styled.p`
	font-weight: bold;
`;

const DomainPart = styled.p`
	font-size: 0.8rem;
`;

const Container = styled.div`
	margin-left: 10px;
	display: flex;
	justify-content: space-between;
`;
