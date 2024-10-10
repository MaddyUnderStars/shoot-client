import { RiArrowDropDownLine } from "react-icons/ri";
import { useGuild } from "../../lib/hooks";
import ReactModal from "react-modal";
import { type PropsWithChildren, useState } from "react";
import styled from "styled-components";
import { createHttpClient } from "../../lib/http";
import { CreateInvite } from "./createInvite";

const Dropdown = styled.div`
	display: flex;
	cursor: pointer;

	& > span {
		display: flex;
		justify-content: space-between;
		align-items: center;
		cursor: pointer;
		flex: 1;
	}
`;

type ChannelListDropdownProps = {
	guild_id: string;
} & PropsWithChildren;

const DropdownContent = styled.div`
	display: flex;
	flex-direction: column;

	& > button {
		border: none;
		background-color: var(--background-secondary);
		color: var(--text-primary);
		padding: 5px;
		margin-bottom: 5px;
		border-bottom: 1px solid white;
	}
`;

const Popup = ({
	guild_id,
}: ChannelListDropdownProps & { close: () => void }) => {
	const guild = useGuild(guild_id);
	if (!guild) return null;

	const createChannel = () => {
		// open create channel modal
	};

	const deleteGuild = async () => {
		const http = createHttpClient();
		await http.DELETE("/guild/{guild_id}/", {
			params: {
				path: {
					guild_id: guild.mention,
				},
			},
		});
	};

	return (
		<>
			<DropdownContent>
				<button type="button" onClick={createChannel}>
					Create channel
				</button>
				<CreateInvite guild_id={guild_id} />
				<button
					type="button"
					style={{ color: "red" }}
					onClick={deleteGuild}
				>
					Delete guild
				</button>
			</DropdownContent>
		</>
	);
};

export const ChannelListDropdown = ({
	guild_id,
	children,
}: ChannelListDropdownProps) => {
	const [popup, setPopup] = useState<boolean>(false);

	return (
		<Dropdown>
			<span onClick={() => setPopup(true)} onKeyDown={() => setPopup(true)}>
				{children}
				<RiArrowDropDownLine size={20} />
			</span>

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
						width: "200px",
						height: "min-content",
						backgroundColor: "var(--background-tertiary)",
						boxShadow: "10px 10px 15px 0px rgba(0, 0, 0, 0.2)",
						border: "none",
					},
				}}
			>
				<Popup guild_id={guild_id} close={() => setPopup(false)} />
			</ReactModal>
		</Dropdown>
	);
};
