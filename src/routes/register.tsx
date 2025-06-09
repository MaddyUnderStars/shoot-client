import { Link, useLocation } from "wouter";
import { Authbox, type AuthboxSubmitHandler } from "../components/authbox";
import { shoot } from "../lib/client";
import { createHttpClient } from "../lib/http";
import { LoginStore } from "../lib/loginStore";

export function Register() {
	const [, setLocation] = useLocation();

	const onSubmit: AuthboxSubmitHandler = async (input, setError) => {
		const { instance, username, password } = input;

		let url = instance;
		if (!instance.startsWith("https://") && !instance.startsWith("http://"))
			url = `https://${instance}`;

		const client = createHttpClient(new URL(url));

		const { data, error } = await client.POST("/auth/register", {
			body: {
				username,
				password,
			},
		});

		if (error) {
			return setError("username", {
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				message: error.message ?? "Invalid login",
			});
		}

		if (!data.token) return;

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
					<h1>Register</h1>
					<p>
						Been here before? <Link to="/login">Login</Link>
					</p>
				</>
			}
		/>
	);
}
