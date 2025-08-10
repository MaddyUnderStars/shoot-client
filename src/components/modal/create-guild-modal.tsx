import NiceModal, { useModal } from "@ebay/nice-modal-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { getHttpClient } from "@/lib/http/client";
import { capitalise } from "@/lib/utils";
import { ModalCloseButton } from "../modal-close-btn";
import { ModalContainer } from "../modal-container";
import { Button } from "../ui/button";
import {
	CardAction,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "../ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";

const CreateOrJoinGuildSchema = z.object({
	data: z.string(),
});

export const CreateGuildModal = NiceModal.create(() => {
	const [mode, setMode] = useState<"create" | "join">("join");

	const modal = useModal();

	const { $fetch } = getHttpClient();

	const navigate = useNavigate();

	const form = useForm<z.infer<typeof CreateOrJoinGuildSchema>>({
		resolver: zodResolver(CreateOrJoinGuildSchema),
	});

	const createGuild = async (name: string) => {
		const { data, error } = await $fetch.POST("/guild/", {
			body: {
				name,
			},
		});

		if (error) {
			form.setError("data", {
				message: error.message,
			});
			return;
		}

		modal.remove();
		await navigate({
			to: "/channel/$guildId/{-$channelId}",
			params: {
				guildId: data.mention,
			},
		});
	};

	const joinGuild = async (code: string) => {
		const { error } = await $fetch.POST("/invite/{invite_code}", {
			params: {
				path: {
					invite_code: code,
				},
			},
		});

		if (error) {
			form.setError("data", {
				message: error.message,
			});
			return;
		}

		// TODO: wait for the gateway response?

		modal.remove();
	};

	const formAction = async ({ data }: z.infer<typeof CreateOrJoinGuildSchema>) => {
		if (mode === "create") return createGuild(data);
		else return joinGuild(data);
	};

	return (
		<ModalContainer>
			<CardHeader>
				<CardTitle>{capitalise(mode)} Guild</CardTitle>
				<CardDescription>
					{mode === "create"
						? "Create a guild below"
						: "Join a guild using it's invite code"}
				</CardDescription>
				<CardAction>
					<ModalCloseButton />
				</CardAction>
			</CardHeader>

			<CardContent>
				{/* <form id="create-or-join-guild-form" onSubmit={formAction}>

				</form> */}

				<Form {...form}>
					<form id="create-or-join-guild-form" onSubmit={form.handleSubmit(formAction)}>
						<FormField
							control={form.control}
							name="data"
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										{mode === "join" ? "Invite Code" : "Title"}
									</FormLabel>
									<FormControl>
										<Input
											placeholder={
												mode === "join"
													? "code@example.com"
													: "My Cool Guild"
											}
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</form>
				</Form>
			</CardContent>

			<CardFooter className="gap-2 justify-between">
				<Button variant="outline" form="create-or-join-guild-form" type="submit">
					{mode === "create" ? "Create" : "Join"}
				</Button>

				<Button
					variant="outline"
					onClick={() => setMode(mode === "create" ? "join" : "create")}
				>
					{mode === "create" ? "Join" : "Create"} instead?
				</Button>
			</CardFooter>
		</ModalContainer>
	);
});
