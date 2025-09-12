import { useIsMobile } from "@/hooks/use-mobile";

const TIMESTAMP_LIMIT = 12 * 60 * 60 * 1000; // 12 hours

export const Timestamp = ({ date }: { date: Date }) => {
	const isMobile = useIsMobile();

	if (Number.isNaN(date.getTime())) return null;

	return (
		<span>
			{date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
			{!isMobile && Date.now() - date.valueOf() > TIMESTAMP_LIMIT
				? ` - ${date.toLocaleDateString()}`
				: null}
		</span>
	);
};
