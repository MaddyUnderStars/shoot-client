import { SettingsHeader } from "@/components/settings-header";
import { ChannelSettings } from "@/components/settings/channel-settings";
import { GuildSettings } from "@/components/settings/guild-settings";
import { MembershipEditor } from "@/components/settings/roles/membership-editor";
import { RoleSettings } from "@/components/settings/roles/role-settings";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGuild } from "@/hooks/use-guild";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/settings/guild/$guildId")({
	component: RouteComponent,
});

const setUrl = (value: string) => {
	window.location.hash = value;
};

function RouteComponent() {
	const guild = useGuild();

	if (!guild) return null;

	return (
		<>
			<SettingsHeader>{guild.name}</SettingsHeader>

			<Tabs
				className="p-4"
				defaultValue={window.location.hash.replaceAll("#", "") || "guild"}
				onValueChange={setUrl}
			>
				<TabsList>
					<TabsTrigger value="guild">General</TabsTrigger>
					<TabsTrigger value="roles">Roles</TabsTrigger>
					<TabsTrigger value="members">Membership</TabsTrigger>
					<TabsTrigger value="channels">Channels</TabsTrigger>
				</TabsList>

				<TabsContent value="guild">
					<GuildSettings />
				</TabsContent>

				<TabsContent value="roles">
					<RoleSettings />
				</TabsContent>

				<TabsContent value="members">
					<MembershipEditor />
				</TabsContent>

				<TabsContent value="channels">
					<ChannelSettings />
				</TabsContent>
			</Tabs>
		</>
	);
}
