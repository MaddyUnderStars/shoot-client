import { useGuild } from "../lib/hooks";

export const MembersList = ({ guild_id }: { guild_id?: string }) => {
	const guild = useGuild(guild_id);

	if (!guild) return null;

	return (
		<div>
			<p>Members</p>
		</div>
	);
};
