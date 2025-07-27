import pDebounce from "p-debounce";
import { useEffect, useState } from "react";
import { validateInstance } from "@/lib/instance";
import {
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";

const DEFAULT_INSTANCE =
	import.meta.env.VITE_DEFAULT_INSTANCE ?? "https://chat.understars.dev";

const LOCK_INSTANCE = !!import.meta.env.VITE_LOCK_INSTANCE;

export const InstanceValidatorField = ({
	showInviteField,
	form,
	// biome-ignore lint/suspicious/noExplicitAny: TODO
}: { showInviteField: boolean } & any) => {
	const [isValidatingInstance, setValidatingInstance] = useState(false);
	const [nodeinfo, setNodeinfo] = useState<
		{ openRegistrations: boolean } | undefined
	>();

	const debounced = pDebounce(async (instance: string) => {
		form.clearErrors("instance");
		setValidatingInstance(true);
		const nodeInfo = await validateInstance(instance);
		setValidatingInstance(false);
		if (!nodeInfo) {
			setNodeinfo(undefined);
			return form.setError("instance", {
				message: "Offline or misconfigured",
			});
		}

		setNodeinfo(nodeInfo);
	}, 500);

	// biome-ignore lint/correctness/useExhaustiveDependencies: .
	useEffect(() => {
		debounced(DEFAULT_INSTANCE);
	}, []);

	return (
		<>
			{!LOCK_INSTANCE ? (
				<FormField
					control={form.control}
					name="instance"
					render={({ field }) => (
						<FormItem>
							<FormLabel>
								Instance
								{isValidatingInstance ? (
									<span> - Checking</span>
								) : null}
							</FormLabel>
							<FormDescription>
								Your account provider
							</FormDescription>
							<FormControl>
								<Input
									placeholder={DEFAULT_INSTANCE}
									{...field}
									onChangeCapture={(
										e: React.ChangeEvent<HTMLInputElement>,
									) => debounced(e.target.value)}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
			) : null}

			{showInviteField && nodeinfo?.openRegistrations === false ? (
				<FormField
					control={form.control}
					name="invite"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Invite Token</FormLabel>
							<FormDescription>
								This instance has closed registration. You may
								use an invite token to join.
							</FormDescription>
							<FormControl>
								<Input {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
			) : null}
		</>
	);
};
