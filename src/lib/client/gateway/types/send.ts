export type PAYLOAD = IDENTIFY | HEARTBEAT;

export type IDENTIFY = {
	t: "identify";
	token: string;
};

export type HEARTBEAT = {
	t: "heartbeat";
	s: number;
};
