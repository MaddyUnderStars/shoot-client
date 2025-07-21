import { createFileRoute } from "@tanstack/react-router";
import { LoginForm } from "@/components/login-form";

export const Route = createFileRoute("/login")({
	component: LoginRoute,
});

function LoginRoute() {
	return (
		<div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
			<div className="w-full max-w-sm">
				<LoginForm />
			</div>
		</div>
	);
}
