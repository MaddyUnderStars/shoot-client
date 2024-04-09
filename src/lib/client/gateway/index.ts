import { EventEmitter } from "events";
import type { GATEWAY_EVENT, GATEWAY_PAYLOAD, PAYLOAD } from "./types";

export declare interface Gateway {
	on<T extends GATEWAY_PAYLOAD["t"]>(
		type: T,
		listener: (data: Omit<Extract<GATEWAY_EVENT, { type: T }>, "type">) => unknown,
	): this;

	once<T extends GATEWAY_PAYLOAD["t"]>(
		type: T,
		listener: (data: Omit<Extract<GATEWAY_EVENT, { type: T }>, "type">) => unknown,
	): this;

	emit<T extends GATEWAY_PAYLOAD["t"]>(
		type: T,
		data: Omit<Extract<GATEWAY_EVENT, { type: T }>, "type">,
	): boolean;
}

export class Gateway extends EventEmitter {
	private socket!: WebSocket;
	private token!: string;

	private heartbeatTimeout?: number;

	private sequence: number = 0;

	login = async (endpoint: URL, token: string) => {
		this.token = token;

		// TODO: encoding etc
		this.socket = new WebSocket(endpoint.toString());

		this.socket.addEventListener("open", this.onOpen);
		this.socket.addEventListener("message", this.onMessage);
	};

	onMessage = (ev: MessageEvent) => {
		const data = ev.data;

		const json = JSON.parse(data.toString()) as GATEWAY_PAYLOAD;

		this.sequence++;

		if (json.t == "READY") {
			this.startHeartbeat();
		}

		this.emit(json.t, json.d);
	};

	onOpen = () => {
		this.send({ t: "identify", token: this.token });
	};

	onClose = () => {
		console.log("closed");

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
