import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import { z } from "zod";
import { createHttpClient } from "../lib";
import { useProfile } from "../lib/hooks";

import { MdAdd } from "react-icons/md";

const AddFriendForm = z.object({
	username: z.string(),
});

type AddFriendForm = z.infer<typeof AddFriendForm>;

export const AddFriend = () => {
	const {
		register,
		handleSubmit,
		setError,
		formState: { errors },
	} = useForm<AddFriendForm>({
		resolver: zodResolver(AddFriendForm),
	});

	const me = useProfile();
	if (!me) return null;

	const onSubmit = async (data: AddFriendForm) => {
		const client = createHttpClient();

		if (!data.username.includes("@"))
			data.username = data.username + "@" + me.domain;

		const ret = await client.POST("/users/{user_id}/relationship/", {
			params: { path: { user_id: data.username } },
		});

		if (ret.error) setError("username", ret.error);
	};

	return (
		<Container>
			<Form onSubmit={handleSubmit(onSubmit)}>
				<Label htmlFor="addFriendInput">Add friend</Label>
				<FormInner>
					<div
						style={{
							display: "flex",
							flexDirection: "column",
							flex: 1,
						}}
					>
						<div style={{ flex: 1, display: "flex", gap: 20 }}>
							<Input
								{...register("username", { required: true })}
								id="addFriendInput"
								placeholder="username@example.com"
								name="username"
							/>
							<SubmitLabel htmlFor="addFriendSubmit">
								Add
							</SubmitLabel>
						</div>
						{!!errors.username && (
							<ErrorLabel htmlFor="username">
								{errors.username.message}
							</ErrorLabel>
						)}
					</div>

					<input
						style={{ display: "none" }}
						type="submit"
						id="addFriendSubmit"
					/>
				</FormInner>
			</Form>
		</Container>
	);
};

const Form = styled.form`
	flex: 1;
	display: flex;
	flex-direction: column;
`;

const ErrorLabel = styled.label`
	color: red;
	margin-top: 10px;
`;

const FormInner = styled.div`
	display: flex;
	gap: 20px;
	align-items: center;
`;

const SubmitLabel = styled.label`
	padding: 20px;
	background-color: var(--background-tertiary);
	border-radius: 5px;
`;

const Label = styled.label`
	padding-bottom: 10px;
	font-size: 2rem;
`;

const Input = styled.input`
	flex: 1;
	border: none;
	background-color: var(--background-tertiary);
	border-radius: 5px;
	padding: 20px;
	color: var(--text-primary);
`;

const Container = styled.div`
	flex: 1;
	padding: 20px 50px 0 50px;
`;
