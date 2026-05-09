import type { ActorMention } from "./actor";

export type IDENTIFY = {
	t: "identify";
	token: string;
};

export type HEARTBEAT = {
	t: "heartbeat";
	s: number;
};

export type SUBSCRIBE_MEMBERS = {
	t: "members";
	channel_id: ActorMention;
	range: [number, number];
	online?: boolean | null;
};

export type VOICE_QUERY = {
	t: "voices";
	guild: ActorMention;
};

export type GATEWAY_SEND_PAYLOAD = IDENTIFY | HEARTBEAT | SUBSCRIBE_MEMBERS | VOICE_QUERY;

// webrtc types below

export type WEBRTC_IDENTIFY = {
	t: "identify";
	token: string;
	offer: {
		type: string;
		sdp: string;
	};

	candidates: RTCIceCandidateInit[];
};

export type WEBRTC_SEND_PAYLOAD = WEBRTC_IDENTIFY | HEARTBEAT;
