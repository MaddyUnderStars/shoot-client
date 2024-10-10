import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import { z } from "zod";
import { createHttpClient } from "../../lib/http";
import { useState } from "react";

export type ModalProps = {
	close: () => void;
};

export const CreateGuildInputs = z.object({
	name: z.string(),
});

export type CreateGuildInputs = z.infer<typeof CreateGuildInputs>;

export const CreateGuildModal = ({ close }: ModalProps) => {
	const {
		register,
		handleSubmit,
		setError,
		clearErrors,
		formState: { errors },
	} = useForm<CreateGuildInputs>({
		resolver: zodResolver(CreateGuildInputs),
	});

	const [createGuild, setCreateGuild] = useState(false);

	const onSubmit = async (data: CreateGuildInputs) => {
		clearErrors();

		const { name } = data;

		const client = createHttpClient();

		if (createGuild) {
			const { error } = await client.POST("/guild/", {
				body: {
					name,
				},
			});

			if (error) setError("name", { message: "Failed" });
			else close();
		} else {
			const { error } = await client.POST("/invite/{invite_code}", {
				params: {
					path: {
						invite_code: name,
					},
				},
			});

			if (error) setError("name", { message: error.message });
			else close();
		}

		return;
	};

	return (
		<Container>
			<Header>
				<div>
					<h1>{createGuild ? "Create" : "Join"} Guild</h1>
					<OptionButton
						type="submit"
						onClick={() => {
							setCreateGuild(!createGuild);
							clearErrors();
						}}
					>
						{createGuild
							? "Or join instead?"
							: "Or make one instead?"}
					</OptionButton>
				</div>
				<CloseButton onClick={close}>X</CloseButton>
			</Header>

			<Content onSubmit={handleSubmit(onSubmit, console.log)}>
				<InputContainer>
					<label htmlFor="guildName">
						{createGuild ? "Name" : "Invite Code"}
					</label>
					{errors.name?.message && (
						<InputError>{errors.name.message}</InputError>
					)}
					<Input
						id="guildName"
						placeholder={createGuild ? "" : "code@example.com"}
						{...register("name", {
							required: true,
						})}
					/>
				</InputContainer>

				<Input type="submit" />
			</Content>
		</Container>
	);
};

const OptionButton = styled.button`
	border: none;
	background-color: transparent;
	color: white;
	text-decoration: underline;
	cursor: pointer;
`

const Input = styled.input`
	padding: 5px;
	margin: 5px 0 5px 0;
	border: 1px solid white;
	background-color: var(--background-primary);
	color: white;
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

const Content = styled.form`
	margin-top: 20px;
	display: flex;
	flex-direction: column;
`;

const CloseButton = styled.button`
	border: none;
	background-color: transparent;
	color: white;
	font-size: 1.2rem;
	cursor: pointer;
`;

const Header = styled.div`
	display: flex;
	justify-content: space-between;
	flex-direction: row;
`;

const Container = styled.div`
	padding: 20px;
	width: 300px;
`;
