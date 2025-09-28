import { useUser } from "@/hooks/use-user";
import type { ActorMention } from "@/lib/client/common/actor";

export const Mention = ({ user: user_id }: { user: ActorMention }) => {
	const { user } = useUser(user_id);

	if (!user) return user_id;

	return <span className="underline text-link bg-secondary font-bold">@{user_id}</span>;
};
