import EventEmitter from "eventemitter3";
import { createLogger } from "../log";
import { setLogin } from "../storage";
import { getAppStore } from "../store/AppStore";
import { CLOSE_CODES } from "../utils";
import type { GATEWAY_EVENT } from "./common/receive";
import type { GATEWAY_SEND_PAYLOAD } from "./common/send";
import { DmChannel } from "./entity/dm-channel";
import { Guild } from "./entity/guild";
import { GuildChannel } from "./entity/guild-channel";
import { PrivateUser } from "./entity/private-user";
import { Relationship } from "./entity/relationship";
import type { ClientOptions, InstanceOptions } from "./types";

const Log = createLogger("gateway");

type Timeout = ReturnType<typeof setTimeout>;

export class ShootGatewayClient extends EventEmitter {
	private socket: WebSocket | null = null;
	private token: string;
	private _instance: InstanceOptions;

	private sequence: number = 0;
	private heartbeatTimeout?: Timeout = undefined;

	private reconnectAttempts = 0;
	private reconnectTimeout?: Timeout = undefined;

	public get instance() {
		return this._instance;
	}

	constructor(opts: ClientOptions) {
		super();

		const http = new URL(
			typeof opts.instance === "string"
				? opts.instance
				: opts.instance.http,
		);
		// http.protocol = "https";

		const gw = new URL(
			typeof opts.instance === "string"
				? opts.instance
				: opts.instance.gateway,
		);
		gw.protocol = http.protocol === "http:" ? "ws" : "wss";

		this._instance = {
			http,
			gateway: gw,
		};

		this.token = opts.token;
	}

	public login = () => {
		this.socket = new WebSocket(this.instance.gateway);

		this.socket.onopen = this.onOpen;
		this.socket.onmessage = this.onMessage;
		this.socket.onerror = this.onError;
		this.socket.onclose = this.onClose;
	};

	public logout = () => {
		setLogin(null);
		this.close();
	};

	public close = () => {
		this.socket?.close();
		this.socket = null;
	};

	public send = (data: GATEWAY_SEND_PAYLOAD) => {
		Log.verbose(
			`-> ${JSON.stringify({ ...data, token: "token" in data ? "redacted" : undefined })}`,
		);
		this.socket?.send(JSON.stringify(data));
	};

	// TODO: should wait for ack before sending next heartbeat
	private startHeartbeat = () => {
		Log.verbose("Starting heartbeat");

		const jitter = () => Math.round(Math.random() * 1900);

		const heartbeat = () => {
			this.send({ t: "heartbeat", s: this.sequence });

			this.heartbeatTimeout = setTimeout(heartbeat, 8000 + jitter());
		};

		this.heartbeatTimeout = setTimeout(heartbeat, 8000 + jitter());
	};

	private onOpen = () => {
		Log.verbose(`Connected to gateway on ${this.instance.gateway.href}`);
		this.reconnectAttempts = 0;
		clearTimeout(this.reconnectTimeout);
		this.reconnectTimeout = undefined;

		this.send({ t: "identify", token: this.token });
	};

	private onMessage = ({ data }: MessageEvent) => {
		const parsed = JSON.parse(data) as GATEWAY_EVENT;

		Log.verbose(`<- ${parsed.t}`);

		this.sequence++;

		const app = getAppStore();

		this.emit(parsed.t, parsed);

		switch (parsed.t) {
			case "READY": {
				this.startHeartbeat();

				const user = new PrivateUser(parsed.d.user);

				app.setPrivateUser(user);

				app.setDmChannels(
					parsed.d.channels.map((x) => new DmChannel(x)),
				);

				app.setGuilds(parsed.d.guilds.map((x) => new Guild(x)));

				app.setRelationships(
					parsed.d.relationships.map((x) => new Relationship(x)),
				);
				break;
			}
			case "CHANNEL_CREATE": {
				const rawChannel = parsed.d.channel;

				if ("guild" in rawChannel && rawChannel.guild) {
					const guild = app.getGuild(rawChannel.guild);
					if (!guild) {
						Log.error(`Do not know of guild ${rawChannel.guild}`);
						break;
					}

					guild.addChannel(new GuildChannel(rawChannel));
				} else if ("recipients" in rawChannel) {
					app.addDmChannel(new DmChannel(rawChannel));
				} else {
					Log.error("unknown channel structure?");
				}

				break;
			}
		}
	};

	private onError = (event: Event) => {
		Log.error("Websocket error", event);
	};

	private onClose = ({ code }: CloseEvent) => {
		clearTimeout(this.heartbeatTimeout);
		this.sequence = 0;
		Log.error(`Disconnected from gateway with code ${code}`);

		if (code === CLOSE_CODES.BAD_TOKEN) {
			// don't reconnect if our token is wrong
			this.logout();
			return;
		}

		if (!this.reconnectTimeout) {
			this.reconnectTimeout = setTimeout(() => {
				Log.verbose(
					`Trying reconnect attempt ${this.reconnectAttempts}`,
				);
				this.reconnectAttempts++;
				this.reconnectTimeout = undefined;

				if (!this.instance || !this.token) return;

				this.login();
			}, 1000 * this.reconnectAttempts);
		}
	};
}

let client: ShootGatewayClient;

export const createGatewayClient = (opts: ClientOptions) => {
	client = new ShootGatewayClient(opts);
};

export const getGatewayClient = () => {
	if (!client) throw new Error("Shoot gateway not initialised");

	return client;
};
