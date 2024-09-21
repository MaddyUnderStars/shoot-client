import styled from "styled-components";
import { useChannel } from "../lib/hooks";
import { createHttpClient, shoot } from "../lib";

import { IoIosCall } from "react-icons/io";

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

		shoot.webrtc.login({
			address: data.ip,
			token: data.token,
			channel_id: channel_id,
		});
	};

	return (
		<Container>
			<Username>
				<NamePart>{channel.name}</NamePart>
				<DomainPart>{channel.domain}</DomainPart>
			</Username>

			<Controls>
				<Call onClick={startCall}>
					<IoIosCall />
				</Call>
				<Search placeholder={"Search"} />
			</Controls>
		</Container>
	);
};

const Search = styled.input`
	background-color: var(--background-tertiary);
	border: none;
	color: var(--text-primary);
	padding: 10px;
	border-bottom: 1px solid white;
`;

const Call = styled.button`
	background-color: var(--background-tertiary);
	border: none;
	color: var(--text-primary);
	padding: 10px;
	cursor: pointer;
	border-bottom: 1px solid white;
`;

const Controls = styled.div`
	display: flex;
	gap: 10px;
`;

const Username = styled.div``;

const NamePart = styled.p`
	font-weight: bold;
`;

const DomainPart = styled.p`
	font-size: 0.8rem;
`;

const Container = styled.div`
	padding: 10px 0 10px 20px;
	display: flex;
	justify-content: space-between;
	background-color: var(--background-secondary);
`;
