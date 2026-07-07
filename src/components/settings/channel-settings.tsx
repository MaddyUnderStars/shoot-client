import { useGuild } from "@/hooks/use-guild";
import { observer } from "mobx-react-lite";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Button } from "../ui/button";
import { getHttpClient } from "@/lib/http/client";
import type { ActorMention } from "@/lib/client/common/actor";
import NiceModal from "@ebay/nice-modal-react";
import { CreateChannelModal } from "../modal/create-channel-modal";

export const ChannelSettings = observer(() => {
	const guild = useGuild();

	const { $fetch } = getHttpClient();

	const deleteChannel = async (channel_id: ActorMention) => {
		await $fetch.DELETE("/channel/{channel_id}/", {
			params: {
				path: {
					channel_id,
				},
			},
		});
	};

	if (!guild) return null;

	const channels = guild.channels;

	return (
		<div>
			<Button
				onClick={() => {
					void NiceModal.show(CreateChannelModal, {
						guild,
					});
				}}
			>
				Create Channel
			</Button>

			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Name</TableHead>
						<TableHead></TableHead>
					</TableRow>
				</TableHeader>

				<TableBody>
					{channels.map((channel) => (
						<TableRow key={channel.mention}>
							<TableCell>{channel.name}</TableCell>
							<TableCell className="text-right">
								<Button
									variant="destructive"
									onClick={deleteChannel.bind(null, channel.mention)}
								>
									Delete
								</Button>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
});
