import { useSyncExternalStore } from "react";
import { shoot } from "./client";

const subscribeShootChannels = (callback: () => void) => {
	shoot.addListener("READY", callback);
	shoot.addListener("CHANNEL_CREATE", callback);

	return () => {
		shoot.removeListener("READY", callback);
		shoot.removeListener("CHANNEL_CREATE", callback);
	};
};

export const useShootChannels = () =>
	useSyncExternalStore(subscribeShootChannels, () => shoot.channels);

const subscribeConnectedHook = (callback: () => void) => {
	shoot.addListener("open", callback);
	shoot.addListener("close", callback);
	shoot.addListener("HEARTBEAT_ACK", callback);

	return () => {
		shoot.removeListener("open", callback);
		shoot.removeListener("close", callback);
		shoot.removeListener("HEARTBEAT_ACK", callback);
	};
};

export const useShootConnected = () =>
	useSyncExternalStore(subscribeConnectedHook, () => shoot.connected);
