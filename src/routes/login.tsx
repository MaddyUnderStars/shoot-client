import { useForm, SubmitHandler } from "react-hook-form";
import styled from "styled-components";
import { createHttpClient, shoot, tryParseUrl } from "../lib";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import debounce from "debounce";
import { useState } from "react";

const Container = styled.div`
	width: 100%;
	height: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
`;

const Modal = styled.div`
	background-color: rgb(20, 20, 20);
	padding: 20px;
`;

const Form = styled.form`
	display: flex;
	flex-direction: column;
	min-width: 250px;
`;

const Input = styled.input`
	padding: 5px;
	margin: 5px 0 5px 0;
`;

const InputContainer = styled.div`
	display: flex;
	flex-direction: column;
	margin: 5px 0 5px 0;
`;

const InputError = styled.span`
	color: red;
	font-size: 0.85rem;
`;

const InputStatus = styled.span`
	display: inline;
	font-size: 0.85rem;
`;

let instanceAbort = new AbortController();
const validateInstance = async (
	url: string,
	setError: (value: string) => unknown,
) => {
	instanceAbort.abort();

	if (!url.startsWith("https://") && !url.startsWith("http://"))
		url = `https://${url}`;

	const parsedUrl = tryParseUrl(url);
	if (!parsedUrl) return setError("Invalid URL");

	instanceAbort = new AbortController();

	const client = createHttpClient(parsedUrl);
	try {
		const { data, error } = await client.GET("/nodeinfo/2.0.json/", {
			signal: instanceAbort.signal,
		});
		if (error) setError(JSON.stringify(error));
		if (data?.software.name !== "Shoot")
			return setError("Does not implement Shoot API");
	} catch (e) {
		if (e instanceof DOMException && e?.name == "AbortError") return; // ignore aborts
		if (
			e instanceof Error &&
			e.message == "NetworkError when attempting to fetch resource."
		)
			e.message = "Offline or misconfigured";
		setError(e instanceof Error ? e.message : e!.toString());
	}
};

const LoginFormInputs = z.object({
	instance: z.string().refine((url) => {
		if (!url.startsWith("https://") && !url.startsWith("http://"))
			url = `https://${url}`;
		return url;
	}),
	username: z.string(),
	password: z.string(),
});

type LoginFormInputs = z.infer<typeof LoginFormInputs>;

export function Login() {
	const {
		register,
		handleSubmit,
		setError,
		clearErrors,
		formState: { errors },
	} = useForm<LoginFormInputs>({
		resolver: zodResolver(LoginFormInputs),
	});

	const [checkingInstance, setCheckingInstance] = useState(false);

	const onSubmit: SubmitHandler<LoginFormInputs> = async (input) => {
		const { instance, username, password } = input;

		let url = instance;
		if (!instance.startsWith("https://") && !instance.startsWith("http://"))
			url = `https://${instance}`;

		const client = createHttpClient(new URL(url));

		const { data } = await client.POST("/auth/login", {
			body: {
				password,
				username,
			},
		});

		if (!data?.token) return;

		await shoot.login({
			instance: url,
			token: data.token,
		});
	};

	return (
		<Container>
			<Modal>
				<h1>Login</h1>

				<Form onSubmit={handleSubmit(onSubmit)}>
					<InputContainer>
						<label htmlFor="instance">Instance</label>
						{errors.instance?.message && (
							<InputError id="instance-error-msg">
								{errors.instance.message}
							</InputError>
						)}
						{checkingInstance && (
							<InputStatus>Checking</InputStatus>
						)}
						<Input
							id="instance"
							defaultValue="https://chat.understars.dev"
							{...register("instance", {
								required: true,
								onChange: debounce((event) => {
									clearErrors("instance");
									setCheckingInstance(true);
									return validateInstance(
										event.target.value,
										(message) =>
											setError("instance", { message }),
									)
										.then(() => setCheckingInstance(false))
										.catch(() =>
											setCheckingInstance(false),
										);
								}, 500),
							})}
							aria-describedby="instance-error-msg"
						/>
					</InputContainer>

					<InputContainer>
						<label htmlFor="username">Username</label>
						{errors.username?.message && (
							<InputError>{errors.username.message}</InputError>
						)}
						<Input
							id="username"
							{...register("username", { required: true })}
						/>
					</InputContainer>

					<InputContainer>
						<label htmlFor="password">Password</label>
						{errors.password?.message && (
							<InputError>{errors.password.message}</InputError>
						)}
						<Input
							id="password"
							{...register("password", { required: true })}
						/>
					</InputContainer>

					<Input type="submit" />
				</Form>
			</Modal>
		</Container>
	);
}
