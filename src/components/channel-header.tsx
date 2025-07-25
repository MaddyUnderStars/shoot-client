import { Hash, PanelLeftDashed, PhoneCall } from "lucide-react";
import { useChannel } from "@/hooks/use-channel";
import { useIsMobile } from "@/hooks/use-mobile";
import { getHttpClient } from "@/lib/http/client";
import { getAppStore } from "@/lib/store/AppStore";
import { Button } from "./ui/button";
import { SidebarTrigger } from "./ui/sidebar";

export const ChannelHeader = () => {
	const channel = useChannel();
	const isMobile = useIsMobile();

	const { $fetch } = getHttpClient();

	const app = getAppStore();

	const startCall = async () => {
		if (!channel) return;

		const { data, error, response } = await $fetch.POST(
			"/channel/{channel_id}/call/",
			{
				params: {
					path: {
						channel_id: channel.mention,
					},
				},
			},
		);

		// TODO
		if (error || !data || response.status !== 200)
			throw new Error(error?.message ?? "unknown error with webrtc");

		const { token, ip } = data as { token: string; ip: string };

		app.startWebrtc(channel.mention, new URL(ip), token);
	};

	if (!channel) return undefined;

	return (
		<div className="p-4 bg-sidebar w-full border-b h-min flex justify-between">
			<h1>
				{!isMobile ? null : (
					<SidebarTrigger variant="ghost">
						<PanelLeftDashed />
					</SidebarTrigger>
				)}
				<Hash size={16} className="inline" /> {channel.name}
			</h1>

			<div>
				<Button variant="outline" onClick={() => startCall()}>
					<PhoneCall size={16} />
				</Button>
			</div>
		</div>
	);
};
