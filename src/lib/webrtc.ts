import { EventEmitter } from "events";
import { shoot } from "./client";
import type { Channel } from "./entities/channel";
import { createLogger } from "./util";

type WebrtcClientOptions = {
	address: string;
	token: string;
	channel_id: string;
};

const Log = createLogger("media");

export class WebrtcClient extends EventEmitter {
	private socket: WebSocket | null = null;
	private sequence = 0;
	private pc: RTCPeerConnection | null = null;
	private heartbeatTimeout?: number;
	private token?: string = undefined;

	private sendBuffer: WEBRTC_PAYLOAD[] = [];

	private candidates: RTCIceCandidate[] = [];

	private isReady = false;
	public isTrying = false;

	private _remote_stream?: MediaStream;

	public connected_channel?: Channel;

	public voiceElement: HTMLAudioElement | null = null;

	get remote_stream() {
		return this._remote_stream;
	}

	private local_stream?: MediaStream;

	private local_offer: RTCSessionDescriptionInit | null = null;

	login = async (opts: WebrtcClientOptions) => {
		this.local_stream = await navigator.mediaDevices.getUserMedia({
			audio: {
				autoGainControl: false,
				echoCancellation: false,
				noiseSuppression: false,
				channelCount: 2,
			},
		});

		this.token = opts.token;
		this.socket = new WebSocket(new URL(opts.address));

		this.connected_channel =
			shoot.channels.get(opts.channel_id) ??
			shoot.guilds
				.flatMap((x) => x.channels)
				.find((x) => x.mention === opts.channel_id);
		console.log(this.connected_channel, opts.channel_id);

		this.socket.onopen = this.onOpen.bind(this);
		this.socket.onmessage = this.onMessage.bind(this);
		this.socket.onclose = this.onClose.bind(this);
		this.socket.onerror = this.onError.bind(this);
	};

	public leave = async () => {
		this.closePc();
		this.emit("leave");
		this.socket?.close();
		this.isTrying = false;
		this.isReady = false;
	};

	private closePc = () => {
		if (!this.pc) return;

		const tracks = [...this.pc.getSenders(), ...this.pc.getReceivers()];
		for (const { track } of tracks) {
			if (track) track.stop();
		}

		this.pc.onnegotiationneeded = null;
		this.pc.onicecandidate = null;
		this.pc.oniceconnectionstatechange = null;
		this.pc.ontrack = null;
		this.pc.close();
	};

	private doOffer = async () => {
		this.pc = new RTCPeerConnection();

		this.pc.onnegotiationneeded = (event) =>
			Log.verbose("pc.onnegotiationneeded", event);
		this.pc.onicecandidate = (event) =>
			event.candidate
				? this.candidates.push(event.candidate)
				: this.identify();
		this.pc.oniceconnectionstatechange = () =>
			Log.verbose(this.pc?.iceConnectionState);
		this.pc.ontrack = (event) => {
			Log.verbose("pc.ontrack", event);
			this._remote_stream = event.streams[0];
			this.emit("stream", this._remote_stream);

			if (this.voiceElement && event.streams[0]) {
				this.voiceElement.srcObject = event.streams[0];
			}
		};

		this.pc.onicecandidateerror = (ev) => {
			console.error(ev);

			this.leave();
		};

		for (const track of this.local_stream?.getTracks() ?? []) {
			Log.verbose("adding track", track);
			this.pc?.addTrack(track);
		}

		const offer = await this.pc.createOffer();
		await this.pc.setLocalDescription(offer);
		return offer;
	};

	private onMessage = async ({ data }: MessageEvent) => {
		this.sequence++;

		const json = JSON.parse(data);

		Log.verbose(`<- [${this.sequence}] ${json.t}`);

		if (json.t === "READY") {
			this.isReady = true;
			this.startHeartbeat();
			this.pc?.setRemoteDescription(json.d.answer.jsep);
		}
	};

	private onClose = () => {
		this.isReady = false;
		this.isTrying = false;
		this.sequence = 0;
		this.closePc();
		if (this.socket) {
			this.socket.onclose = null;
			this.socket.onopen = null;
			this.socket.onmessage = null;
			this.socket.onerror = null;
		}
		this.socket = null;
		this.connected_channel = undefined;
		this.local_stream = undefined;
		clearTimeout(this.heartbeatTimeout);
		this.emit("close");
	};

	private onError = () => {
		this.onClose();
	};

	private onOpen = async () => {
		Log.verbose("connected");
		this.emit("open");
		this.isTrying = true;
		this.emit("login");
		this.local_offer = await this.doOffer();
	};

	identify = () => {
		if (!this.local_offer || !this.token || !this.local_offer.sdp) return;
		this.send({
			t: "identify",
			token: this.token,
			offer: {
				sdp: this.local_offer.sdp,
				type: this.local_offer.type,
			},
			candidates: this.candidates,
		});
	};

	send = (data: WEBRTC_PAYLOAD): Promise<void> => {
		if (!this.isReady && data.t !== "identify") {
			this.sendBuffer.push(data);
			return Promise.resolve();
		}

		return new Promise((resolve, reject) => {
			if (!this.socket || this.socket.readyState !== this.socket.OPEN)
				throw new Error("gateway socket isn't open");

			if (data.t !== "heartbeat") Log.verbose(`-> ${data.t}`);

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

	private startHeartbeat = () => {
		Log.verbose("starting heartbeater");
		const heartbeat = () => {
			this.send({ t: "heartbeat", s: this.sequence });

			this.heartbeatTimeout = setTimeout(heartbeat, 4500);
		};

		this.heartbeatTimeout = setTimeout(heartbeat, 4500);
	};
}

type WEBRTC_PAYLOAD = IDENTIFY | HEARTBEAT;

type IDENTIFY = {
	t: "identify";
	token: string;
	offer: {
		sdp: string;
		type: string;
	};
	candidates: RTCIceCandidate[];
};

type HEARTBEAT = {
	t: "heartbeat";
	s: number;
};
