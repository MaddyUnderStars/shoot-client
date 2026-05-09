import {
	getUnifiedPushDistributors,
	registerForUnifiedPush,
} from "@sableclient/tauri-plugin-notifications-api";
import { getHttpClient } from "../http/client";
import { getAppStore } from "../store/app-store";

export const subscribeUnifiedPush = async () => {
	const { $fetch } = getHttpClient();

	const settings = getAppStore().settings;

	const { endpoint, pubKeySet } = await registerForUnifiedPush();

	if (!endpoint || !pubKeySet?.auth || !pubKeySet.pubKey) {
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

	settings.notifications.enabled = true;

	return true;
};

export const getDistributors = async () => {
	return await getUnifiedPushDistributors();
};
