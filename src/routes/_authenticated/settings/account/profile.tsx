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
import { FilePreview } from "@/components/chat/file-preview";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { uploadFiles } from "@/lib/http/upload";

export const Route = createFileRoute("/_authenticated/settings/account/profile")({
	component: RouteComponent,
	loader: ({ context: { queryClient } }) => {
		const { $api } = getHttpClient();

		return queryClient.ensureQueryData($api.queryOptions("get", "/users/@me/"));
	},
});

// TODO: email changing requires password validation

const ProfileEditSchema = z.object({
	name: z.string(),
	// email: z.email().optional(),
	display_name: z.string().optional(),
	summary: z.string().optional(),

	avatar: z.instanceof(File).or(z.string()).optional(),
	banner: z.instanceof(File).or(z.string()).optional(),
});

function RouteComponent() {
	const { $fetch, $api } = getHttpClient();
	const { data: user } = $api.useSuspenseQuery("get", "/users/@me/");

	const form = useForm<z.infer<typeof ProfileEditSchema>>({
		resolver: zodResolver(ProfileEditSchema),
		defaultValues: {
			...user,
		},
	});

	const updateProfile = async (values: z.infer<typeof ProfileEditSchema>) => {
		let avatarHash: string | undefined = undefined;
		if (values.avatar && values.avatar instanceof File) {
			const ret = await uploadFiles([values.avatar], "@me");

			if (!ret[0]?.hash) throw new Error("Failed to upload avatar");

			avatarHash = ret[0].hash;
		}

		let bannerHash: string | undefined = undefined;
		if (values.banner && values.banner instanceof File) {
			const ret = await uploadFiles([values.banner], "@me");

			if (!ret[0]?.hash) throw new Error("Failed to upload avatar");

			bannerHash = ret[0].hash;
		}

		const { error } = await $fetch.PATCH("/users/@me/", {
			body: {
				display_name: values.display_name ?? undefined,
				// email: values.email ?? undefined,
				summary: values.summary ?? undefined,

				avatar: avatarHash,
				banner: bannerHash,
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
							name="avatar"
							render={({ field }) => {
								return (
									<FormItem>
										<FormLabel className="block cursor-pointer">
											<div className="mb-3">Avatar</div>
											<div>
												<Avatar className="size-20">
													{field.value instanceof File ? (
														<FilePreview
															className="size-20"
															file={field.value}
														/>
													) : (
														<AvatarImage src={user.avatar} />
													)}
													<AvatarFallback>
														<Skeleton className="size-20 rounded-lg" />
													</AvatarFallback>
												</Avatar>
											</div>
										</FormLabel>
										<FormControl>
											<Input
												hidden
												type="file"
												accept="image/*"
												onChange={(event) =>
													field.onChange(
														event.target.files
															? event.target.files[0]
															: undefined,
													)
												}
											/>
										</FormControl>
									</FormItem>
								);
							}}
						/>

						<FormField
							control={form.control}
							name="banner"
							render={({ field }) => {
								return (
									<FormItem>
										<FormLabel className="block cursor-pointer">
											<div className="mb-3">Banner</div>
											<div>
												{field.value instanceof File ? (
													<FilePreview
														className="max-w-md h-40"
														file={field.value}
													/>
												) : (
													<img
														src={user.banner}
														className="max-w-md h-40"
													/>
												)}
											</div>
										</FormLabel>
										<FormControl>
											<Input
												hidden
												type="file"
												accept="image/*"
												onChange={(event) =>
													field.onChange(
														event.target.files
															? event.target.files[0]
															: undefined,
													)
												}
											/>
										</FormControl>
									</FormItem>
								);
							}}
						/>

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
