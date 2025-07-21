import type { ActorMention } from "../client/common/actor";
import type { components } from "./generated/v1";

export type ApiPublicUser = components["schemas"]["PublicUser"];

export type ApiPrivateUser = components["schemas"]["PrivateUser"];

export type ApiPrivateRelationship =
	components["schemas"]["PrivateRelationship"];

export type ApiPublicAttachment = components["schemas"]["PublicAttachment"];

export type ApiPublicChannel = components["schemas"]["PublicChannel"];

export type ApiPublicDmChannel = components["schemas"]["PublicDmChannel"];

export type ApiPublicGuild = components["schemas"]["PublicGuild"];

export type ApiPublicGuildTextChannel =
	components["schemas"]["PublicGuildTextChannel"];

export type ApiPublicMessage = components["schemas"]["PublicMessage"];

export type ApiPublicRole = components["schemas"]["PublicRole"];

// The below aren't in the openapi spec, whoops
export type ApiPublicMember = {
	id: string;
	nickname: string;

	user: ApiPublicUser;
	roles: string[];
};

export type ApiPublicInvite = {
	code: string;
	expires: string; // date
	guild?: ApiPublicGuild;
};

export type ApiPrivateSession = {
	id: string;
	created_at: string; // date
	user_id: string;
};

export type ApiMembersChunkItem = {
	name: string;
	member_id?: string;
	user_id: ActorMention;
};
