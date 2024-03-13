import { Client, REST } from "shoot.ts";
import type { Channel } from "shoot.ts/dist/lib/channel";
import { Message } from "shoot.ts/dist/lib/message";
import { readable } from "svelte/store";
import { getLoginInstance, setLoginInstance } from "./util";

export let client: Client | null = null;

type Setter<T> = (value: T) => void;

const dispatchers: {
	channel: Setter<Map<string, Channel>>;
	user: Setter<Client["user"]>;
	ready: Setter<Boolean>;
	messages: Setter<Map<string, Message>>;
} = {
	channel: () => {},
	user: () => {},
	ready: () => {},
	messages: () => {},
};

export const channels = readable<Client["channels"]>(new Map(), (set) => {
	if (client) set(client.channels);
	dispatchers["channel"] = set;
});

export const user = readable<Client["user"]>(
	{ display_name: "", domain: "", email: "", name: "", summary: "" },
	(set) => {
		if (client) set(client.user);
		dispatchers["user"] = set;
	},
);

export const ready = readable<Boolean>(false, (set) => {
	dispatchers.ready = set;
})

export const loginPw = async ({
	instance,
	username,
	password,
}: {
	instance: string;
	username: string;
	password: string;
}) => {
	const rest = new REST(instance);

	const { data } = await rest.POST("/auth/login", {
		body: {
			username,
			password,
		},
	});

	if (!data) throw new Error("auth failed");

	setLoginInstance({ http: instance, token: data.token });

	client = new Client({
		instance,
		token: data.token,
	});

	await client.login();

	return client;
};

export const initClient = async () => {
	const instance = getLoginInstance();
	if (!instance) throw new Error("no token");

	client = new Client({ instance: instance.http, token: instance.token });

	await client.login();

	client.on("READY", () => {
		console.log(`Logged in as ${client?.user.name}@${client?.user.domain}`);

		dispatchers.ready(true);

		dispatchers.user(client!.user);

		dispatchers.channel(client!.channels);

		client!.on("CHANNEL_CREATE", (channel) => {
			dispatchers.channel!(client!.channels);
		});

	});
};
