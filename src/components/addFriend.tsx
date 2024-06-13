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
	const { register, handleSubmit } = useForm<AddFriendForm>({
		resolver: zodResolver(AddFriendForm),
	});

	const me = useProfile();
	if (!me) return null;

	const onSubmit = async (data: AddFriendForm) => {
		const client = createHttpClient();

		if (!data.username.includes("@"))
			data.username = data.username + "@" + me.domain;

		await client.POST("/users/{user_id}/relationship/", {
			params: { path: { user_id: data.username } },
		});
	};

	return (
		<Container>
			<form onSubmit={handleSubmit(onSubmit)}>
				<label htmlFor="addFriendInput">Add friend</label>
				<Input
					{...register("username", { required: true })}
					id="addFriendInput"
					name="username"
				/>

				<label htmlFor="addFriendSubmit">
					<MdAdd />
				</label>
				<input
					style={{ display: "none" }}
					type="submit"
					id="addFriendSubmit"
				/>
			</form>
		</Container>
	);
};

const Input = styled.input`
	display: inline;
	background-color: transparent;
	border: none;
	border-bottom: 2px solid grey;
	margin-left: 10px;
	color: white;
`;

const Container = styled.div`
	display: inline;
	flex: 1;
	display: flex;
	justify-content: right;
	gap: 10px;
`;
