import ReactModal from "react-modal";

import "./settings.css";
import { LoginStore } from "../../lib/loginStore";
import { useLocation } from "wouter";

const Settings = ({ close }: { close: () => unknown }) => {
	const [, setLocation] = useLocation();

	return (
		<div>
			<button onClick={close}>Close</button>

			<button
				onClick={() => {
					LoginStore.save(null);
					setLocation("/login");
				}}
			>
				logout
			</button>
		</div>
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
