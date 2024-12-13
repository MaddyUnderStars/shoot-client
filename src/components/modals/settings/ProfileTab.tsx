import styled from "styled-components";
import { useProfile } from "../../../lib/hooks";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createHttpClient } from "../../../lib/http";
import { shoot } from "../../../lib/client";
import { useRef, useState } from "react";

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
	email: z.string().optional(),
	display_name: z.string().optional(),
	summary: z.string().optional(),
	avatar: z
		.custom<FileList>((filelist) => filelist instanceof FileList)
		.optional(),
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

		if (data.avatar?.[0]) {
			const d = new FormData();
			d.append("file", data.avatar[0]);
			const json = await fetch(`${shoot.instance!.http.toString()}media/`, {
				method: "POST",
				body: d,
				headers: {
					"Authorization": shoot.token!
				}
			}).then(x => x.json());
			data.avatar = json.hash;
		}

		for (const key in data) {
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			//@ts-ignore
			if (!data[key]) delete data[key];
		}

		try {
			const ret = await client.PATCH("/users/@me/", {
				body: data,
			});

			if (ret.error) return setError("email", { message: ret.error.message });
		} catch (e) {
			// bug in openapi fetch
		}

		shoot.user!.display_name = data.display_name;
		shoot.user!.summary = data.summary;
		shoot.user!.email = data.email;
	});

	const [avatar, setAvatar] = useState(
		"https://www.freeiconspng.com/thumbs/profile-icon-png/profile-icon-9.png",
	);

	if (!user) return null;

	return (
		<>
			<div>
				<h1>Profile</h1>
				<p>Edit your account details and profile appearance here</p>
			</div>

			<form onSubmit={onSubmit}>
				<LabeledField>
					<label
						htmlFor="avatar"
						style={{ display: "flex", flexDirection: "column" }}
					>
						Avatar
						<img width="80px" alt="profile avatar" src={avatar} />
					</label>
					{!!errors.avatar?.message && (
						<InputError>{errors.avatar.message}</InputError>
					)}
					<input
						id="avatar"
						type="file"
						{...register("avatar")}
						onChange={(event) => {
							const target = event.target;
							if (!target.files) return;
							const file = target.files[0];
							if (!file) return;

							setAvatar(URL.createObjectURL(file));
						}}
					/>
				</LabeledField>

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
						type="email"
						{...register("email", { value: user.email })}
					/>
				</LabeledField>

				<LabeledField>
					<label htmlFor="display_name">
						Display Name
						{!!errors.display_name?.message && (
							<InputError>{errors.display_name.message}</InputError>
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
