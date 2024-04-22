import { GATEWAY_PAYLOAD } from "./types";

export type InstanceOptions =
	| string
	| { http: { url: string }; gateway: { url: string } };

export type ClientOptions = {
	instance: InstanceOptions;
	token: string;
};

class Shoot {
	private socket?: WebSocket;
	private token?: string;
	private instance?: InstanceOptions;

	private sequence: number = 0;
	private heartbeatTimeout?: number;

	login = async (opts: ClientOptions) => {
		this.instance = opts.instance;
		this.token = opts.token;

		const http = new URL(
			typeof opts.instance == "string"
				? opts.instance
				: opts.instance.http.url,
		);
		http.protocol = "https";

		const gw = new URL(
			typeof opts.instance == "string"
				? opts.instance
				: opts.instance.gateway.url,
		);
		gw.protocol = "wss";

		this.socket = new WebSocket(gw);

		this.socket.addEventListener("open", this.onOpen);
		this.socket.addEventListener("message", this.onMessage);
	};

	onMessage = ({ data }: MessageEvent) => {
		const json = JSON.parse(data) as GATEWAY_PAYLOAD;

		this.sequence++;

		if (json.t == "READY")
			this.startHeartbeat();

		console.log(`<- ${json.t}`);
	}

	onOpen = () => {
		this.send({ t: "identify", token: this.token! });
	};

	onClose = () => {
		console.log("closed");
		clearTimeout(this.heartbeatTimeout);
	}

	startHeartbeat = () => {
		const heartbeat = () => {
			this.send({ t: "heartbeat", s: this.sequence });

			this.heartbeatTimeout = setTimeout(heartbeat, 4500);
		};

		this.heartbeatTimeout = setTimeout(heartbeat, 4500);
	};

	send = (data: PAYLOAD): Promise<void> => {
		return new Promise((resolve, reject) => {
			if (!this.socket || this.socket.readyState != this.socket.OPEN)
				throw new Error("gateway socket isn't open");

			console.log(`-> ${data.t}`);

			try {
				//@ts-expect-error TODO
				this.socket.send(JSON.stringify(data), (err) => {
					if (err) reject(err);
					else resolve();
				});
				resolve();
			} catch (e) {
				reject(e);
			}
		});
	};
}

export type PAYLOAD = IDENTIFY | HEARTBEAT;

export type IDENTIFY = {
	t: "identify";
	token: string;
};

export type HEARTBEAT = {
	t: "heartbeat";
	s: number;
};

export const shoot = new Shoot();
