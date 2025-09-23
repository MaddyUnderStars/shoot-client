import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "@tanstack/react-router";
import createClient from "openapi-fetch";
import { useForm } from "react-hook-form";
import z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { gatewayClient } from "@/lib/client/gateway";
import type { paths } from "@/lib/http/generated/v1";
import { setLogin } from "@/lib/storage";
import { cn } from "@/lib/utils";
import { InstanceValidatorField } from "./instance-validator-field";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";

const DEFAULT_INSTANCE = import.meta.env.VITE_DEFAULT_INSTANCE ?? "https://chat.understars.dev";

const LoginFormSchema = z.object({
	username: z.string({
		error: "Username is required",
	}),
	password: z.string({
		error: "Incorrect password",
	}),
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
		const client = createClient<paths>({
			baseUrl: values.instance,
		});

		const { data, error } = await client.POST("/auth/login", {
			body: {
				username: values.username,
				password: values.password,
			},
		});

		if (error) {
			form.setError("username", {
				message: error.message,
			});
			return;
		}

		const login = {
			token: data.token,
			instance: values.instance,
		};

		setLogin(login);

		gatewayClient.login(login);

		navigation({
			to: "/channel/@me",
		});
	};

	return (
		<div className={cn("flex flex-col gap-6", className)} {...props}>
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
