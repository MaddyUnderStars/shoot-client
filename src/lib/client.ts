import { EventEmitter } from "events";
import { Channel } from "./entities";
import { GATEWAY_PAYLOAD, READY } from "./types";
import { createLogger } from "./util";

export type InstanceOptions = {
	http: URL;
	gateway: URL;
};

export type ClientOptions = {
	instance: InstanceOptions | string;
	token: string;
};

const Log = createLogger("gateway");

class Shoot extends EventEmitter {
	private socket!: WebSocket;
	private _token?: string;
	get token() { return this._token; }
	private _instance?: InstanceOptions;

	get instance() {
		return this._instance;
	}

	private sequence: number = 0;
	private heartbeatTimeout?: number;

	private _connected = false;
	get connected() {
		return this._connected;
	}

	public channels = new Map<string, Channel>();

	login = (opts: ClientOptions) => {
		this._token = opts.token;

		const http = new URL(
			typeof opts.instance == "string"
				? opts.instance
				: opts.instance.http,
		);
		// http.protocol = "https";

		const gw = new URL(
			typeof opts.instance == "string"
				? opts.instance
				: opts.instance.gateway,
		);
		gw.protocol = http.protocol == "http:" ? "ws" : "wss";

		this._instance = {
			http,
			gateway: gw,
		};

		this.socket = new WebSocket(gw);

		this.socket.onopen = this.onOpen.bind(this);
		this.socket.onmessage = this.onMessage.bind(this);
		this.socket.onclose = this.onClose.bind(this);
	};

	onMessage = ({ data }: MessageEvent) => {
		this._connected = true;

		const json = JSON.parse(data) as GATEWAY_PAYLOAD;

		this.sequence++;

		if (json.t == "READY") {
			this.startHeartbeat();

			const ready = json.d as READY;

			for (const channel of ready.channels) {
				const ch = new Channel(channel);
				this.channels.set(ch.mention, ch);
			}

			this.channels = new Map(this.channels);
		}

		Log.verbose(`<- ${json.t}`);

		this.emit(json.t, json.d);
	};

	onOpen = () => {
		Log.verbose("opened");
		this.send({ t: "identify", token: this._token! });
		this._connected = true;
		this.emit("open");
	};

	onClose = () => {
		Log.verbose("closed");
		this._connected = false;
		this.emit("close");
		clearTimeout(this.heartbeatTimeout);
	};

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

			Log.verbose(`-> ${data.t}`);

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
