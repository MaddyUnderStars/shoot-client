import { createFileRoute } from "@tanstack/react-router";
import { LoginForm } from "@/components/login-form";
import { AboutCard } from "@/components/about-card";

export const Route = createFileRoute("/login")({
	component: LoginRoute,
});

function LoginRoute() {
	return (
		<div className="min-h-svh w-full flex items-center justify-center gap-4 flex-wrap-reverse">
			<AboutCard />

			<LoginForm />
		</div>
	);
}
