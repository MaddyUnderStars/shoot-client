import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import type { PrivateUser } from "@/lib/client/entity/private-user";
import type { PublicUser } from "@/lib/client/entity/public-user";

export const UserComponent = ({ user }: { user: PublicUser | PrivateUser }) => {
	return (
		<>
			<Avatar className="h-8 w-8 rounded-lg">
				<AvatarImage
					src={
						"https://www.freeiconspng.com/thumbs/profile-icon-png/profile-icon-9.png"
					}
					alt="Username"
				/>
				<AvatarFallback>PFP</AvatarFallback>
			</Avatar>

			<div className="grid flex-1 text-left text-sm leading-right">
				<span className="truncate font-medium">
					{user.display_name}
				</span>
				<span className="truncate font-xs">@{user.domain}</span>
			</div>
		</>
	);
};
