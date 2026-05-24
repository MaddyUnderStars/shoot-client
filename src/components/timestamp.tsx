import { TooltipTrigger } from "@radix-ui/react-tooltip";
import { Tooltip, TooltipContent } from "./ui/tooltip";
import React from "react";

export const Timestamp = React.memo(({ date }: { date: Date }) => {
	if (!date) return null;
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
});
