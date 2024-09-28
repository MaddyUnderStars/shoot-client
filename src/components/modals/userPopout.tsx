import styled from "styled-components";
import { User } from "../../lib/entities";
import { createHttpClient } from "../../lib";
import { useLocation } from "wouter";

export type UserModalProps = {
	user?: User;
};

export const UserPopout = ({ user }: UserModalProps) => {
	const [, setLocation] = useLocation();

	if (!user) return null;

	const openDm = async () => {
		const client = createHttpClient();
		const { data } = await client.POST("/users/{user_id}/channels/", {
			params: {
				path: {
					user_id: user.mention,
				},
			},
			body: {
				name: `${user.mention}`,
			},
		});
		setLocation(`/channels/${data!.id}@${data!.domain}`);
	};

	return (
		<Container>
			<Header>
				<Username>
					<NamePart>{user.name}</NamePart>
					<DomainPart>{user.domain}</DomainPart>
				</Username>
			</Header>

			<Body>
				<p>{user.summary}</p>
				<SendMessage onClick={openDm}>Open DM</SendMessage>
			</Body>
		</Container>
	);
};

const SendMessage = styled.button`
	background-color: transparent;
	width: 100%;
	border: 1px solid grey;
	color: white;
`;

const Username = styled.div``;

const NamePart = styled.p`
	font-weight: bold;
`;

const DomainPart = styled.p`
	font-size: 0.8rem;
`;

const Header = styled.div`
	background-color: var(--brand-1);
	display: flex;
	align-items: center;
	padding: 20px;
`;

const Body = styled.div`
	padding: 0 20px 20px 20px;

	& > * {
		margin-top: 20px;
	}
`;

const Container = styled.div`
	width: 250px;
	background-color: var(--background-tertiary);
	box-shadow: 10px 10px 15px 0px rgba(0, 0, 0, 0.2);
`;
