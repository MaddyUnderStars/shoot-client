import { ChevronDown } from "lucide-react";
import {
	type Relationship,
	RelationshipType,
} from "@/lib/client/entity/relationship";
import { getHttpClient } from "@/lib/http/client";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "./ui/dropdown-menu";

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
	const { $fetch } = getHttpClient();

	const action = async (type: "unblock" | "block" | "accept" | "remove") => {
		if (type === "remove") {
			const { error } = await $fetch.DELETE(
				"/users/{user_id}/relationship/",
				{
					params: {
						path: {
							user_id: rel.user.mention,
						},
					},
				},
			);

			// TODO: handle errors
			if (error) throw new Error(error.message);
			return;
		}

		if (type === "accept") {
			const { error } = await $fetch.POST(
				"/users/{user_id}/relationship/",
				{
					params: {
						path: {
							user_id: rel.user.mention,
						},
					},
				},
			);

			// TODO: handle errors
			if (error) throw new Error(error.message);
			return;
		}
	};

	const actions: React.ReactNode[] = [];

	if (rel.type === RelationshipType.pending)
		actions.push(
			<DropdownMenuItem onClick={() => action("accept")}>
				Accept
			</DropdownMenuItem>,
		);
	else
		actions.push(
			<DropdownMenuItem
				variant="destructive"
				disabled
				onClick={() => action("block")}
			>
				Block
			</DropdownMenuItem>,
		);

	if (rel.type === RelationshipType.blocked)
		actions.push(
			<DropdownMenuItem
				variant="destructive"
				disabled
				onClick={() => action("unblock")}
			>
				Unblock
			</DropdownMenuItem>,
		);
	else
		actions.push(
			<DropdownMenuItem
				variant="destructive"
				onClick={() => action("remove")}
			>
				Remove
			</DropdownMenuItem>,
		);

	return (
		<DropdownMenu>
			<DropdownMenuTrigger className="bg-accent rounded p-1">
				<ChevronDown size={16} />
			</DropdownMenuTrigger>
			<DropdownMenuContent>{actions}</DropdownMenuContent>
		</DropdownMenu>
	);
};
