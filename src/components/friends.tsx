import styled from "styled-components";
import { useRelationships } from "../lib/hooks";
import ReactModal from "react-modal";
// import { UserPopout } from "./modals/userPopout";
import { lazy, Suspense, useState } from "react";
import type {
	Relationship as RelType,
	User as UserType,
} from "../lib/entities";
import { AddFriend } from "./addFriend";
import { FriendActions } from "./friendActions";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";

const UserPopout = lazy(async () => ({
	default: (await import("./modals/userPopout")).UserPopout,
}));

export const Friends = () => {
	const relationships = useRelationships();
	const [user, setUser] = useState<UserType>();
	const [popup, setPopup] = useState<boolean>(false);
	const [position, setPosition] = useState<{ x: number; y: number }>({
		x: 0,
		y: 0,
	});

	const openUserPopup = (u: RelType) => {
		setPopup(true);
		setUser(u.user);
	};

	return (
		<>
			<Container>
				<Header>
					<Tab>Friends</Tab>
					<Tab>Add Friends</Tab>
				</Header>

				<Scrollable>
					{relationships.map((x) => (
						<Relationship key={x.user.mention}>
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

							<FriendActions relationship={x} />
						</Relationship>
					))}
				</Scrollable>

				<TabPanel style={{ display: "flex" }}>
					<AddFriend />
				</TabPanel>
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
				<Suspense fallback={<p>Loading...</p>}>
					<UserPopout user={user} />
				</Suspense>
			</ReactModal>
		</>
	);
};

const Header = styled(TabList)`
	position: sticky;
	top: 0;
	background-color: var(--background-secondary);
	display: flex;
	gap: 10px;
	margin: 0;
	padding: 0 10px 0 10px;

	& li {
		background-color: var(--background-tertiary);
		border: none;
		color: var(--text-primary);
		padding: 5px;
		text-decoration: none;
		cursor: pointer;
	}

	& li[aria-selected="true"] {
		border-bottom: 1px solid white;
	}
`;

const Relationship = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	border-bottom: 1px solid grey;
	height: 4.5rem;
	&:last-child {
		border-bottom: none;
	}
`;

const Container = styled(Tabs)`
	flex: 1;
	display: flex;
	flex-direction: column;
`;

const Scrollable = styled(TabPanel)`
	overflow-y: auto;
	padding: 0 20px 0 20px;
`;

const User = styled.div`
	display: flex;
	align-items: center;
	cursor: pointer;
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
