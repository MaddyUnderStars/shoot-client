import { EventEmitter } from "events";
import { Channel, Message } from "./entities";
import { Guild } from "./entities/guild";
import { Relationship } from "./entities/relationship";
import { User } from "./entities/user";
import { LoginStore } from "./loginStore";
import { CLOSE_CODES, GATEWAY_EVENT } from "./types";
import { createLogger } from "./util";
import { WebrtcClient } from "./webrtc";

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
	private socket: WebSocket | null = null;
	private _token?: string;
	get token() {
		return this._token;
	}
	private _instance?: InstanceOptions;

	public webrtc: WebrtcClient = new WebrtcClient();

	private reconnectAttempt = 0;

	get instance() {
		return this._instance;
	}

	private sequence: number = 0;
	private heartbeatTimeout?: number;
	private reconnectTimeout?: number;

	private _connected = false;
	get connected() {
		return this._connected;
	}

	public channels = new Map<string, Channel>();

	public guilds: Guild[] = [];

	public user?: User = undefined;

	public relationships: Relationship[] = [];

	public users: Map<string, User> = new Map();

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

		this.sequence = 0;

		this.socket = new WebSocket(gw);

		this.socket.onopen = this.onOpen.bind(this);
		this.socket.onmessage = this.onMessage.bind(this);
		this.socket.onclose = this.onClose.bind(this);
		this.socket.onerror = this.onError.bind(this);
	};

	onMessage = ({ data }: MessageEvent) => {
		this._connected = true;

		const json = JSON.parse(data) as GATEWAY_EVENT;
		this.sequence++;

		if (json.t != "HEARTBEAT_ACK")
			Log.verbose(`<- [${this.sequence}] ${json.t}`);

		switch (json.t) {
			case "READY":
				this.startHeartbeat();

				this.user = new User(json.d.user);

				this.guilds = json.d.guilds.map((x) => new Guild(x));

				for (const rel of json.d.relationships) {
					this.relationships.push(new Relationship(rel));
				}

				for (const channel of json.d.channels) {
					const ch = new Channel(channel);
					this.channels.set(ch.mention, ch);
				}

				this.channels = new Map(this.channels);

				this.emit("READY");
				break;
			case "MESSAGE_CREATE": {
				const channel =
					this.channels.get(json.d.message.channel_id) ??
					this.guilds
						.flatMap((x) => x.channels)
						.find((x) => x?.mention == json.d.message.channel_id);
				channel?.addMessage(new Message(json.d.message));
				this.emit("MESSAGE_CREATE", new Message(json.d.message));
				break;
			}
			case "GUILD_CREATE": {
				const guild = new Guild(json.d.guild);
				this.guilds.push(guild);
				this.emit("GUILD_CREATE", guild);
				break;
			}
			case "RELATIONSHIP_CREATE": {
				const rel = new Relationship(json.d.relationship);
				this.relationships.push(rel);
				this.emit("RELATIONSHIP_CREATE", rel);
				break;
			}
			case "CHANNEL_CREATE": {
				const ch = new Channel(json.d.channel);
				if (!ch.guild) this.channels.set(ch.id, ch);
				this.emit("CHANNEL_CREATE", ch);
				break;
			}
		}
	};

	onOpen = () => {
		this._connected = true;
		this.reconnectAttempt = 0;
		Log.verbose("opened");
		this.send({ t: "identify", token: this._token! });
		this.emit("open");
	};

	onClose = (event: CloseEvent) => {
		Log.verbose("closed");
		this.emit("close");
		this.socket?.close();
		this._connected = false;
		clearTimeout(this.heartbeatTimeout);

		this.socket = null;

		this.sequence = 0;

		// don't reconnect if our token is bad
		if (event.code == CLOSE_CODES.BAD_TOKEN) {
			LoginStore.save(null);
			return;
		}

		if (!this.reconnectTimeout) {
			// auto reconnect
			this.reconnectTimeout = setTimeout(() => {
				Log.verbose("trying reconnect");
				this.reconnectAttempt++;
				this.reconnectTimeout = undefined;
				this.login({
					instance: this.instance!,
					token: this.token!,
				});
			}, 1000 * this.reconnectAttempt);
		}
	};

	logout = () => {
		LoginStore.save(null);
		this.socket?.close();
		this._connected = false;
	};

	onError = () => {
		Log.verbose(`closed due to error`);
		// this.onClose();
	};

	startHeartbeat = () => {
		Log.verbose("starting heartbeater");
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

			if (data.t != "heartbeat") Log.verbose(`-> ${data.t}`);

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
