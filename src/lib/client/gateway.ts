import EventEmitter from "eventemitter3";
import { createLogger } from "../log";
import { setLogin } from "../storage";
import { getAppStore } from "../store/app-store";
import { CLOSE_CODES, jitter } from "../utils";
import type { GATEWAY_EVENT } from "./common/receive";
import type { GATEWAY_SEND_PAYLOAD } from "./common/send";
import { DmChannel } from "./entity/dm-channel";
import { Guild } from "./entity/guild";
import { GuildChannel } from "./entity/guild-channel";
import { PrivateUser } from "./entity/private-user";
import { Relationship } from "./entity/relationship";
import type { ClientOptions, InstanceOptions } from "./types";
import { PublicUser } from "./entity/public-user";
import { Role } from "./entity/role";

const Log = createLogger("gateway");

type Timeout = ReturnType<typeof setTimeout>;

export class ShootGatewayClient extends EventEmitter {
	private socket: WebSocket | null = null;
	private token!: string;
	private gwInstance!: InstanceOptions;

	private sequence: number = 0;
	private heartbeatTimeout?: Timeout = undefined;

	private reconnectAttempts = 0;
	private reconnectTimeout?: Timeout = undefined;

	private isReady = false;

	public get ready() {
		return this.isReady;
	}

	public get instance() {
		return this.gwInstance;
	}

	public login = (opts: ClientOptions) => {
		const http = new URL(
			typeof opts.instance === "string" ? opts.instance : opts.instance.http,
		);
		// http.protocol = "https";

		const gw = new URL(
			typeof opts.instance === "string" ? opts.instance : opts.instance.gateway,
		);
		gw.protocol = http.protocol === "http:" ? "ws" : "wss";

		this.gwInstance = {
			http,
			gateway: gw,
		};

		this.token = opts.token;

		this.socket = new WebSocket(this.gwInstance.gateway);

		this.isReady = false;
		this.socket.addEventListener("open", this.onOpen);
		this.socket.addEventListener("message", this.onMessage);
		this.socket.addEventListener("error", this.onError);
		this.socket.addEventListener("close", this.onClose);
	};

	public logout = () => {
		setLogin(null);
		this.close();
	};

	public close = () => {
		this.socket?.close();
		this.socket = null;
		this.isReady = false;
	};

	public send = (data: GATEWAY_SEND_PAYLOAD) => {
		if (!this.socket || this.socket.readyState !== WebSocket.OPEN) return;

		this.socket.send(JSON.stringify(data));
	};

	// TODO: should wait for ack before sending next heartbeat
	private startHeartbeat = () => {
		Log.verbose("Starting heartbeat");

		const heartbeat = () => {
			this.send({
				t: "heartbeat",
				s: this.sequence,
			});

			const t = 8000 + jitter(2000);
			this.heartbeatTimeout = setTimeout(heartbeat, t);
		};

		this.heartbeatTimeout = setTimeout(heartbeat, 8000 + jitter(2000));
	};

	private onOpen = () => {
		Log.verbose(`Connected to gateway on ${this.gwInstance.gateway.href}`);
		this.reconnectAttempts = 0;
		clearTimeout(this.reconnectTimeout);
		this.reconnectTimeout = undefined;

		this.emit("SOCKET_OPEN");

		this.send({
			t: "identify",
			token: this.token,
		});
	};

	private onMessage = ({ data }: MessageEvent) => {
		// oxlint-disable-next-line typescript/no-unsafe-type-assertion
		const parsed = JSON.parse(data) as GATEWAY_EVENT;

		this.sequence++;

		const app = getAppStore();

		switch (parsed.t) {
			case "READY": {
				this.startHeartbeat();

				const user = new PrivateUser(parsed.d.user);

				app.setPrivateUser(user);

				app.setDmChannels(parsed.d.channels.map((x) => new DmChannel(x)));

				app.setGuilds(parsed.d.guilds.map((x) => new Guild(x)));

				app.setRelationships(parsed.d.relationships.map((x) => new Relationship(x)));

				for (const rel of parsed.d.relationships) {
					app.users.setUser(rel.user.mention, new PublicUser(rel.user));
				}

				this.isReady = true;
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

					guild.addChannel(new GuildChannel(rawChannel, rawChannel.guild));
				} else if ("recipients" in rawChannel) {
					app.addDmChannel(new DmChannel(rawChannel));
				} else {
					Log.error("unknown channel structure?");
				}

				break;
			}
			case "CHANNEL_DELETE": {
				const channelId = parsed.d.channel;

				app.dmChannels = app.dmChannels.filter((x) => x.mention !== channelId);
				for (const guild of app.guilds) {
					guild.channels = guild.channels.filter((x) => x.mention !== channelId);
				}
				break;
			}
			case "GUILD_CREATE": {
				const rawGuild = parsed.d.guild;

				app.guilds.push(new Guild(rawGuild));
				break;
			}
			case "GUILD_UPDATE": {
				const rawGuild = parsed.d.guild;

				const guild = app.getGuild(rawGuild.mention!);
				if (!guild) break;

				if (rawGuild.name) guild.name = rawGuild.name;
				guild.summary = rawGuild.summary;
				break;
			}
			case "ROLE_CREATE": {
				const guild = app.getGuild(parsed.d.role.guild);
				if (!guild) break;

				guild.roles.push(new Role(parsed.d.role));
				guild.roles = guild.roles.toSorted((a, b) => b.position - a.position);
				break;
			}
			case "ROLE_UPDATE": {
				const guild = app.getGuild(parsed.d.role.guild);
				if (!guild) break;

				guild.roles = guild.roles.filter((x) => x.id !== parsed.d.role.id);
				guild.roles.push(new Role(parsed.d.role));
				guild.roles = guild.roles.toSorted((a, b) => b.position - a.position);
				break;
			}
			case "ROLE_DELETE": {
				const guild = app.getGuild(parsed.d.guild_id);
				if (!guild) break;

				guild.roles = guild.roles.filter((x) => x.id !== parsed.d.role_id);
				guild.roles = guild.roles.toSorted((a, b) => b.position - a.position);
				break;
			}
			case "GUILD_DELETE": {
				app.guilds = app.guilds.filter((x) => x.mention !== parsed.d.guild);

				break;
			}
			case "RELATIONSHIP_CREATE": {
				app.relationships.push(new Relationship(parsed.d.relationship));
				break;
			}
			case "RELATIONSHIP_DELETE": {
				const rel = parsed.d.user;

				app.relationships = app.relationships.filter((x) => x.user.mention !== rel);
				break;
			}
		}

		this.emit(parsed.t, parsed);
	};

	private onError = (event: Event) => {
		Log.error("Websocket error", event);

		this.emit("SOCKET_ERROR", event);
	};

	private onClose = ({ code }: CloseEvent) => {
		clearTimeout(this.heartbeatTimeout);
		this.sequence = 0;
		Log.error(`Disconnected from gateway with code ${code}`);

		this.emit("SOCKET_CLOSE", code);

		// oxlint-disable-next-line typescript/no-unsafe-enum-comparison
		if (code === CLOSE_CODES.BAD_TOKEN) {
			// don't reconnect if our token is wrong
			this.logout();
			return;
		}

		if (!this.reconnectTimeout) {
			// if we're in the background, don't reconnect immediately
			// as it'll just keep disconnecting

			if (document.hidden) {
				Log.verbose("We're in the background, discontinuing reconnect attempts");

				document.addEventListener(
					"visibilitychange",
					() => {
						if (document.hidden) return; // hmm
						if (!this.gwInstance || !this.token) return;

						Log.verbose("We're in foreground again. Reconnecting...");

						this.login({ instance: this.gwInstance, token: this.token });
					},
					{ once: true },
				);

				return;
			}

			this.reconnectTimeout = setTimeout(
				() => {
					Log.verbose(`Trying reconnect attempt ${this.reconnectAttempts}`);
					this.reconnectAttempts++;
					this.reconnectTimeout = undefined;

					if (!this.gwInstance || !this.token) return;

					this.login({ instance: this.gwInstance, token: this.token });
				},
				1000 * this.reconnectAttempts + jitter(this.reconnectAttempts * 1000),
			);
		}
	};
}

export const gatewayClient = new ShootGatewayClient();
