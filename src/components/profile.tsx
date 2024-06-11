import styled from "styled-components";
import { FaCog } from "react-icons/fa";
import { Link } from "wouter";
import { useProfile } from "../lib/hooks";

export const Profile = () => {
	const profile = useProfile();

	if (!profile) return null;

	return (
		<Container>
			<User>
				<ProfilePicture src="https://www.freeiconspng.com/thumbs/profile-icon-png/profile-icon-9.png" />

				<Username>
					<NamePart>{profile.name}</NamePart>
					<DomainPart>{profile.domain}</DomainPart>
				</Username>
			</User>

			<Link to="/settings">
				<FaCog />
			</Link>
		</Container>
	);
};

const Container = styled.div`
	padding: 20px;
	display: flex;
	justify-content: space-between;
	align-items: center;
`;

const User = styled.div`
	display: flex;
	align-items: center;
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
