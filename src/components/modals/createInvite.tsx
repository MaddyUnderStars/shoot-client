import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import ReactModal from "react-modal";
import styled from "styled-components";
import { z } from "zod";
import { createHttpClient } from "../../lib/http";

export const CreateInviteInputs = z.object({
	expiry: z.string().date().optional(),
});

export type CreateInviteInputs = z.infer<typeof CreateInviteInputs>;

const Modal = ({ guild_id }: { guild_id: string }) => {
	const [code, setCode] = useState();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<CreateInviteInputs>({
		resolver: zodResolver(CreateInviteInputs),
	});

	const makeInvite = (expiry?: Date) => {
		console.log(expiry);
		createHttpClient()
			.POST("/guild/{guild_id}/invite", {
				body: {
					expiry: expiry?.toISOString(),
				},
				params: {
					path: {
						guild_id,
					},
				},
			})
			.then((x) => {
				if (x.error) return;
				if (x.data) setCode(x.data.code);
			});
	};

	const onSubmit = handleSubmit((data) => {
		makeInvite(data.expiry ? new Date(data.expiry) : undefined);
	});

	// biome-ignore lint/correctness/useExhaustiveDependencies(guild_id): get a new invite on guild_id change
	useEffect(makeInvite, [guild_id]);

	return (
		<Container>
			<Header>
				<h1>Create Invite</h1>
				<CloseButton onClick={close}>X</CloseButton>
			</Header>

			<Content onChange={onSubmit}>
				<InputContainer>
					<label htmlFor="expiry">Expiry</label>
					{errors.expiry?.message && (
						<InputError>{errors.expiry.message}</InputError>
					)}
					<Input id="expiry" type="date" {...register("expiry")} />
				</InputContainer>

				<InputContainer>
					<label htmlFor="code">Code</label>
					<Input value={code ?? ""} id="code" readOnly />
				</InputContainer>
			</Content>
		</Container>
	);
};

export const CreateInvite = ({ guild_id }: { guild_id: string }) => {
	const [inviteModalOpen, setInviteModalOpen] = useState(false);

	return (
		<>
			<button type="button" onClick={() => setInviteModalOpen(true)}>
				Create invite
			</button>

			<ReactModal
				className="modal"
				overlayClassName="overlay"
				isOpen={inviteModalOpen}
				onRequestClose={() => setInviteModalOpen(false)}
				shouldCloseOnEsc={true}
				shouldCloseOnOverlayClick={true}
			>
				<Modal guild_id={guild_id} />
			</ReactModal>
		</>
	);
};

// const OptionButton = styled.button`
// 	border: none;
// 	background-color: transparent;
// 	color: white;
// 	text-decoration: underline;
// 	cursor: pointer;
// `;

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
