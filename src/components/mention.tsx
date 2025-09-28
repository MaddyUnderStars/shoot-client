export const Mention = ({ user }: { user: string }) => {
	return <span className="underline text-link bg-secondary font-bold">@{user}</span>;
};
