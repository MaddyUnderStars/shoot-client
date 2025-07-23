import { zodResolver } from "@hookform/resolvers/zod";
import { PanelLeftDashed } from "lucide-react";
import { useForm } from "react-hook-form";
import z from "zod";
import { useIsMobile } from "@/hooks/use-mobile";
import { ActorMention } from "@/lib/client/common/actor";
import { getHttpClient } from "@/lib/http/client";
import { getAppStore } from "@/lib/store/AppStore";
import { RelationshipComponent } from "./relationship";
import { Button } from "./ui/button";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { SidebarTrigger } from "./ui/sidebar";

const AddFriendSchema = z.object({
	mention: ActorMention,
});

export const FriendsPane = () => {
	const isMobile = useIsMobile();

	const relationships = getAppStore().relationships;

	const form = useForm<z.infer<typeof AddFriendSchema>>({
		resolver: zodResolver(AddFriendSchema),
	});

	const { $fetch } = getHttpClient();

	const addFriend = async ({ mention }: z.infer<typeof AddFriendSchema>) => {
		const { error } = await $fetch.POST("/users/{user_id}/relationship/", {
			params: {
				path: {
					user_id: mention,
				},
			},
			body: {
				type: "pending",
			},
		});

		if (error) return form.setError("mention", { message: error.message });
	};

	return (
		<div>
			<div className="p-4 bg-sidebar w-full border-b h-min">
				<h1>
					{!isMobile ? null : (
						<SidebarTrigger variant="ghost">
							<PanelLeftDashed />
						</SidebarTrigger>
					)}
					Friends
				</h1>
			</div>

			<div className="p-2">
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(addFriend)}
						className="p-2 flex gap-2 items-end"
					>
						<FormField
							control={form.control}
							name="mention"
							render={({ field }) => (
								<FormItem className="flex-1">
									<FormLabel>Add friend</FormLabel>
									<FormDescription>
										Enter the mention of the user you wish
										to friend below.
									</FormDescription>
									<FormControl>
										<Input
											{...field}
											placeholder="user@example.com"
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<Button type="submit">Add</Button>
					</form>
				</Form>

				<div className="mt-5">
					{relationships.map((x) => (
						<RelationshipComponent rel={x} key={x.user.mention} />
					))}
				</div>
			</div>
		</div>
	);
};
