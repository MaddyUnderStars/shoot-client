import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute } from "@tanstack/react-router";
import { useForm, useFormContext } from "react-hook-form";
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
import { uploadFiles } from "@/lib/http/upload";
import { Loader2Icon, UserIcon, XIcon } from "lucide-react";
import type { ApiPublicUser } from "@/lib/http/types";
import { useState } from "react";

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
	display_name: z.string().or(z.literal("")),
	summary: z.string().or(z.literal("")),

	avatar: z.instanceof(File).or(z.string()).nullish(),
	banner: z.instanceof(File).or(z.string()).nullish(),
});

function RouteComponent() {
	const { $fetch, $api } = getHttpClient();
	const { data: user } = $api.useSuspenseQuery("get", "/users/@me/");
	const [isLoading, setIsLoading] = useState(false);

	const form = useForm<z.infer<typeof ProfileEditSchema>>({
		resolver: zodResolver(ProfileEditSchema),
		defaultValues: {
			...user,

			display_name: user.display_name || "",
			summary: user.summary || "",
		},
	});

	const updateProfile = async (values: z.infer<typeof ProfileEditSchema>) => {
		setIsLoading(true);

		let avatarHash: string | undefined | null = undefined;
		if (values.avatar && values.avatar instanceof File) {
			try {
				const ret = await uploadFiles([values.avatar], "@me");

				if (!ret[0]?.hash) throw new Error("Failed to upload avatar");

				avatarHash = ret[0].hash;
			} catch (e) {
				setIsLoading(false);
				return form.setError("avatar", {
					message: e instanceof Error ? e.message : JSON.stringify(e),
				});
			}
		} else if (values.avatar === null) avatarHash = null;

		let bannerHash: string | undefined | null = undefined;
		if (values.banner && values.banner instanceof File) {
			try {
				const ret = await uploadFiles([values.banner], "@me");

				if (!ret[0]?.hash) throw new Error("Failed to upload avatar");

				bannerHash = ret[0].hash;
			} catch (e) {
				setIsLoading(false);

				return form.setError("banner", {
					message: e instanceof Error ? e.message : JSON.stringify(e),
				});
			}
		} else if (values.banner === null) bannerHash = null;

		const { error } = await $fetch.PATCH("/users/@me/", {
			body: {
				display_name: values.display_name,
				// email: values.email ?? undefined,
				summary: values.summary,

				avatar: avatarHash,
				banner: bannerHash,
			},
		});

		setIsLoading(false);

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
						<AvatarInput user={user} />

						<BannerInput user={user} />

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

						<Button type="submit">{!isLoading ? "Save" : <Loader2Icon />}</Button>
					</form>
				</Form>
			</div>
		</>
	);
}

const AvatarInput = ({ user }: { user: ApiPublicUser }) => {
	const form = useFormContext();

	return (
		<FormField
			control={form.control}
			name="avatar"
			render={({ field }) => {
				return (
					<FormItem>
						<FormLabel className="block cursor-pointer">
							<div className="mb-3 flex items-center gap-2">
								Avatar
								<button
									type="button"
									className="cursor-pointer"
									onClick={() => form.setValue("avatar", null)}
									aria-label="Remove avatar"
								>
									<XIcon className="p-1 m-1 bg-destructive text-foreground" />
								</button>
							</div>
							<FormMessage />
							<Avatar className="size-20">
								{field.value instanceof File ? (
									<FilePreview className="size-20" file={field.value} />
								) : (
									<AvatarImage src={field.value ? user.avatar : undefined} />
								)}
								<AvatarFallback>
									<UserIcon className="size-10" />
								</AvatarFallback>
							</Avatar>
						</FormLabel>
						<FormControl>
							<Input
								hidden
								type="file"
								accept="image/*"
								onChange={(event) =>
									field.onChange(
										event.target.files ? event.target.files[0] : undefined,
									)
								}
							/>
						</FormControl>
					</FormItem>
				);
			}}
		/>
	);
};

const BannerInput = ({ user }: { user: ApiPublicUser }) => {
	const form = useFormContext();

	return (
		<FormField
			control={form.control}
			name="banner"
			render={({ field }) => {
				return (
					<FormItem>
						<FormLabel className="block cursor-pointer">
							<div className="mb-3 flex items-center gap-2">
								Banner
								<button
									type="button"
									className="cursor-pointer"
									onClick={() => form.setValue("banner", null)}
									aria-label="Remove banner"
								>
									<XIcon className="p-1 m-1 bg-destructive text-foreground" />
								</button>
							</div>
							<FormMessage />
							<div>
								{field.value instanceof File ? (
									<FilePreview className="aspect-110/44" file={field.value} />
								) : field.value ? (
									<img src={user.banner} className="aspect-110/44" />
								) : (
									<div className="aspect-110/44 bg-black/40 flex items-center justify-center">
										You don't have a banner!
									</div>
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
										event.target.files ? event.target.files[0] : undefined,
									)
								}
							/>
						</FormControl>
					</FormItem>
				);
			}}
		/>
	);
};
