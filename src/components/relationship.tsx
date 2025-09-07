import { useNavigate } from "@tanstack/react-router";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { type Relationship, RelationshipType } from "@/lib/client/entity/relationship";
import { getHttpClient } from "@/lib/http/client";
import { getAppStore } from "@/lib/store/app-store";
import { cn } from "@/lib/utils";
import { UserPopover } from "./popover/user-popover";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Popover, PopoverTrigger } from "./ui/popover";

export const RelationshipComponent = ({ rel }: { rel: Relationship }) => {
	return (
		<div className="flex-1 flex items-center justify-between hover:bg-black/20 rounded p-3 group">
			<Popover>
				<PopoverTrigger>
					<div className="grid flex-1 text-left text-sm leading-right">
						<span className="truncate font-medium">{rel.user.display_name}</span>
						<span className="truncate font-xs">@{rel.user.domain}</span>
					</div>
				</PopoverTrigger>
				<UserPopover user={rel.user.mention} />
			</Popover>

			<RelationshipActions rel={rel} />
		</div>
	);
};

const RelationshipActions = ({ rel }: { rel: Relationship }) => {
	const [open, setOpen] = useState<boolean>();

	const { $fetch } = getHttpClient();

	const action = async (type: "unblock" | "block" | "accept" | "remove") => {
		if (type === "remove") {
			const { error } = await $fetch.DELETE("/users/{user_id}/relationship/", {
				params: {
					path: {
						user_id: rel.user.mention,
					},
				},
			});

			// TODO: handle errors
			if (error) throw new Error(error.message);
			return;
		}

		if (type === "accept") {
			const { error } = await $fetch.POST("/users/{user_id}/relationship/", {
				params: {
					path: {
						user_id: rel.user.mention,
					},
				},
			});

			// TODO: handle errors
			if (error) throw new Error(error.message);
			return;
		}
	};

	const app = getAppStore();

	const navigate = useNavigate();

	const openDm = async () => {
		if (!app.user) return; // hmm

		const existing = app.findDmChannel([app.user.mention, rel.user.mention]);
		if (existing) {
			return navigate({
				to: "/channel/$channelId",
				params: {
					channelId: existing.mention,
				},
			});
		}

		const { data, error } = await $fetch.POST("/users/{user_id}/channels/", {
			params: {
				path: {
					user_id: rel.user.mention,
				},
			},
			body: {
				name: `${rel.user.display_name ?? rel.user.name} & ${app.user.display_name ?? app.user.name}`,
			},
		});

		// TODO: better error handling. maybe a toast?
		if (error) throw new Error(error.message);

		navigate({
			to: "/channel/$channelId",
			params: {
				channelId: data.mention,
			},
		});
	};

	const actions: React.ReactNode[] = [];

	actions.push(
		<DropdownMenuItem key="friend-action-dm" onClick={() => openDm()}>
			Open DM
		</DropdownMenuItem>,
	);

	if (rel.type === RelationshipType.pending)
		actions.push(
			<DropdownMenuItem key="friend-action-accept" onClick={() => action("accept")}>
				Accept
			</DropdownMenuItem>,
		);
	else
		actions.push(
			<DropdownMenuItem
				key="friend-action-block"
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
				key="friend-action-unblock"
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
				key="friend-action-remove"
				variant="destructive"
				onClick={() => action("remove")}
			>
				Remove
			</DropdownMenuItem>,
		);

	return (
		<DropdownMenu onOpenChange={(open) => setOpen(open)}>
			<DropdownMenuTrigger
				className={cn(["p-2 bg-accent rounded group-hover:block", open ? "" : "hidden"])}
			>
				<ChevronDown size={16} />
			</DropdownMenuTrigger>
			<DropdownMenuContent>{actions}</DropdownMenuContent>
		</DropdownMenu>
	);
};
