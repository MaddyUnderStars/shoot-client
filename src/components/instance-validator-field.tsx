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
import type { UseFormReturn } from "react-hook-form";

const DEFAULT_INSTANCE = import.meta.env.VITE_DEFAULT_INSTANCE ?? "https://understars.dev";

const LOCK_INSTANCE = !!import.meta.env.VITE_LOCK_INSTANCE;

export const InstanceValidatorField = ({
	showInviteField,
	form,
}: {
	showInviteField?: boolean;
	form: UseFormReturn<any>;
}) => {
	const [isValidatingInstance, setValidatingInstance] = useState(false);
	const [nodeinfo, setNodeinfo] = useState<
		| {
				openRegistrations: boolean;
		  }
		| undefined
	>();

	const debounced = pDebounce(async (instance: string): Promise<void> => {
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

	useEffect(() => {
		void debounced(DEFAULT_INSTANCE);
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
								{isValidatingInstance ? <span> - Checking</span> : null}
							</FormLabel>
							<FormDescription>Your account provider</FormDescription>
							<FormControl>
								<Input
									placeholder={DEFAULT_INSTANCE}
									{...field}
									onChangeCapture={(e: React.ChangeEvent<HTMLInputElement>) =>
										debounced(e.target.value)
									}
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
							<FormLabel>Registration Token</FormLabel>
							<FormDescription>
								This instance has closed registration. You may use a registration
								token to join.
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
