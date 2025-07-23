import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import createClient from "openapi-fetch";
import debounce from "p-debounce";
import { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { createGatewayClient } from "@/lib/client/gateway";
import type { paths } from "@/lib/http/generated/v1";
import { setLogin } from "@/lib/storage";
import { cn, makeUrl, tryParseUrl } from "@/lib/utils";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "./ui/form";

const DEFAULT_INSTANCE =
	import.meta.env.VITE_DEFAULT_INSTANCE ?? "https://chat.understars.dev";

const LoginFormSchema = z.object({
	username: z.string({ error: "Username is required" }),
	password: z.string({ error: "Incorrect password" }),
	instance: z.string({ error: "Invalid instance URL" }),
});

const getQualifiedInstanceUrl = (urlOrName: string) => {
	let url = tryParseUrl(urlOrName);
	if (url) return url;

	// if it's not already a url, maybe they just forgot the https:// ?

	if (!urlOrName.startsWith("http://") && !urlOrName.startsWith("https://")) {
		url = tryParseUrl(`https://${urlOrName}`);
		if (url) return url;
	}

	// if appending protocol didn't work, can't do much else

	return undefined;
};

let instanceValidationAbort = new AbortController();
const validateInstance = async (instance: string) => {
	const url = getQualifiedInstanceUrl(instance);

	if (!url) return false;

	instanceValidationAbort.abort();

	instanceValidationAbort = new AbortController();

	const nodeInfo = makeUrl("/.well-known/nodeinfo/2.0", url);

	try {
		const data = await fetch(nodeInfo, {
			signal: instanceValidationAbort.signal,
		}).then((x) => x.json());

		return data;
	} catch (_) {
		return false;
	}
};

export function LoginForm({
	className,
	...props
}: React.ComponentProps<"div">) {
	const navigation = useNavigate();
	const [isValidatingInstance, setValidatingInstance] = useState(false);

	const form = useForm<z.infer<typeof LoginFormSchema>>({
		resolver: zodResolver(LoginFormSchema),
		defaultValues: {
			instance: DEFAULT_INSTANCE,
		},
	});

	const onSubmit = async (values: z.infer<typeof LoginFormSchema>) => {
		const client = createClient<paths>({ baseUrl: values.instance });

		const { data, error } = await client.POST("/auth/login", {
			body: {
				username: values.username,
				password: values.password,
			},
		});

		if (error) {
			form.setError("username", { message: error.message });
			return;
		}

		const login = {
			token: data.token,
			instance: values.instance,
		};

		setLogin(login);

		createGatewayClient(login).login();

		navigation({ to: "/channel/@me" });
	};

	const debounced = debounce(
		async (event: React.ChangeEvent<HTMLInputElement>) => {
			form.clearErrors("instance");
			setValidatingInstance(true);
			const nodeInfo = await validateInstance(event.target.value);
			setValidatingInstance(false);
			if (!nodeInfo)
				return form.setError("instance", {
					message: "Offline or misconfigured",
				});
		},
		500,
	);

	return (
		<div className={cn("flex flex-col gap-6", className)} {...props}>
			<Card>
				<CardHeader>
					<CardTitle>Login</CardTitle>
				</CardHeader>
				<CardContent>
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(onSubmit)}
							className="space-y-8"
						>
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
												onChangeCapture={debounced}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="username"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Username</FormLabel>
										<FormControl>
											<Input {...field} />
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
											<Input {...field} type="password" />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<Button type="submit">Login</Button>
						</form>
					</Form>
				</CardContent>
			</Card>
		</div>
	);
}
