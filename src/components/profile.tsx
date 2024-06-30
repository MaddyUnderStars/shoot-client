import styled from "styled-components";
import { FaCog } from "react-icons/fa";
import { Link } from "wouter";
import { useProfile, useWebrtcConnected } from "../lib/hooks";
import { shoot } from "../lib";

export const Profile = () => {
	const profile = useProfile();
	const webrtc = useWebrtcConnected();

	if (!profile) return null;

	return (
		<Container>
			{webrtc && (
				<CallSection>
					Voice call
					<button onClick={() => shoot.webrtc.leave()}>Leave</button>
				</CallSection>
			)}
			<ProfileSection>
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
			</ProfileSection>
		</Container>
	);
};

const CallSection = styled.div``;

const ProfileSection = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
`;

const Container = styled.div`
	padding: 20px;
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
