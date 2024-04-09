import type { components } from "../../http";

export type GATEWAY_PAYLOAD = {
	/**
	 * The sequence number of this payload. Increments for each sent payload.
	 */
	// s: number;

	/**
	 * The payload type
	 */
	t: GATEWAY_EVENT["type"];

	/**
	 * The payload for this event
	 */
	d: Omit<GATEWAY_EVENT, "type">;
};

export type MESSAGE_CREATE = {
	type: "MESSAGE_CREATE";
	message: components["schemas"]["PublicMessage"];
};

export type CHANNEL_CREATE = {
	type: "CHANNEL_CREATE";
	channel: components["schemas"]["PublicChannel"] & {
		owner_id: string;
		recipients: string[];
	};
};

export type RELATIONSHIP_CREATE = {
	type: "RELATIONSHIP_CREATE";
	relationship: components["schemas"]["PrivateRelationship"];
};

/** Sent by gateway after a user has been authenticated with IDENTIFY */
export type READY = {
	type: "READY";
	user: components["schemas"]["PrivateUser"];
	session: {
		id: string;
		created_at: string;
		user_id: string;
	};
	channels: Array<components["schemas"]["PublicChannel"]>;
};

export type HEARTBEAT_ACK = {
	// The expected sequence number
	type: "HEARTBEAT_ACK";
};

export type GATEWAY_EVENT =
	| MESSAGE_CREATE
	| CHANNEL_CREATE
	| RELATIONSHIP_CREATE
	| READY
	| HEARTBEAT_ACK;