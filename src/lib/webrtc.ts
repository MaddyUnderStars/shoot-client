import { EventEmitter } from "events";
import { shoot } from "./client";
import { createLogger } from "./util";

type WebrtcClientOptions = {
	address: string;
};

const Log = createLogger("media");

export class WebrtcClient extends EventEmitter {
	private socket: WebSocket | null = null;
	private sequence = 0;
	private pc: RTCPeerConnection | null = null;
	private heartbeatTimeout?: number;

	private sendBuffer: WEBRTC_PAYLOAD[] = [];

	private candidates: RTCIceCandidate[] = [];

	private isReady = false;

	login = (opts: WebrtcClientOptions) => {
		this.socket = new WebSocket(new URL(opts.address));

		this.socket.onopen = this.onOpen.bind(this);
		this.socket.onmessage = this.onMessage.bind(this);
		this.socket.onclose = this.onClose.bind(this);
		this.socket.onerror = this.onError.bind(this);
	};

	doOffer = async () => {
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
			const remoteStream = event.streams[0];
			this.emit("remoteStream", remoteStream);
		};

		const stream = await navigator.mediaDevices.getUserMedia({
			audio: true,
			video: true,
		});

		stream.getTracks().forEach((track) => {
			Log.verbose("adding track", track);
			this.pc!.addTrack(track);
		});

		this.emit("stream", stream);

		const offer = await this.pc.createOffer();
		await this.pc.setLocalDescription(offer);
		return offer;
	};

	onMessage = async ({ data }: MessageEvent) => {
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

	onClose = () => {};

	onError = () => {};

	onOpen = async () => {
		Log.verbose("connected");
		this.emit("open");
		const offer = await this.doOffer();

		this.addListener("trickle_done", () => {
			this.send({
				t: "identify",
				token: shoot.token!,
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

	startHeartbeat = () => {
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
