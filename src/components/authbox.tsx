import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { type UseFormSetError, useForm } from "react-hook-form";
import { z } from "zod";
import { tryParseUrl } from "../lib/util";
import { createHttpClient } from "../lib/http";
import debounce from "debounce";
import styled from "styled-components";

const DEFAULT_INSTANCE = "https://chat.understars.dev";

export type AuthboxSubmitHandler = (
	data: LoginFormInputs,
	setError: UseFormSetError<LoginFormInputs>,
) => void;

type AuthboxProps = {
	onSubmit: AuthboxSubmitHandler;
	header: JSX.Element;
};

export const Authbox = ({ onSubmit, header }: AuthboxProps) => {
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

	return (
		<Container>
			<Modal>
				<Header>{header}</Header>

				<Form
					onSubmit={handleSubmit((data) => onSubmit(data, setError))}
				>
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
							defaultValue={DEFAULT_INSTANCE}
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
							style={{ textTransform: "lowercase" }}
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
							type="password"
							{...register("password", { required: true })}
						/>
					</InputContainer>

					<Input type="submit" value="Submit" />
				</Form>
			</Modal>
		</Container>
	);
};

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
		if (e instanceof DOMException && e?.name === "AbortError") return; // ignore aborts
		if (
			e instanceof Error &&
			e.message === "NetworkError when attempting to fetch resource."
		)
			e.message = "Offline or misconfigured";
		setError(e instanceof Error ? e.message : e!.toString());
	}
};

export const LoginFormInputs = z.object({
	instance: z.string().refine((url) => {
		if (!url.startsWith("https://") && !url.startsWith("http://"))
			url = `https://${url}`;
		return url;
	}),
	username: z.string(),
	password: z.string(),
});

export type LoginFormInputs = z.infer<typeof LoginFormInputs>;

const Container = styled.div`
	width: 100%;
	height: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
`;

const Header = styled.div`
	margin-bottom: 20px;
`;

const Modal = styled.div`
	background-color: rgb(20, 20, 20);
	padding: 20px;
	box-shadow: 10px 10px 15px 0px rgba(0, 0, 0, 0.2);
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
