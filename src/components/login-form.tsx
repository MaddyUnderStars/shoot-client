import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { gatewayClient } from "@/lib/client/gateway";
import { setLogin } from "@/lib/storage";
import { cn } from "@/lib/utils";
import { InstanceValidatorField } from "./instance-validator-field";
import { Form } from "./ui/form";
import { getQualifiedInstanceUrl, resolveHostmetaTemplate } from "@/lib/instance";
import type { ClientOptions } from "@/lib/client/types";
import { doOAuthLogin } from "@/lib/auth";

const DEFAULT_INSTANCE = import.meta.env.VITE_DEFAULT_INSTANCE ?? "https://understars.dev";

const LoginFormSchema = z.object({
	instance: z.string({
		error: "Invalid instance URL",
	}),
});

export function LoginForm({ className, ...props }: React.ComponentProps<"div">) {
	const navigation = useNavigate();

	const form = useForm<z.infer<typeof LoginFormSchema>>({
		resolver: zodResolver(LoginFormSchema),
		defaultValues: {
			instance: DEFAULT_INSTANCE,
		},
	});

	const onSubmit = async (values: z.infer<typeof LoginFormSchema>) => {
		const resolved = await resolveHostmetaTemplate(getQualifiedInstanceUrl(values.instance)!);

		if (!resolved) throw new Error("could not find instance");

		let tokens;
		try {
			tokens = await doOAuthLogin(resolved);
		} catch (e) {
			form.setError("instance", {
				message: e instanceof Error ? e.message : JSON.stringify(e),
			});
			return;
		}

		if (!tokens.access_token || !tokens.refresh_token || !tokens.expires_in) {
			form.setError("instance", {
				message: "The OAuth response did not include everything!",
			});
			return;
		}

		const login: ClientOptions = {
			tokens: {
				access: tokens.access_token,
				refresh: tokens.refresh_token,
				expiry: tokens.expires_in + Date.now(),
			},
			instance: resolved.href,
		};

		setLogin(login);

		gatewayClient.login(login);

		await navigation({
			to: "/channel/@me",
		});
	};

	return (
		<div className={cn("flex flex-col gap-6 w-sm", className)} {...props}>
			<Card>
				<CardHeader>
					<CardTitle>Login</CardTitle>
					<CardDescription>
						<Link to="/register" className="underline">
							Register instead?
						</Link>
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
							<InstanceValidatorField form={form} />

							<Button type="submit">Login</Button>
						</form>
					</Form>
				</CardContent>
			</Card>
		</div>
	);
}
