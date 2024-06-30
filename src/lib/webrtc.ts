import { EventEmitter } from "events";
import { shoot } from "./client";
import { Channel } from "./entities";
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

	login = async (opts: WebrtcClientOptions) => {
		this.local_stream = await navigator.mediaDevices.getUserMedia({
			audio: true,
		});

		this.token = opts.token;
		this.socket = new WebSocket(new URL(opts.address));

		this.connected_channel = shoot.channels.get(opts.channel_id);

		this.socket.onopen = this.onOpen.bind(this);
		this.socket.onmessage = this.onMessage.bind(this);
		this.socket.onclose = this.onClose.bind(this);
		this.socket.onerror = this.onError.bind(this);
	};

	public leave = async () => {
		this.closePc();
		this.emit("leave");
		this.socket?.close();
	};

	private closePc = () => {
		if (!this.pc) return;

		[...this.pc.getSenders(), ...this.pc.getReceivers()].forEach((x) => {
			if (x.track) x.track.stop();
		});

		this.pc.onnegotiationneeded = null;
		this.pc.onicecandidate = null;
		this.pc.oniceconnectionstatechange = null;
		this.pc.ontrack = null;
		this.pc.close();
	};

	private doOffer = async () => {
		this.pc = new RTCPeerConnection({
			// iceServers: [
			// 	{
			// 		urls: "stun:stun.l.google.com:19302",
			// 	},
			// ],
		});

		this.pc.onnegotiationneeded = (event) =>
			Log.verbose(`pc.onnegotiationneeded`, event);
		this.pc.onicecandidate = (event) =>
			event.candidate
				? this.candidates.push(event.candidate)
				: this.emit("trickle_done");
		this.pc.oniceconnectionstatechange = () =>
			Log.verbose(this.pc!.iceConnectionState);
		this.pc.ontrack = (event) => {
			Log.verbose("pc.ontrack", event);
			this._remote_stream = event.streams[0];
			this.emit("stream", this._remote_stream);
			console.log(this.voiceElement);
			if (this.voiceElement)
				this.voiceElement.srcObject = event.streams[0]!;
		};

		this.local_stream!.getTracks().forEach((track) => {
			Log.verbose("adding track", track);
			this.pc!.addTrack(track);
		});

		const offer = await this.pc.createOffer();
		await this.pc.setLocalDescription(offer);
		return offer;
	};

	private onMessage = async ({ data }: MessageEvent) => {
		this.sequence++;

		const json = JSON.parse(data);
		console.log(json.t);

		if (json.t == "READY") {
			this.isReady = true;
			this.startHeartbeat();
			this.pc!.setRemoteDescription(json.d.answer.jsep);
		}

		console.log(json);
	};

	private onClose = () => {
		this.isReady = false;
		this.isTrying = false;
		this.connected_channel = undefined;
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
		const offer = await this.doOffer();

		this.addListener("trickle_done", () => {
			this.send({
				t: "identify",
				token: this.token!,
				offer: {
					sdp: offer.sdp!,
					type: offer.type,
				},
				candidates: this.candidates,
			});
		});
	};

	send = (data: WEBRTC_PAYLOAD): Promise<void> => {
		if (!this.isReady && data.t != "identify") {
			this.sendBuffer.push(data);
			return Promise.resolve();
		}

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
