import { createFileRoute } from "@tanstack/react-router";
import { MessageComponent } from "@/components/message";
import { SettingsHeader } from "@/components/settings-header";
import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import type { Message } from "@/lib/client/entity/message";
import { getAppStore } from "@/lib/store/app-store";

export const Route = createFileRoute("/_authenticated/settings/theme/")({
	component: RouteComponent,
});

function RouteComponent() {
	const { setTheme } = useTheme();
	const settings = getAppStore().settings;

	return (
		<>
			<SettingsHeader>Look and Feel</SettingsHeader>

			<div className="p-4">
				<Label>Theme</Label>

				<div className="flex gap-2 mt-2">
					<Button onClick={() => setTheme("light")}>Light</Button>
					<Button onClick={() => setTheme("dark")}>Dark</Button>
					<Button onClick={() => setTheme("system")}>System</Button>
				</div>
			</div>

			<div className="p-4 max-w-md mt-4">
				<Label>UI Density</Label>

				<div className="flex gap-2 mt-4">
					<p className="text-sm text-muted-foreground">Compact</p>
					<Slider
						min={0.19}
						max={0.26}
						defaultValue={[settings.ui_density]}
						step={0.001}
						onValueChange={(v) => settings.setSettings({ ui_density: v[0] })}
					/>
					<p className="text-sm text-muted-foreground">Cosy</p>
				</div>
			</div>

			<div className="border-2 m-5 max-w-lg p-5">
				<MessageComponent
					showControls={false}
					message={
						{
							content: "Hey, this is how chat history will look!",
							author_id: getAppStore()!.user!.mention,
						} as Message
					}
				/>
				<MessageComponent
					showControls={false}
					showAuthor={false}
					message={
						{
							content: "Here's a second message",
							author_id: getAppStore()!.user!.mention,
						} as Message
					}
				/>
				<MessageComponent
					showControls={false}
					showAuthor={true}
					message={
						{
							content: "And a third :)",
							author_id: getAppStore()!.user!.mention,
						} as Message
					}
				/>
				<MessageComponent
					showControls={false}
					showAuthor={false}
					message={
						{
							content: "https://understars.dev",
							author_id: getAppStore()!.user!.mention,
							embeds: [
								{
									target: "https://understars.dev",
									title: "MaddyUnderStars",
									type: 3,
									images: [],
									videos: [],
									created_at: "",
									description: "Madeline's code dumping ground",
								},
							],
						} as unknown as Message
					}
				/>
			</div>
		</>
	);
}
