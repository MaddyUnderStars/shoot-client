import { RiArrowDropDownLine } from "react-icons/ri";
import { useGuild } from "../../lib/hooks";
import ReactModal from "react-modal";
import { PropsWithChildren, useState } from "react";
import styled from "styled-components";

const Dropdown = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	cursor: pointer;
`;

type ChannelListDropdownProps = {
	guild_id: string;
} & PropsWithChildren;

const Popup = ({
	guild_id,
	close,
}: ChannelListDropdownProps & { close: () => void }) => {
	const guild = useGuild(guild_id);
	if (!guild) return null;

	return (
		<div>
			<button>Create channel</button>
		</div>
	);
};

export const ChannelListDropdown = ({
	guild_id,
	children,
}: ChannelListDropdownProps) => {
	const [popup, setPopup] = useState<boolean>(false);

	return (
		<Dropdown onClick={() => setPopup(true)}>
			{children}

			<RiArrowDropDownLine size={20} />

			<ReactModal
				isOpen={popup}
				shouldCloseOnOverlayClick={true}
				shouldCloseOnEsc={true}
				onRequestClose={() => setPopup(false)}
				style={{
					overlay: {
						background: "transparent",
					},
					content: {
						position: "absolute",
						left: 70,
						width: "220px",
						height: "min-content",
						backgroundColor: "rgb(41, 41, 41)",
						border: "none",
					},
				}}
			>
				<Popup guild_id={guild_id} close={() => setPopup(false)} />
			</ReactModal>
		</Dropdown>
	);
};
