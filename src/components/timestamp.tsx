const TIMESTAMP_LIMIT = 12 * 60 * 60 * 1000; // 12 hours

export const Timestamp = ({ date }: { date: Date }) => {
	if (Number.isNaN(date.getTime())) return null;

	return (
		<span>
			{date.toLocaleTimeString()}
			{Date.now() - date.valueOf() > TIMESTAMP_LIMIT
				? ` - ${date.toLocaleDateString()}`
				: null}
		</span>
	);
};
