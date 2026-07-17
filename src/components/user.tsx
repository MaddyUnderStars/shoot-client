import { useUser } from "@/hooks/use-user";
import type { ActorMention } from "@/lib/client/common/actor";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Skeleton } from "./ui/skeleton";

export const UserComponent = ({ user_id }: { user_id: ActorMention }) => {
	const { user } = useUser(user_id);

	if (!user) return null; // todo: skeleton

	return (
		<>
			<Avatar className="h-9 w-9">
				<AvatarImage src={user.avatar} />
				<AvatarFallback>
					<Skeleton className="h-9 w-9 rounded-lg" />
				</AvatarFallback>
			</Avatar>

			<div className="grid flex-1 text-left text-sm leading-right">
				<span className="truncate font-medium">{user.display_name}</span>
				<span className="truncate font-xs">
					{user.display_name !== user.name ? user.name : ""}@{user.domain}
				</span>
			</div>
		</>
	);
};
