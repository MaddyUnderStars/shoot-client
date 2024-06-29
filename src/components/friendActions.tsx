import { createHttpClient } from "../lib";
import { Relationship, RelationshipType } from "../lib/entities";

export const FriendActions = ({
	relationship,
}: {
	relationship: Relationship;
}) => {
	if (relationship.type != RelationshipType.pending) return null;

	return (
		<div>
			<button onClick={() => onAccept(relationship)}>Accept</button>
			<button onClick={() => onDelete(relationship)}>Ignore</button>
		</div>
	);
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
