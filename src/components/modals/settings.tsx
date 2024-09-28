import ReactModal from "react-modal";

import "./settings.css";

// import { LoginStore } from "../../lib/loginStore";
// import { useLocation } from "wouter";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import { LoginStore } from "../../lib/loginStore";
import { useLocation } from "wouter";
import styled from "styled-components";
import { useProfile } from "../../lib/hooks";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Profile } from "../profile";
import { zodResolver } from "@hookform/resolvers/zod";
import { createHttpClient } from "../../lib";

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

const ProfileTab = () => {
	const user = useProfile();

	const {
		register,
		handleSubmit,
		setError,
		clearErrors,
		formState: { errors },
	} = useForm<ProfileFormInputs>({
		resolver: zodResolver(ProfileFormInputs),
	});

	const onSubmit = handleSubmit(async (data) => {
		const client = createHttpClient();
		const ret = await client.PATCH("/users/@me/", {
			body: data,
		});

		if (ret.error) setError("email", { message: ret.error.message });
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
						value={user.email}
						{...register("email")}
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
						value={user.display_name}
						{...register("display_name")}
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
						value={user.summary}
						{...register("summary", { maxLength: 200 })}
					/>
				</LabeledField>

				<SubmitButton type="submit" value="Save" />
			</form>
		</>
	);
};

const Settings = ({ close }: { close: () => unknown }) => {
	const [, setLocation] = useLocation();

	const logout = () => {
		LoginStore.save(null);
		setLocation("/login");
	};

	return (
		<Tabs>
			<TabList>
				<Tab>Profile</Tab>
				<Tab onClick={logout}>Log out</Tab>
			</TabList>

			<TabPanel>
				<ProfileTab />
			</TabPanel>
		</Tabs>
	);
};

export const SettingsModal = ({
	isOpen,
	close,
}: {
	isOpen: boolean;
	close: () => unknown;
}) => {
	return (
		<ReactModal
			shouldCloseOnEsc={true}
			shouldCloseOnOverlayClick={false}
			onRequestClose={() => close()}
			isOpen={isOpen}
			className="settingsModal"
			overlayClassName="settingsOverlay"
		>
			<Settings close={close} />
		</ReactModal>
	);
};
