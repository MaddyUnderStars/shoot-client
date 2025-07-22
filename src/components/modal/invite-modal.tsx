import NiceModal, { useModal } from "@ebay/nice-modal-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { XIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import type { Channel } from "@/lib/client/entity/channel";
import type { Guild } from "@/lib/client/entity/guild";
import { getHttpClient } from "@/lib/http/client";
import { ModalContainer } from "../modal-container";
import { Button } from "../ui/button";
import { CardAction, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

const CreateInviteSchema = z.object({
	expiry: z.iso.date().optional(),
});

export const CreateInviteModal = NiceModal.create(
	({ guild, channel }: { guild: Guild; channel?: Channel }) => {
		const modal = useModal();

		const form = useForm<z.infer<typeof CreateInviteSchema>>({
			resolver: zodResolver(CreateInviteSchema),
		});

		const [inviteCode, setInviteCode] = useState<string | null>(null);

		const { $fetch } = getHttpClient();

		const createInvite = async (
			input: z.infer<typeof CreateInviteSchema>,
		) => {
			form.clearErrors();

			const { data, error } = await $fetch.POST(
				"/guild/{guild_id}/invite",
				{
					params: {
						path: {
							guild_id: guild.mention,
						},
					},
					body: {
						expiry: input.expiry
							? new Date(input.expiry).toISOString()
							: undefined,
					},
				},
			);

			if (error) {
				return form.setError("expiry", { message: error.message });
			}

			setInviteCode(data.code);
		};

		// biome-ignore lint/correctness/useExhaustiveDependencies: .
		useEffect(() => {
			form.clearErrors();
			createInvite({});
		}, [guild]);

		return (
			<ModalContainer>
				<CardHeader>
					<CardTitle>
						Invite to {channel ? channel.name : guild.name}
					</CardTitle>

					<CardAction>
						<button
							className="pointer-events-auto"
							type="button"
							title="Close"
							onClick={modal.remove}
							onKeyDown={modal.remove}
						>
							<XIcon />
						</button>
					</CardAction>
				</CardHeader>

				<CardContent>
					<Form {...form}>
						<form onChange={form.handleSubmit(createInvite)}>
							<FormField
								control={form.control}
								name="expiry"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Expiry</FormLabel>
										<FormControl>
											<Input type="date" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</form>
					</Form>

					<div className="mt-4 flex flex-col gap-2">
						<Label>Code</Label>
						<div className="flex w-full max-w-sm items-center gap-2">
							<Input
								type="text"
								readOnly
								placeholder="Invite code here"
								value={
									inviteCode
										? `${inviteCode}@${guild.domain}`
										: "Invite code"
								}
							/>
							<Button type="button" variant="outline">
								Copy
							</Button>
						</div>
					</div>
				</CardContent>
			</ModalContainer>
		);
	},
);
