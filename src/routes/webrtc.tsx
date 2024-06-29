import { useEffect, useRef } from "react";
import { shoot } from "../lib";

let done = false;

export const WebrtcTest = () => {
	const videoRef = useRef<HTMLVideoElement>(null);
	const removeStream = useRef<HTMLVideoElement>(null);

	useEffect(() => {
		if (done) return;
		if (!done) done = true;

		shoot.webrtc.login({
			address: "wss://dev.chat.understars.dev",
		});

		shoot.webrtc.addListener("stream", (s) => {
			videoRef.current!.srcObject = s;
		});

		shoot.webrtc.addListener("remoteStream", (s) => {
			removeStream.current!.srcObject = s;
		});
	}, []);

	return (
		<div>
			<video
				ref={videoRef}
				width={320}
				height={240}
				autoPlay
				style={{ display: "block" }}
			></video>

			<video
				ref={removeStream}
				width={320}
				height={240}
				autoPlay
				style={{ display: "block" }}
			></video>
		</div>
	);
};
