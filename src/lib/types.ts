import { ChannelSchema } from "./entities";
import { GuildSchema } from "./entities/guild";
import { components } from "./http/generated/v1";

export type MESSAGE_CREATE = {
	t: "MESSAGE_CREATE";
	d: {
		message: components["schemas"]["PublicMessage"];
	};
};

export type CHANNEL_CREATE = {
	t: "CHANNEL_CREATE";
	d: {
		channel: components["schemas"]["PublicChannel"] & {
			owner_id: string;
			recipients: string[];
		};
	};
};

export type GUILD_CREATE = {
	t: "GUILD_CREATE";
	d: {
		guild: components["schemas"]["PublicGuild"];
	};
};

export type RELATIONSHIP_CREATE = {
	t: "RELATIONSHIP_CREATE";
	d: {
		relationship: components["schemas"]["PrivateRelationship"];
	};
};

/** Sent by gateway after a user has been authenticated with IDENTIFY */
export type READY = {
	t: "READY";
	d: {
		user: components["schemas"]["PrivateUser"];
		session: {
			id: string;
			created_at: string;
			user_id: string;
		};
		channels: Array<ChannelSchema>;
		guilds: Array<GuildSchema>;
		relationships: Array<components["schemas"]["PrivateRelationship"]>;
	};
};

export type HEARTBEAT_ACK = {
	// The expected sequence number
	t: "HEARTBEAT_ACK";
};

export type GATEWAY_EVENT =
	| MESSAGE_CREATE
	| CHANNEL_CREATE
	| GUILD_CREATE
	| RELATIONSHIP_CREATE
	| READY
	| HEARTBEAT_ACK;

export enum CLOSE_CODES {
	CLOSE_NORMAL = 1000,
	CLOSE_TOO_LARGE = 1009,
	SERVER_ERROR = 1011,
	SERVICE_RESTART = 1012,
	TRY_AGAIN_LATER = 1013,

	/** We did not receive heartbeat in time */
	HEARTBEAT_TIMEOUT = 4000,

	/** We did not receive auth in time */
	IDENTIFY_TIMEOUT = 4001,

	/** We received a payload that failed validation */
	BAD_PAYLOAD = 4002,

	/** The token provided in IDENTIFY was invalid */
	BAD_TOKEN = 4100,
}
