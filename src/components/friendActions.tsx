import styled from "styled-components";
import { createHttpClient } from "../lib";
import { Relationship, RelationshipType } from "../lib/entities";

const Container = styled.div`

`

const Button = styled.button`
	border: none;
	background-color: var(--background-tertiary);
	color: var(--text-primary);
	padding: 10px;
	margin-left: 10px;
`

const PendingActions = ({ rel }: { rel: Relationship }) => {
	return (
		<Container>
			<Button onClick={() => onAccept(rel)}>Accept</Button>
			<Button onClick={() => onDelete(rel)}>Ignore</Button>
		</Container>
	);
};

const AcceptedActions = ({ rel }: { rel: Relationship }) => {
	return (
		<Container>
			<Button>Remove</Button>
			<Button>Block</Button>
		</Container>
	)
}

export const FriendActions = ({
	relationship,
}: {
	relationship: Relationship;
}) => {
	switch (relationship.type) {
		case RelationshipType.pending:
			return <PendingActions rel={relationship} />;
		case RelationshipType.accepted:
			return <AcceptedActions rel={relationship} />
		default:
			return null;
	}
};

const onDelete = async (rel: Relationship) => {
	const client = createHttpClient();

	const { data } = await client.DELETE("/users/{user_id}/relationship/", {
		params: {
			path: {
				user_id: rel.user.mention,
			},
		},
	});

	return data;
};

const onAccept = async (rel: Relationship) => {
	const client = createHttpClient();

	const { data } = await client.POST("/users/{user_id}/relationship/", {
		params: {
			path: {
				user_id: rel.user.mention,
			},
		},
	});

	return data;
};
