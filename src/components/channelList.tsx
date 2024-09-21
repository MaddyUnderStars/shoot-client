import { useMemo } from "react";
import { useGuild, useShootChannels } from "../lib/hooks";
import { Link } from "wouter";
import styled from "styled-components";
import { ChannelListDropdown } from "./modals/channelListDropdown";

const ChannelsList = styled.div`
	background-color: var(--background-secondary);
	padding-top: 10px;
	padding-bottom: 10px;
	padding-right: 20px;
	width: 230px;
	flex: 1;
`;

const ChannelsHeader = styled.div`
	margin-left: 5px;
	padding-bottom: 10px;
	border-bottom: 1px solid white;
`;

const Channel = styled.a`
	display: block;
	padding: 5px;
`;

interface ChannelListProps {
	guild_id?: string;
}

export const ChannelList = ({ guild_id }: ChannelListProps) => {
	const guild = useGuild(guild_id);

	const privateChannels = useShootChannels();

	const channels = useMemo(
		() => (guild ? guild.channels : [...privateChannels.values()]) || [],
		[guild, privateChannels],
	);

	let header = <span>{guild?.name ?? "Private Channels"}</span>;

	if (guild)
		header = (
			<ChannelListDropdown guild_id={guild.mention}>
				{header}
			</ChannelListDropdown>
		);

	return (
		<ChannelsList>
			<ChannelsHeader>{header}</ChannelsHeader>
			{channels.map((ch) => (
				<Link
					key={ch.mention}
					to={`/channels/${guild ? `${guild.mention}/` : ""}${
						ch.mention
					}`}
					asChild
				>
					<Channel>{ch.name}</Channel>
				</Link>
			))}
		</ChannelsList>
	);
};
