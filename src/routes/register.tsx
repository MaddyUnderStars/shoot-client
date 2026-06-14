import { createFileRoute } from "@tanstack/react-router";
import { RegisterForm } from "@/components/register-form";
import { AboutCard } from "@/components/about-card";

export const Route = createFileRoute("/register")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="min-h-svh w-full flex items-center justify-center gap-4 flex-wrap-reverse">
			<AboutCard />

			<RegisterForm />
		</div>
	);
}
