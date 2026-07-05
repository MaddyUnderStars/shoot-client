import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGuild } from "@/hooks/use-guild";
import { getHttpClient } from "@/lib/http/client";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import { RoleEditor } from "./role-editor";

export const RoleSettings = observer(() => {
	const guild = useGuild();
	const { $fetch } = getHttpClient();

	const everyoneRole = guild?.mention?.split("@")?.[0];
	const [selectedRole, setSelectedRole] = useState(everyoneRole);

	if (!guild) return null;

	const createRole = async () => {
		const { data } = await $fetch.POST("/guild/{guild_id}/roles/", {
			body: {
				name: "Unnamed role",
			},
			params: {
				path: {
					guild_id: guild.mention,
				},
			},
		});

		if (!data) return;

		setSelectedRole(data.id);
	};

	const sortedRoles = guild.roles.toSorted((a, b) => b.position - a.position);

	return (
		<div>
			<div className="mt-2">
				<Tabs
					defaultValue={everyoneRole}
					orientation="vertical"
					value={selectedRole}
					onValueChange={setSelectedRole}
				>
					<div className="flex flex-col gap-2">
						<Button onClick={createRole}>Create Role</Button>

						<TabsList className="w-30">
							{sortedRoles.map((role) => (
								<TabsTrigger className="truncate" key={role.id} value={role.id}>
									{role.name}
								</TabsTrigger>
							))}
						</TabsList>
					</div>

					{sortedRoles.map((role) => (
						<TabsContent key={role.id} value={role.id}>
							<RoleEditor role={role} guild={guild} />
						</TabsContent>
					))}
				</Tabs>
			</div>
		</div>
	);
});
