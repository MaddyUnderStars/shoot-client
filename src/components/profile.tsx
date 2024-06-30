import styled from "styled-components";
import { FaCog } from "react-icons/fa";
import { useProfile, useWebrtcConnected } from "../lib/hooks";
import { shoot } from "../lib";
import { SettingsModal } from "./modals/settings";
import { useState } from "react";

export const Profile = () => {
	const profile = useProfile();
	const webrtc = useWebrtcConnected();

	const [isSettingsOpen, setSettingsOpen] = useState(false);

	if (!profile) return null;

	return (
		<>
			<Container>
				{webrtc && (
					<CallSection>
						Voice call
						<button onClick={() => shoot.webrtc.leave()}>
							Leave
						</button>
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

					<FaCog onClick={() => setSettingsOpen(true)} />
				</ProfileSection>
			</Container>

			<SettingsModal
				isOpen={isSettingsOpen}
				close={() => setSettingsOpen(false)}
			/>
		</>
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
