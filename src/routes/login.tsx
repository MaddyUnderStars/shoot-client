import { createHttpClient, shoot } from "../lib";
import { LoginStore } from "../lib/loginStore";
import { Link, useLocation } from "wouter";
import { Authbox, AuthboxSubmitHandler } from "../components/authbox";

export function Login() {
	const [, setLocation] = useLocation();

	const onSubmit: AuthboxSubmitHandler = async (input, setError) => {
		const { instance, username, password } = input;

		let url = instance;
		if (!instance.startsWith("https://") && !instance.startsWith("http://"))
			url = `https://${instance}`;

		const client = createHttpClient(new URL(url));

		const { data, error } = await client.POST("/auth/login", {
			body: {
				password,
				username,
			},
		});

		if (error) {
			return setError("username", {
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				message: (error as any).message ?? "Invalid login",
			});
		}

		if (!data?.token) return;

		const opts = {
			instance: url,
			token: data.token,
		};

		LoginStore.save(opts);
		await shoot.login(opts);

		setLocation("/channels/@me");
	};

	return (
		<Authbox
			onSubmit={onSubmit}
			header={
				<>
					<h1>Login</h1>
					<p>
						New here? <Link to="/register">Register</Link>
					</p>
				</>
			}
		/>
	);
}
