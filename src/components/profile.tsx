import styled from "styled-components";
import { FaCog } from "react-icons/fa";
import { useProfile, useWebrtcConnected } from "../lib/hooks";
import { shoot } from "../lib/client";
import { SettingsModal } from "./modals/settings";
import { useEffect, useState } from "react";
import { ImPhoneHangUp } from "react-icons/im";
import type { Channel } from "../lib/entities/channel";

export const Profile = () => {
	const profile = useProfile();
	const webrtc = useWebrtcConnected();
	const [voiceChannel, setVoiceChannel] = useState<Channel>();

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		setVoiceChannel(shoot.webrtc.connected_channel);
	}, [webrtc]);

	const [isSettingsOpen, setSettingsOpen] = useState(false);

	if (!profile) return null;

	return (
		<>
			<Container>
				{webrtc && (
					<CallSection>
						<CallChanenl>
							{voiceChannel?.name}
							<div style={{ fontSize: "0.8rem" }}>
								<div>in: {voiceChannel?.guild?.name}</div>
								<div>{voiceChannel?.guild?.domain}</div>
							</div>
						</CallChanenl>

						<HangupButton onClick={() => shoot.webrtc.leave()}>
							<ImPhoneHangUp />
						</HangupButton>
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

					<FaCog
						style={{ cursor: "pointer" }}
						onClick={() => setSettingsOpen(true)}
					/>
				</ProfileSection>
			</Container>

			<SettingsModal
				isOpen={isSettingsOpen}
				close={() => setSettingsOpen(false)}
			/>
		</>
	);
};

const CallChanenl = styled.span`
	display: flex;
	flex-direction: column;
`;

const CallSection = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 10px;
`;

const HangupButton = styled.button`
	background-color: var(--background-tertiary);
	border: none;
	color: var(--text-primary);
	padding: 10px;
	cursor: pointer;
	color: red;
`;

const ProfileSection = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
`;

const Container = styled.div`
	padding: 20px;
	background-color: var(--background-secondary);
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
