import { useMemo, useSyncExternalStore } from "react";
import { shoot } from "./client";

export const useChannel = (channel_id: string, guild_id?: string) => {
	const channels = useShootChannels();
	const guild = useGuild(guild_id);

	const channel = useMemo(
		() =>
			guild
				? guild.channels?.find((x) => x.mention == channel_id)
				: channels.get(channel_id),
		[guild, channels, channel_id],
	);

	return channel;
};

export const useGuild = (guild_id?: string) => {
	const guilds = useShootGuilds();
	const guild = useMemo(
		() => guilds.find((x) => x.mention == guild_id),
		[guilds, guild_id],
	);

	return guild;
};

const subscribeShootGuilds = (callback: () => void) => {
	shoot.addListener("READY", callback);
	shoot.addListener("GUILD_CREATE", callback);

	return () => {
		shoot.removeListener("READY", callback);
		shoot.removeListener("GUILD_CREATE", callback);
	};
};

export const useShootGuilds = () =>
	useSyncExternalStore(subscribeShootGuilds, () => shoot.guilds);

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
