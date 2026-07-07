import { observer } from "mobx-react-lite";
import z from "zod";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "../ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useGuild } from "@/hooks/use-guild";
import { Input } from "../ui/input";
import { getHttpClient } from "@/lib/http/client";
import { Button } from "../ui/button";
import { useState } from "react";

const GuildEditSchema = z.object({
	name: z.string(),
	summary: z.string().optional(),
});

export const GuildSettings = observer(() => {
	const guild = useGuild();
	const { $fetch } = getHttpClient();

	const form = useForm<z.infer<typeof GuildEditSchema>>({
		resolver: zodResolver(GuildEditSchema),
		defaultValues: {
			name: guild?.name,
			summary: guild?.summary,
		},
	});
	const [isLoading, setLoading] = useState(false);

	if (!guild) return null;

	const submit = async (values: z.infer<typeof GuildEditSchema>) => {
		try {
			setLoading(true);
			const res = await $fetch.PATCH("/guild/{guild_id}/", {
				params: {
					path: {
						guild_id: guild.mention,
					},
				},
				body: {
					name: values.name,
					summary: values?.summary,
				},
			});

			if (res.error) {
				form.setError("name", {
					message: res.error.message,
				});
			}
		} catch {
			form.setError("name", {
				message: "Failed to save",
			});
		}
		setLoading(false);
	};

	return (
		<div className="max-w-md">
			<Form {...form}>
				<form onSubmit={form.handleSubmit(submit)} className="space-y-4">
					<FormField
						control={form.control}
						name="name"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Display Name</FormLabel>
								<FormControl>
									<Input {...field} autoComplete="off" />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="summary"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Summary</FormLabel>
								<FormDescription>A short summary of this guild</FormDescription>
								<FormControl>
									<Input
										{...field}
										placeholder="Publishing activities..."
										autoComplete="off"
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<Button type="submit" disabled={isLoading}>
						Save
					</Button>
				</form>
			</Form>
		</div>
	);
});
