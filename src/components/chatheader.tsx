import styled from "styled-components";
import { shoot } from "../lib/client";
import { useChannel } from "../lib/hooks";
import { createHttpClient } from "../lib/http";

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

		if (typeof data === "string") return; // TODO: wait for it

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

				<form
					onSubmit={async (e) => {
						e.preventDefault();

						const query = new FormData(e.currentTarget)
							.get("query")
							?.toString();
						if (!query) return;

						const messages = await channel.getMessages({
							query,
						});

						console.log(messages);
					}}
				>
					<Search placeholder={"Search"} name="query" />
					<input type="submit" />
				</form>
			</Controls>
		</Container>
	);
};

const Search = styled.input`
	background-color: var(--background-tertiary);
	border: none;
	color: var(--text-primary);
	padding: 10px;
	margin-right: 5px;
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
