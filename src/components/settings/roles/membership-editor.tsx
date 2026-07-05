import { Mention } from "@/components/chat/mention";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useGuild } from "@/hooks/use-guild";
import type { ActorMention } from "@/lib/client/common/actor";
import { getHttpClient } from "@/lib/http/client";
import { useQueryClient } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { PlusSquareIcon } from "lucide-react";
import { observer } from "mobx-react-lite";
import { useState } from "react";

type TableData = {
	mention: string;
	nickname: string | undefined;
	roles: string[];
};

const MemberColumns: ColumnDef<TableData>[] = [
	{
		accessorKey: "mention",
		header: "User",
		cell({ row }) {
			return <Mention user={row.getValue("mention")} />;
		},
	},
	{
		accessorKey: "roles",
		header: "Roles",
		cell({ row }) {
			const user_id = row.getValue<ActorMention>("mention");
			const roles = row.getValue<string[]>("roles");

			const guild = useGuild();
			const { $fetch } = getHttpClient();

			if (!guild) return null;

			const selectRole = async (role_id: string) => {
				await $fetch.PATCH("/guild/{guild_id}/members/{user_id}/", {
					params: {
						path: {
							user_id,
							guild_id: guild.mention,
						},
					},
					body: {
						roles: roles.includes(role_id)
							? roles.filter((x) => x !== role_id)
							: [...roles, role_id],
					},
				});
			};

			return (
				<div className="flex items-center">
					{roles.map((role_id) => {
						const role = guild?.roles.find((x) => x.id === role_id);
						if (!role) return null; // hm

						return <span className="bg-sidebar p-1 mx-1">@{role.name}</span>;
					})}

					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" className="size-6 p-0">
								<PlusSquareIcon className="size-4" />
							</Button>
						</DropdownMenuTrigger>

						<DropdownMenuContent align="end">
							<DropdownMenuLabel>Roles</DropdownMenuLabel>
							{guild?.roles
								.filter((x) => x.id !== guild.mention.split("@")[0])
								.map((role) => (
									<DropdownMenuCheckboxItem
										onSelect={(e: Event) => e.preventDefault()}
										onCheckedChange={() => selectRole(role.id)}
										checked={!!roles.find((x) => x === role.id)}
									>
										{role.name}
									</DropdownMenuCheckboxItem>
								))}
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			);
		},
	},
];

export const MembershipEditor = observer(() => {
	const guild = useGuild();

	const client = useQueryClient();
	const { $api } = getHttpClient();

	const [page, setPage] = useState(0);

	const { data } = $api.useQuery(
		"get",
		"/guild/{guild_id}/members/",
		{
			params: { path: { guild_id: guild!.mention }, query: { limit: 10, page } },
		},
		{},
		client,
	);

	const members =
		data?.members?.map((row) => ({
			mention: row.user.mention,
			nickname: row.nickname,
			roles: row.roles,
		})) || [];

	return (
		<div className="p-4">
			<DataTable
				columns={MemberColumns}
				data={members}
				rowCount={data?.total || 0}
				nextPage={() => setPage((page) => page + 1)}
				prevPage={() => setPage((page) => page - 1)}
			/>
		</div>
	);
});
