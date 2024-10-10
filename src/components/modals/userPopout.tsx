import styled from "styled-components";
import type { User } from "../../lib/entities/user";
import { createHttpClient } from "../../lib/http/index";
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
		if (!data) return;
		setLocation(`/channels/${data.id}@${data.domain}`);
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
				<Button onClick={openDm}>Open DM</Button>
				<Button onClick={() => setLocation(`/users/${user.mention}`)}>Open Profile</Button>
			</Body>
		</Container>
	);
};

const Button = styled.button`
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
