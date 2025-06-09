import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import { z } from "zod";
import { shoot } from "../../../lib/client";
import { useProfile } from "../../../lib/hooks";
import { createHttpClient } from "../../../lib/http";

const LabeledField = styled.div`
	background-color: var(--background-secondary);
	margin: 20px;
	padding: 10px;
	display: flex;
	flex-direction: column;
	justify-content: space-between;

	& > input,
	& > textarea {
		resize: none;
		background-color: var(--background-tertiary);
		border: none;
		color: var(--text-primary);
		padding: 10px;
		margin-top: 10px;
		border-bottom: 1px solid white;
	}
`;

const SubmitButton = styled.input`
	resize: none;
	background-color: var(--background-tertiary);
	border: none;
	color: var(--text-primary);
	padding: 10px;
	margin-right: 20px;
	border-bottom: 1px solid white;
	float: right;
`;

const InputError = styled.span`
	color: red;
	font-size: 0.85rem;
`;

const ProfileFormInputs = z.object({
	email: z.string().email(),
	display_name: z.string(),
	summary: z.string(),
});

type ProfileFormInputs = z.infer<typeof ProfileFormInputs>;

export const ProfileTab = () => {
	const user = useProfile();

	const {
		register,
		handleSubmit,
		setError,
		formState: { errors },
	} = useForm<ProfileFormInputs>({
		resolver: zodResolver(ProfileFormInputs),
	});

	const onSubmit = handleSubmit(async (data) => {
		const client = createHttpClient();
		try {
			const ret = await client.PATCH("/users/@me/", {
				body: data,
			});

			if (ret.error)
				return setError("email", { message: ret.error.message });
		} catch (e) {
			// bug in openapi fetch
		}

		if (!shoot.user) return; // shouldn't happen

		shoot.user.display_name = data.display_name;
		shoot.user.summary = data.summary;
		shoot.user.email = data.email;
	});

	if (!user) return null;

	return (
		<>
			<div>
				<h1>Profile</h1>
				<p>Edit your account details and profile appearance here</p>
			</div>

			<form onSubmit={onSubmit}>
				<LabeledField>
					<label htmlFor="username">Username</label>
					<input id="username" value={user.name} disabled={true} />
				</LabeledField>

				<LabeledField>
					<label htmlFor="email">
						Email
						{!!errors.email?.message && (
							<InputError>{errors.email.message}</InputError>
						)}
					</label>
					<input
						id="email"
						{...register("email", { value: user.email })}
					/>
				</LabeledField>

				<LabeledField>
					<label htmlFor="display_name">
						Display Name
						{!!errors.display_name?.message && (
							<InputError>
								{errors.display_name.message}
							</InputError>
						)}
					</label>
					<input
						id="display_name"
						{...register("display_name", {
							value: user.display_name,
						})}
					/>
				</LabeledField>

				<LabeledField>
					<label htmlFor="summary">
						Summary
						{!!errors.summary?.message && (
							<InputError>{errors.summary.message}</InputError>
						)}
					</label>
					<textarea
						rows={5}
						maxLength={200}
						id="summary"
						{...register("summary", {
							maxLength: 200,
							value: user.summary,
						})}
					/>
				</LabeledField>

				<SubmitButton type="submit" value="Save" />
			</form>
		</>
	);
};
