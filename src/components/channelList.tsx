import { useMemo } from "react";
import { useGuild, useShootChannels } from "../lib/hooks";
import { Link } from "wouter";
import styled from "styled-components";
import { RiArrowDropDownLine } from "react-icons/ri";

const ChannelsList = styled.div`
	width: 250px;
	margin-right: 10px;
	flex: 1;
`;

const ChannelsHeader = styled.div`
	margin-left: 5px;
	border-bottom: 1px solid white;
	display: flex;
	justify-content: space-between;
	align-items: center;
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

	return (
		<ChannelsList>
			<ChannelsHeader>
				{guild?.name ?? "Private channels"}
				<RiArrowDropDownLine size={20} />
			</ChannelsHeader>
			{channels.map((ch) => (
				<Link
					key={ch.mention}
					to={`/channels/${guild ? `${guild.mention}/` : ""}${
						ch.mention
					}`}
					asChild
				>
					<Channel>
						{(() => {
							if (ch.guild) return ch.name;

							return ch.recipients!.length > 1
								? ch.name
								: ch.recipients![0]!.name;
						})()}
					</Channel>
				</Link>
			))}
		</ChannelsList>
	);
};
