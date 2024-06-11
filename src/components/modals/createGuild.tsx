import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import { z } from "zod";
import { createHttpClient } from "../../lib";

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

	const onSubmit = async (data: CreateGuildInputs) => {
		clearErrors("name");

		const { name } = data;

		const client = createHttpClient();

		const { error } = await client.POST("/guild/", {
			body: {
				name,
			},
		});

		if (error) setError("name", { message: "Failed" });

		return;
	};

	return (
		<Container>
			<Header>
				<h1>Create Guild</h1>
				<CloseButton onClick={close}>X</CloseButton>
			</Header>

			<Content onSubmit={handleSubmit(onSubmit, console.log)}>
				<InputContainer>
					<label htmlFor="guildName">Name</label>
					{errors.name?.message && (
						<InputError>{errors.name.message}</InputError>
					)}
					<Input
						id="guildName"
						{...register("name", {
							required: true,
						})}
					/>
				</InputContainer>

				<Input type="submit"></Input>
			</Content>
		</Container>
	);
};

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

const Content = styled.form`
	margin-top: 20px;
	display: flex;
	flex-direction: column;
	gap: 20px;
`;

const CloseButton = styled.button`
	border: none;
	background-color: transparent;
	color: white;
	font-size: 1.2rem;
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
