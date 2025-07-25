import type {
	ApiMembersChunkItem,
	ApiPrivateRelationship,
	ApiPrivateSession,
	ApiPrivateUser,
	ApiPublicDmChannel,
	ApiPublicGuild,
	ApiPublicGuildTextChannel,
	ApiPublicInvite,
	ApiPublicMember,
	ApiPublicMessage,
	ApiPublicRole,
} from "@/lib/http/types";
import type { ActorMention } from "./actor";

export type MESSAGE_CREATE = {
	t: "MESSAGE_CREATE";
	d: {
		message: ApiPublicMessage;
	};
};

export type MESSAGE_DELETE = {
	t: "MESSAGE_DELETE";
	d: {
		message_id: string;
		channel: ActorMention;
	};
};

export type CHANNEL_CREATE = {
	t: "CHANNEL_CREATE";
	d: {
		channel: ApiPublicDmChannel | ApiPublicGuildTextChannel;
	};
};

export type CHANNEL_UPDATE = {
	t: "CHANNEL_UPDATE";
	d: {
		channel: Partial<ApiPublicDmChannel | ApiPublicGuildTextChannel>;
	};
};

export type CHANNEL_DELETE = {
	t: "CHANNEL_DELETE";
	d: {
		channel: ActorMention;
		guild?: ActorMention;
	};
};

export type MEDIA_TOKEN_RECEIVED = {
	t: "MEDIA_TOKEN_RECEIVED";
	d: {
		token: string;
		endpoint: string;
	};
};

export type GUILD_CREATE = {
	t: "GUILD_CREATE";
	d: {
		guild: ApiPublicGuild;
	};
};

export type GUILD_UPDATE = {
	t: "GUILD_UPDATE";
	d: {
		guild: Partial<ApiPublicGuild>;
	};
};

export type GUILD_DELETE = {
	t: "GUILD_DELETE";
	d: {
		guild: ActorMention;
	};
};

export type ROLE_CREATE = {
	t: "ROLE_CREATE";
	d: {
		role: ApiPublicRole;
	};
};

export type ROLE_MEMBER_ADD = {
	t: "ROLE_MEMBER_ADD";
	d: {
		guild: ActorMention;
		role_id: string;
		member: ApiPublicMember;
	};
};

export type ROLE_MEMBER_LEAVE = {
	t: "ROLE_MEMBER_LEAVE";
	d: {
		guild: ActorMention;
		role_id: string;
		member: ActorMention;
	};
};

export type MEMBER_LEAVE = {
	t: "MEMBER_LEAVE";
	d: {
		guild: ActorMention;
		user: ActorMention;
	};
};

export type MEMBER_JOIN = {
	t: "MEMBER_JOIN";
	d: {
		guild: ActorMention;
		member: ApiPublicMember;
	};
};

export type RELATIONSHIP_CREATE = {
	t: "RELATIONSHIP_CREATE";
	d: {
		relationship: ApiPrivateRelationship; // TODO: public relationship type
	};
};

export type RELATIONSHIP_UPDATE = {
	t: "RELATIONSHIP_UPDATE";
	d: {
		relationship: ApiPrivateRelationship;
	};
};

export type RELATIONSHIP_DELETE = {
	t: "RELATIONSHIP_DELETE";
	d: {
		user: ActorMention;
	};
};

export type INVITE_CREATE = {
	t: "INVITE_CREATE";
	d: {
		invite: ApiPublicInvite;
	};
};

export type MEMBERS_CHUNK = {
	t: "MEMBERS_CHUNK";
	d: {
		/** Role UUID or member */
		items: Array<string | ApiMembersChunkItem>;
	};
};

/** Sent by gateway after a user has been authenticated with IDENTIFY */
export type READY = {
	t: "READY";
	d: {
		user: ApiPrivateUser;
		session: ApiPrivateSession;
		channels: Array<ApiPublicDmChannel>;
		guilds: Array<ApiPublicGuild>;
		relationships: Array<ApiPrivateRelationship>;
	};
};

export type HEARTBEAT_ACK = {
	// The expected sequence number
	t: "HEARTBEAT_ACK";
};

export type GATEWAY_EVENT =
	| MESSAGE_CREATE
	| MESSAGE_DELETE
	| CHANNEL_CREATE
	| CHANNEL_UPDATE
	| CHANNEL_DELETE
	| MEDIA_TOKEN_RECEIVED
	| GUILD_CREATE
	| GUILD_UPDATE
	| GUILD_DELETE
	| ROLE_CREATE
	| ROLE_MEMBER_ADD
	| ROLE_MEMBER_LEAVE
	| MEMBER_JOIN
	| MEMBER_LEAVE
	| RELATIONSHIP_CREATE
	| RELATIONSHIP_UPDATE
	| RELATIONSHIP_DELETE
	| INVITE_CREATE
	| MEMBERS_CHUNK
	| READY
	| HEARTBEAT_ACK;

// below is webrtc types

export type WEBRTC_READY = {
	t: "READY";
	d: {
		answer: { jsep: { type: "answer"; sdp: string } };
	};
};

export type WEBRTC_PEER_JOINED = {
	t: "PEER_JOINED";
	d: {
		user_id: string;
	};
};

export type WEBRTC_PEER_LEFT = {
	t: "PEER_LEFT";
	d: {
		user_id: string;
	};
};

export type WEBRTC_GATEWAY_EVENT =
	| WEBRTC_READY
	| WEBRTC_PEER_JOINED
	| WEBRTC_PEER_LEFT;
