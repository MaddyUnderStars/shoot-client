import NiceModal, { useModal } from "@ebay/nice-modal-react";
import { useNavigate } from "@tanstack/react-router";
import type { Guild } from "@/lib/client/entity/guild";
import { getHttpClient } from "@/lib/http/client";
import { ModalCloseButton } from "../modal-close-btn";
import { ModalContainer } from "../modal-container";
import { Button } from "../ui/button";
import { CardAction, CardContent, CardHeader, CardTitle } from "../ui/card";

export const DeleteGuildModal = NiceModal.create(({ guild }: { guild: Guild }) => {
	const modal = useModal();
	const navigate = useNavigate();
	const { $fetch } = getHttpClient();

	const deleteGuild = async () => {
		await $fetch.DELETE("/guild/{guild_id}/", {
			params: {
				path: {
					guild_id: guild.mention,
				},
			},
		});

		modal.remove();
		await navigate({
			to: "/channel/@me",
		});
	};

	return (
		<ModalContainer>
			<CardHeader>
				<CardTitle>Really delete '{guild.name}'?</CardTitle>

				<CardAction>
					<ModalCloseButton />
				</CardAction>
			</CardHeader>

			<CardContent className="flex gap-2">
				<Button onClick={() => deleteGuild()} variant={"destructive"}>
					Yes!
				</Button>
				<Button onClick={() => modal.remove()}>Cancel</Button>
			</CardContent>
		</ModalContainer>
	);
});
