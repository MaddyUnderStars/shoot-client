import { createFileRoute, Link } from "@tanstack/react-router";
import { AboutCard } from "@/components/about-card";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Anchor } from "@/components/ui/anchor";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { resolveHostmetaTemplate } from "@/lib/instance";
import { makeUrl } from "@/lib/utils";

export const Route = createFileRoute("/register")({
	component: RouteComponent,
});

const DEFAULT_INSTANCE = new URL(import.meta.env.VITE_DEFAULT_INSTANCE ?? "https://understars.dev");

function RouteComponent() {
	const [registerUrl, setRegisterUrl] = useState<URL>();

	useEffect(() => {
		void (async () => {
			const res = await resolveHostmetaTemplate(DEFAULT_INSTANCE);
			if (res) setRegisterUrl(makeUrl("/auth/register", res));
		})();
	}, [DEFAULT_INSTANCE]);

	return (
		<div className="min-h-svh w-full flex items-center justify-center gap-4 flex-wrap-reverse">
			<AboutCard />

			<div className="flex flex-col gap-6 w-sm">
				<Card>
					<CardHeader>
						<CardTitle>Register</CardTitle>
						<CardDescription>
							<Link to="/login" className="underline">
								Login instead?
							</Link>
						</CardDescription>
					</CardHeader>

					<CardContent>
						<p>
							Like other Fediverse platforms, Shoot is not a single website. You make
							an account with a provider that grants you access to the network.
						</p>
					</CardContent>

					<CardFooter className="flex justify-between">
						<Button asChild>
							<Anchor href={registerUrl?.href} target="_blank">
								Join {DEFAULT_INSTANCE.hostname}
							</Anchor>
						</Button>

						<Button asChild>
							<Anchor href="https://shoot.fediverse.observer/list" target="_blank">
								Pick another server
							</Anchor>
						</Button>
					</CardFooter>
				</Card>
			</div>
		</div>
	);
}
