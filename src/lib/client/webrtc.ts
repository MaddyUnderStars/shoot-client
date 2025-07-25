import EventEmitter from "eventemitter3";
import { computed } from "mobx";
import { createLogger } from "../log";
import { getAppStore } from "../store/AppStore";
import type { ActorMention } from "./common/actor";
import type { WEBRTC_GATEWAY_EVENT } from "./common/receive";
import type { WEBRTC_SEND_PAYLOAD } from "./common/send";

const Log = createLogger("webrtc");

type Timeout = ReturnType<typeof setTimeout>;

export class ShootWebrtcClient extends EventEmitter {
	private socket?: WebSocket;

	private sequence: number = 0;
	private heartbeatTimeout?: Timeout = undefined;

	private _channel: ActorMention;
	private _endpoint: URL;
	private _token: string;

	private userMedia?: MediaStream;
	private remoteMedia?: MediaStream;
	private peerConnection?: RTCPeerConnection;

	private localOffer?: RTCSessionDescriptionInit;

	private audioElement = document.getElementById(
		"voice-call-element",
	) as HTMLAudioElement;

	private app = getAppStore();

	@computed
	public get channel() {
		const ch = this.app.getChannel(this._channel);
		if (!ch) throw new Error("webrtc channel does not exist?");

		return ch;
	}

	constructor(channel: ActorMention, endpoint: URL, token: string) {
		super();

		this._channel = channel;
		this._endpoint = endpoint;
		this._token = token;
	}

	public login = async () => {
		this.userMedia = await navigator.mediaDevices.getUserMedia({
			audio: {
				autoGainControl: true,
				echoCancellation: false,
				noiseSuppression: false,
				channelCount: 2,
			},
		});

		this.socket = new WebSocket(this._endpoint);

		this.socket.onopen = this.onOpen;
		this.socket.onmessage = this.onMessage;
		this.socket.onerror = this.onError;
		this.socket.onclose = this.onClose;
	};

	private doOffer = async () => {
		this.peerConnection = new RTCPeerConnection();
		const candidates: RTCIceCandidate[] = [];

		this.peerConnection.onicecandidate = (event) =>
			event.candidate
				? candidates.push(event.candidate)
				: this.identify(candidates);

		this.peerConnection.ontrack = (event) => {
			this.remoteMedia = event.streams[0];

			if (!this.remoteMedia) return;

			this.audioElement.srcObject = this.remoteMedia;
		};

		this.peerConnection.onicecandidateerror = () => this.leave();

		for (const track of this.userMedia?.getTracks() ?? []) {
			this.peerConnection.addTrack(track);
		}

		const offer = await this.peerConnection.createOffer();
		await this.peerConnection.setLocalDescription(offer);
		return offer;
	};

	public leave = () => {
		this.closePeerConnection();
		this.socket?.close();
		this.socket = undefined;
	};

	private closePeerConnection = () => {
		if (!this.peerConnection) return;

		this.peerConnection.close();

		const tracks = [
			...this.peerConnection.getSenders(),
			...this.peerConnection.getReceivers(),
		];
		for (const { track } of tracks) {
			if (track) track.stop();
		}

		this.peerConnection.onnegotiationneeded = null;
		this.peerConnection.onicecandidate = null;
		this.peerConnection.oniceconnectionstatechange = null;
		this.peerConnection.ontrack = null;
		this.peerConnection.close();
		this.peerConnection = undefined;
	};

	private identify = (candidates: RTCIceCandidate[]) => {
		if (!this.localOffer || !this.localOffer.sdp) return;

		this.send({
			t: "identify",
			token: this._token,
			offer: {
				sdp: this.localOffer.sdp,
				type: this.localOffer.type,
			},
			candidates,
		});
	};

	private onOpen = async () => {
		this.localOffer = await this.doOffer();
	};

	private onClose = () => {
		this.leave();
		clearTimeout(this.heartbeatTimeout);
	};

	private onError = () => {
		this.leave();
	};

	private onMessage = ({ data }: MessageEvent) => {
		this.sequence++;

		const json = JSON.parse(data) as WEBRTC_GATEWAY_EVENT;

		if (json.t === "READY") {
			this.peerConnection?.setRemoteDescription(json.d.answer.jsep);
			this.startHeartbeat();
		}
	};

	public send = (data: WEBRTC_SEND_PAYLOAD) => {
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
}
