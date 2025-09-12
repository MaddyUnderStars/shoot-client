import NiceModal, { useModal } from "@ebay/nice-modal-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import type { Guild } from "@/lib/client/entity/guild";
import { getHttpClient } from "@/lib/http/client";
import { ModalCloseButton } from "../modal-close-btn";
import { ModalContainer } from "../modal-container";
import { Button } from "../ui/button";
import { CardAction, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";

const CreateChannelSchema = z.object({
	name: z
		.string({ error: "Must specify channel name" })
		.min(1, { error: "Channel name must not be empty" }),
});

export const CreateChannelModal = NiceModal.create(({ guild }: { guild: Guild }) => {
	const { $fetch } = getHttpClient();

	const modal = useModal();

	const form = useForm<z.infer<typeof CreateChannelSchema>>({
		resolver: zodResolver(CreateChannelSchema),
	});

	const createChannel = async ({ name }: z.infer<typeof CreateChannelSchema>) => {
		const { error } = await $fetch.POST("/guild/{guild_id}/channel/", {
			params: {
				path: {
					guild_id: guild.mention,
				},
			},
			body: {
				name,
			},
		});

		if (error) {
			return form.setError("name", {
				message: error.message,
			});
		}

		modal.remove();
	};

	return (
		<ModalContainer>
			<CardHeader>
				<CardTitle>Create channel in {guild.name}</CardTitle>

				<CardAction>
					<ModalCloseButton />
				</CardAction>
			</CardHeader>

			<CardContent>
				<Form {...form}>
					<form id="create-channel-form" onSubmit={form.handleSubmit(createChannel)}>
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Name</FormLabel>
									<FormControl>
										<Input {...field} autoComplete="off" />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</form>
				</Form>
			</CardContent>

			<CardFooter>
				<Button form="create-channel-form" type="submit" variant="outline">
					Create
				</Button>
			</CardFooter>
		</ModalContainer>
	);
});
