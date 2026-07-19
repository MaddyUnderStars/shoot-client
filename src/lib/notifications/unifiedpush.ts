import { registerForPushNotifications, listDistributors } from "@/generated";
import { getHttpClient } from "../http/client";
import { getAppStore } from "../store/app-store";

export const subscribeUnifiedPush = async () => {
	const { $fetch } = getHttpClient();

	const settings = getAppStore().settings;

	const { endpoint, pubKeySet } = await registerForPushNotifications();

	if (!endpoint || !pubKeySet?.auth || !pubKeySet?.pubKey) {
		console.error("invalid registration", endpoint, pubKeySet);
		return false;
	}

	await $fetch.POST("/users/@me/push/", {
		body: {
			name: settings.notifications.device_name,
			endpoint: endpoint,
			auth: pubKeySet.auth,
			p256dh: pubKeySet.pubKey,
		},
	});

	settings.setSettings({ notifications: { enabled: true } });

	return true;
};

export const getDistributors = async () => {
	return await listDistributors();
};
