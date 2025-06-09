import { useState } from "react";
import { GiPocketBow } from "react-icons/gi";
import ReactModal from "react-modal";
import styled from "styled-components";
import { Link } from "wouter";
import { useShootGuilds } from "../lib/hooks";

import "./guildsList.css";
import { CreateGuildModal } from "./modals/createGuild";

const Container = styled.div`
	background-color: var(--background-secondary);
	padding-top: 20px;
`;

const Guild = styled.div`
	padding: 5px;
	margin: 0 10px 10px 10px;
	width: 40px;
	height: 40px;
	background-color: rgb(29, 3, 36);
	display: flex;
	justify-content: center;
	align-items: center;
	cursor: pointer;
`;

const CreateGuildButton = styled.button`
	border: none;
	text-decoration: none;
	background-color: transparent;
	color: white;
	cursor: pointer;
`;

export const GuildsList = () => {
	const guilds = useShootGuilds();

	const [modalIsOpen, setIsOpen] = useState(false);

	return (
		<>
			<Container>
				<Link to="/channels/@me">
					<Guild>
						<GiPocketBow size={40} />
					</Guild>
				</Link>

				{guilds.map((x) => (
					<Link
						key={x.id}
						to={`/channels/${x.id}@${x.domain}/${x.channels[0]?.mention}`}
					>
						<Guild>
							{x.name
								.split(" ")
								.slice(0, 4)
								.map((x) => x.charAt(0).toUpperCase())
								.join("")}
						</Guild>
					</Link>
				))}

				<Guild onClick={() => setIsOpen(true)}>
					<CreateGuildButton>+</CreateGuildButton>
				</Guild>
			</Container>

			<ReactModal
				className="modal"
				overlayClassName="overlay"
				isOpen={modalIsOpen}
				onRequestClose={() => setIsOpen(false)}
				shouldCloseOnEsc={true}
				shouldCloseOnOverlayClick={true}
			>
				<CreateGuildModal close={() => setIsOpen(false)} />
			</ReactModal>
		</>
	);
};
