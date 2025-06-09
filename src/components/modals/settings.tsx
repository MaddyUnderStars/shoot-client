import ReactModal from "react-modal";

import "./settings.css";

import { Suspense, lazy } from "react";
// import { LoginStore } from "../../lib/loginStore";
// import { useLocation } from "wouter";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import { useLocation } from "wouter";
import { LoginStore } from "../../lib/loginStore";

const ProfileTab = lazy(async () => ({
	default: (await import("./settings/ProfileTab")).ProfileTab,
}));

const Settings = () => {
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
				<Suspense fallback={<p>Loading...</p>}>
					<ProfileTab />
				</Suspense>
			</TabPanel>

			<TabPanel>
				<h1>Logging out...</h1>
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
			<Settings />
		</ReactModal>
	);
};
