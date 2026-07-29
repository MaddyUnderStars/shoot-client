import { useUser } from "@/hooks/use-user";
import type { ActorMention } from "@/lib/client/common/actor";
import NiceModal from "@ebay/nice-modal-react";
import { ModalCloseButton, ModalContainer } from "../ui/modal-container";
import { CardAction, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { UserIcon } from "lucide-react";

export const UserProfileModal = NiceModal.create(({ user_id }: { user_id: ActorMention }) => {
	const { user, error } = useUser(user_id);

	if (!user || error) {
		return (
			<ModalContainer>
				<CardHeader>
					<Skeleton />
				</CardHeader>
			</ModalContainer>
		);
	}

	return (
		<ModalContainer className="py-0 max-w-xl h-full sm:h-auto">
			<CardHeader
				className="px-0 aspect-110/44 bg-no-repeat flex items-end p-4 rounded-xl"
				style={{
					background: `linear-gradient( rgba(0,0,0, 0.6), rgba(0,0,0,0.6) ), url(${user.banner})`,
					backgroundSize: "contain",
				}}
			>
				<CardTitle className="flex gap-2 items-center">
					<Avatar className="h-9 w-9">
						<AvatarImage src={user.avatar} />
						<AvatarFallback>
							<UserIcon />
						</AvatarFallback>
					</Avatar>

					<div>
						<div className="text-2xl">{user.display_name}</div>
						<div>
							{user.display_name !== user.name ? user.name : ""}@{user.domain}
						</div>
					</div>
				</CardTitle>

				<CardAction className="absolute right-0 top-0 m-2">
					<ModalCloseButton variant="default" />
				</CardAction>
			</CardHeader>

			{user.summary ? <CardContent>{user.summary}</CardContent> : null}
		</ModalContainer>
	);
});
