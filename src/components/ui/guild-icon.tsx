import type { Guild } from "@/lib/client/entity/guild";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";

export const GuildIcon = ({ guild }: { guild: Guild }) => {
	return (
		<Avatar className="rounded-none">
			<AvatarImage />
			<AvatarFallback className="rounded-none">{guild.initials}</AvatarFallback>
		</Avatar>
	);
};
