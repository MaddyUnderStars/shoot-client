import styled from "styled-components";
import { useRelationships } from "../lib/hooks";
import ReactModal from "react-modal";
import { UserPopout } from "./modals/userPopout";
import { useState } from "react";
import { Relationship, User as UserType } from "../lib/entities";
import { AddFriend } from "./addFriend";

const Container = styled.div`
	flex: 1;
`;

const User = styled.div`
	display: flex;
	align-items: center;
	margin-top: 10px;
`;

const ProfilePicture = styled.img`
	width: 30px;
	height: 30px;
	border-radius: 100%;
	margin-right: 10px;
`;

const Username = styled.div``;

const NamePart = styled.p`
	font-weight: bold;
`;

const DomainPart = styled.p`
	font-size: 0.8rem;
`;

export const Friends = () => {
	const relationships = useRelationships();
	const [user, setUser] = useState<UserType>();
	const [popup, setPopup] = useState<boolean>(false);
	const [position, setPosition] = useState<{ x: number; y: number }>({
		x: 0,
		y: 0,
	});

	const openUserPopup = (u: Relationship) => {
		setPopup(true);
		setUser(u.user);
	};

	return (
		<>
			<Container>
				<div style={{ display: "flex" }}>
					Friends
					<AddFriend />
				</div>
				<div>
					{relationships.map((x) => (
						<User
							onClick={(event) => {
								setPosition({
									x: event.clientX,
									y: event.clientY,
								});
								openUserPopup(x);
							}}
							key={`${x.user.mention}-${x.created}-${x.type}`}
						>
							<ProfilePicture src="https://www.freeiconspng.com/thumbs/profile-icon-png/profile-icon-9.png" />
							<Username>
								<NamePart>{x.user.name}</NamePart>
								<DomainPart>{x.user.domain}</DomainPart>
							</Username>
						</User>
					))}
				</div>
			</Container>

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
						width: "min-content",
						height: "min-content",
						top: position.y,
						left: position.x,
						backgroundColor: "transparent",
						border: "none",
					},
				}}
			>
				<UserPopout user={user} />
			</ReactModal>
		</>
	);
};
