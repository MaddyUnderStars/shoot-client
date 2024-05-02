import { GiPocketBow } from "react-icons/gi";
import styled from "styled-components";
import { useShootGuilds } from "../lib/hooks";
import { Link } from "wouter";
import ReactModal from "react-modal";
import { useState } from "react";

import "./guildsList.css";

const Container = styled.div``;

const Guild = styled.div`
	padding: 5px;
	margin: 0 10px 10px 10px;
	width: 40px;
	height: 40px;
	background-color: rgb(10, 10, 10);
	display: flex;
	justify-content: center;
	align-items: center;
`;

const CreateGuildButton = styled.button`
	border: none;
	text-decoration: none;
	background-color: transparent;
	color: white;
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
						to={`/channels/${x.id}@${x.domain}/${
							x.channels![0]?.mention
						}`}
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

				<Guild>
					<CreateGuildButton onClick={() => setIsOpen(true)}>
						+
					</CreateGuildButton>
				</Guild>
			</Container>

			<ReactModal
				className="modal"
				overlayClassName="overlay"
				isOpen={modalIsOpen}
				onRequestClose={() => setIsOpen(false)}
			>
				<h1>Create Guild</h1>

				<form>
					<label>Name</label>
					<input type="text" />
				</form>
			</ReactModal>
		</>
	);
};