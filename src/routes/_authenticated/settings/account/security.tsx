import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import z from "zod";
import { SettingsHeader } from "@/components/settings-header";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { getHttpClient } from "@/lib/http/client";
import { getAppStore } from "@/lib/store/app-store";

export const Route = createFileRoute("/_authenticated/settings/account/security")({
	component: RouteComponent,
});

const SecurityEditSchema = z.object({
	email: z.string().optional(),
	password: z.string().optional(),
	current_password: z.string({ error: "Enter current password to make changes" }),
});

function RouteComponent() {
	const { $fetch } = getHttpClient();
	const user = getAppStore().user;

	const form = useForm<z.infer<typeof SecurityEditSchema>>({
		resolver: zodResolver(SecurityEditSchema),
		defaultValues: {
			email: user?.email,
		},
	});

	const updateSecurity = async (values: z.infer<typeof SecurityEditSchema>) => {
		const { error } = await $fetch.PATCH("/users/@me/", {
			body: {
				current_password: values.current_password,

				email: values.email,
				password: values.password,
			},
		});

		if (error)
			return form.setError("current_password", {
				message: error.message,
			});
	};

	return (
		<>
			<SettingsHeader>Security</SettingsHeader>

			<div className="max-w-md p-4">
				<Form {...form}>
					<form onSubmit={form.handleSubmit(updateSecurity)} className="space-y-4">
						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email</FormLabel>
									<FormControl>
										<Input {...field} type="email" autoComplete="off" />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="password"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Password</FormLabel>
									<FormControl>
										<Input {...field} type="password" autoComplete="off" />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="current_password"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Current password</FormLabel>
									<FormControl>
										<Input {...field} type="password" autoComplete="off" />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<Button type="submit">Save</Button>
					</form>
				</Form>
			</div>
		</>
	);
}
