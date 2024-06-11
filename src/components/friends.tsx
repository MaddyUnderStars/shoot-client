import styled from "styled-components";
import { useRelationships } from "../lib/hooks";

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

	return (
		<Container>
			Friends
			<div>
				{relationships.map((x) => (
					<User key={x.user.mention}>
						<ProfilePicture src="https://www.freeiconspng.com/thumbs/profile-icon-png/profile-icon-9.png" />
						<Username>
							<NamePart>{x.user.name}</NamePart>
							<DomainPart>{x.user.domain}</DomainPart>
						</Username>
					</User>
				))}
			</div>
		</Container>
	);
};
