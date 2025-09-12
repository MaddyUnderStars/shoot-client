import { TooltipTrigger } from "@radix-ui/react-tooltip";
import { Tooltip, TooltipContent } from "./ui/tooltip";

export const Timestamp = ({ date }: { date: Date }) => {
	if (Number.isNaN(date.getTime())) return null;

	return (
		<span>
			<Tooltip>
				<TooltipTrigger>
					{date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
				</TooltipTrigger>

				<TooltipContent>{date.toLocaleString()}</TooltipContent>
			</Tooltip>
		</span>
	);
};
