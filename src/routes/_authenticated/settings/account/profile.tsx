import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import z from "zod";
import { SettingsHeader } from "@/components/settings-header";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { getHttpClient } from "@/lib/http/client";
import type { ApiPrivateUser } from "@/lib/http/types";

export const Route = createFileRoute("/_authenticated/settings/account/profile")({
	component: Wrapper,
});

// TODO: email changing requires password validation

const ProfileEditSchema = z.object({
	name: z.string(),
	// email: z.email().optional(),
	display_name: z.string().optional(),
	summary: z.string().optional(),
});

function Wrapper() {
	const { $api } = getHttpClient();

	const { data, error } = $api.useQuery("get", "/users/@me/");

	if (error || !data) {
		return <h1>Something went wrong?</h1>;
	}

	return <RouteComponent user={data} />;
}

function RouteComponent({ user }: { user: ApiPrivateUser }) {
	const { $fetch } = getHttpClient();

	const form = useForm<z.infer<typeof ProfileEditSchema>>({
		resolver: zodResolver(ProfileEditSchema),
		defaultValues: {
			...user,
		},
	});

	const updateProfile = async (values: z.infer<typeof ProfileEditSchema>) => {
		const { error } = await $fetch.PATCH("/users/@me/", {
			body: {
				display_name: values.display_name ?? undefined,
				// email: values.email ?? undefined,
				summary: values.summary ?? undefined,
			},
		});

		if (error)
			return form.setError("name", {
				message: error.message,
			});
	};

	return (
		<>
			<SettingsHeader>Profile</SettingsHeader>

			<div className="p-4 max-w-md">
				<Form {...form}>
					<form onSubmit={form.handleSubmit(updateProfile)} className="space-y-4">
						<FormField
							control={form.control}
							name="name"
							disabled
							render={({ field }) => (
								<FormItem>
									<FormLabel>Username</FormLabel>
									<FormDescription>
										You cannot change your username.
									</FormDescription>
									<FormControl>
										<Input {...field} autoComplete="off" />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* <FormField
								control={form.control}
								name="email"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Email</FormLabel>
										<FormControl>
											<Input {...field} type="email" />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/> */}

						<FormField
							control={form.control}
							name="display_name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Display Name</FormLabel>
									<FormDescription>
										This name will overwrite your username for display purposes.
										It will not change your handle
									</FormDescription>
									<FormControl>
										<Input {...field} />
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
									<FormDescription>Your profile summary/bio</FormDescription>
									<FormControl>
										<Input {...field} />
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
