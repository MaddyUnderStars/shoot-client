import { createFileRoute } from "@tanstack/react-router";
import { observer } from "mobx-react-lite";
import { NumberedSlider } from "@/components/numbered-slider";
import { SettingsHeader } from "@/components/settings-header";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { getAppStore } from "@/lib/store/app-store";

const RouteComponent = observer(() => {
	const settings = getAppStore().settings;

	return (
		<>
			<SettingsHeader>Voice</SettingsHeader>

			<div className="max-w-md p-4 flex flex-col gap-5">
				<div>
					<Label htmlFor="input-volume">Input volume</Label>
					<NumberedSlider
						defaultValue={[settings.voice.input_volume]}
						className="mt-4"
						label={(v) => `${(v?.[0] ?? 0) * 10}%`}
						min={0}
						max={10}
						step={0.1}
						onValueChange={(v) =>
							settings.setSettings({
								voice: {
									input_volume: v[0],
								},
							})
						}
					/>
				</div>

				<div>
					<Label htmlFor="input-volume">Output volume</Label>
					<NumberedSlider
						defaultValue={[settings.voice.output_volume]}
						className="mt-4"
						label={(v) => `${Math.round((v?.[0] ?? 0) * 100)}%`}
						min={0}
						max={1}
						step={0.01}
						onValueChange={(v) =>
							settings.setSettings({
								voice: {
									output_volume: v[0],
								},
							})
						}
					/>
				</div>

				<Separator />
				<span>The below settings will apply the next time you join a voice call.</span>

				<div className="flex items-center gap-3">
					<Checkbox
						id="agc-option"
						checked={settings.voice.agc}
						onCheckedChange={(v) =>
							settings.setSettings({
								voice: {
									agc: typeof v === "boolean" ? v : false,
								},
							})
						}
					/>
					<Label htmlFor="agc-option">Automatic gain control</Label>
				</div>

				<div className="flex items-center gap-3">
					<Checkbox
						id="echo-option"
						checked={settings.voice.echo}
						onCheckedChange={(v) =>
							settings.setSettings({
								voice: {
									echo: typeof v === "boolean" ? v : false,
								},
							})
						}
					/>
					<Label htmlFor="echo-option">Echo cancellation</Label>
				</div>

				<div className="flex items-center gap-3">
					<Checkbox
						id="noise-option"
						checked={settings.voice.noise}
						onCheckedChange={(v) =>
							settings.setSettings({
								voice: {
									noise: typeof v === "boolean" ? v : false,
								},
							})
						}
					/>
					<Label htmlFor="noise-option">Noise Suppression</Label>
				</div>
			</div>
		</>
	);
});

export const Route = createFileRoute("/_authenticated/settings/voice/devices")({
	component: RouteComponent,
});
