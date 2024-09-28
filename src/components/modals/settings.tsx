import ReactModal from "react-modal";

import "./settings.css";

// import { LoginStore } from "../../lib/loginStore";
// import { useLocation } from "wouter";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import { LoginStore } from "../../lib/loginStore";
import { useLocation } from "wouter";
import styled from "styled-components";
import { useProfile } from "../../lib/hooks";

const LabeledField = styled.div`
	background-color: var(--background-secondary);
	margin: 20px;
	padding: 10px;
	display: flex;
	justify-content: space-between;
`

const Settings = ({ close }: { close: () => unknown }) => {
	const [, setLocation] = useLocation();

	const logout = () => {
		LoginStore.save(null);
		setLocation("/login");
	};

	const user = useProfile();

	if (!user) return null;

	return (
		<Tabs>
			<TabList>
				<Tab>Profile</Tab>
				<Tab onClick={logout}>Log out</Tab>
			</TabList>

			<TabPanel>
				{/* Profile */}
				<h1>Profile</h1>

				<LabeledField>
					<label>Email</label>
					<input value={user.email} />
				</LabeledField>

				<LabeledField>
					<label>Username</label>
					<input value={user.name} />
				</LabeledField>

				<LabeledField>
					<label>Display Name</label>
					<input value={user.display_name} />
				</LabeledField>

				<LabeledField>
					<label>Summary</label>
					<input value={user.summary} />
				</LabeledField>
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
