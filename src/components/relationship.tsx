import type { Relationship } from "@/lib/client/entity/relationship";
import { Button } from "./ui/button";

export const RelationshipComponent = ({ rel }: { rel: Relationship }) => {
	return (
		<div className="flex-1 flex items-center justify-between hover:bg-black/20 rounded p-3">
			<div className="grid flex-1 text-left text-sm leading-right">
				<span className="truncate font-medium">
					{rel.user.display_name}
				</span>
				<span className="truncate font-xs">@{rel.user.domain}</span>
			</div>

			<RelationshipActions rel={rel} />
		</div>
	);
};

const RelationshipActions = ({ rel }: { rel: Relationship }) => {
	return (
		<div className="flex gap-2">
			{rel.type === 0 ? (
				<Button type="button" disabled variant="outline">
					Accept
				</Button>
			) : null}
			<Button type="button" disabled variant="destructive">
				{rel.type === 2 ? "Unblock" : "Remove"}
			</Button>
		</div>
	);
};
