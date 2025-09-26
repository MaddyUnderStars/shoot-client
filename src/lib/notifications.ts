import { getHttpClient } from "./http/client";
import { getLogin } from "./storage";
import { getAppStore } from "./store/app-store";

export const subscribeNotifications = async () => {
	const { $fetch } = getHttpClient();

	const settings = getAppStore().settings;

	const perm = await requestPermission();

	if (perm !== "granted") return;

	const worker = await navigator.serviceWorker.getRegistration();

	if (!worker) return;

	const applicationServerKey = await getPublicKey();

	const subscription = await worker.pushManager.subscribe({
		applicationServerKey,
		userVisibleOnly: true,
	});

	const json = subscription.toJSON();

	if (!json.endpoint || !json.keys || !("auth" in json.keys) || !("p256dh" in json.keys)) return;

	await $fetch.POST("/users/@me/push/", {
		body: {
			name: settings.notifications.device_name,
			endpoint: json.endpoint,
			auth: json.keys.auth,
			p256dh: json.keys.p256dh,
		},
	});

	settings.notifications.enabled = true;
};

const getPublicKey = async () => {
	const login = getLogin();
	if (!login) throw new Error("missing login");

	const instance = typeof login.instance === "string" ? login.instance : login.instance.http;

	const nodeInfo = new URL(instance);
	nodeInfo.pathname = "/.well-known/nodeinfo/2.0";

	const res = await fetch(nodeInfo);
	const json = await res.json();

	return json.metadata.webPushPublicKey as string;
};

const requestPermission = () =>
	new Promise<NotificationPermission>((resolve, reject) => {
		const res = Notification.requestPermission((perm) => resolve(perm));

		if (res) res.then(resolve, reject);
	});
