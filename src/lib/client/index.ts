import createClient from "openapi-fetch";
import { setLogin } from "../util";
import { Channel, User } from "./entities";
import { Gateway } from "./gateway";
import type { READY } from "./gateway/types";
import type { paths } from "./http";

export * from "./entities";

export type Instance = {
	http: URL;
	gateway: URL;
	cdn: URL;
};

export type Login = {
	instance: Instance;
	token: string;
};

const gateway = new Gateway();

export let channels = new Map<string, Channel>();
export let user: User | undefined = undefined;
export let session: READY["session"] | undefined = (undefined);
export let ready = false;

gateway.on("READY", (data) => {
	for (const ch of data.channels) {
		const channel = new Channel(ch);
		channels.set(channel.mention, channel);
	}

	channels = channels;

	user = data.user;
	session = data.session;	
	ready = true;
});

gateway.on("CHANNEL_CREATE", ({ channel }) => {
	const ch = new Channel(channel);
	channels.set(ch.mention, ch);
	channels = channels;
});

// gateway.on("MESSAGE_CREATE", ({ message }) => {
// 	messages.update((value) => {
// 		const msg = new Message(message);
// 		value.set(message.id, msg);
// 		return value;
// 	});
// });

export let http: ReturnType<typeof createClient<paths>>;

export const login = async (auth: Login) => {
	http = createClient<paths>({
		baseUrl: auth.instance.http.toString(),
		headers: {
			Authorization: auth.token,
		},
	});

	await gateway.login(auth.instance.gateway, auth.token);
};

export const loginPassword = async (
	instance: Instance,
	username: string,
	password: string,
) => {
	const http = createClient<paths>({ baseUrl: instance.http.toString() });

	const { data } = await http.POST("/auth/login", {
		body: {
			username,
			password,
		},
	});

	if (!data) throw new Error("Login failed");

	const l = {
		instance,
		token: data.token,
	};

	setLogin(l);

	return await login(l);
};

export const discoverEndpoints = async (
	instance: string,
): Promise<Instance> => {
	const url = new URL(instance);

	const gw = new URL(url);
	gw.protocol = "wss";

	// TODO
	return {
		http: url,
		gateway: gw,
		cdn: url,
	};
};
