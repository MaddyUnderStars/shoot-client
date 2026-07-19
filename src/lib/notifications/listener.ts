import { addPluginListener } from "@tauri-apps/api/core";
import { sendNotification, isPermissionGranted } from "@tauri-apps/plugin-notification";
import { getLogin } from "../storage";
import { getAppStore } from "../store/app-store";
import type { PushNotificationData } from ".";

export const initNotificationListener = async () => {
	// await createNotificationChannels();

	// UP is only supported on android currently
	if (!import.meta.env.VITE_IS_MOBILE_TAURI) return;

	await addPluginListener<{ message: string }>("unifiedpush", "push-message", async (event) => {
		// oxlint-disable-next-line typescript/no-unsafe-type-assertion
		const notif = JSON.parse(event.message) as PushNotificationData;

		if (!(await isPermissionGranted())) return;
		if (!getLogin()) return;
		if (!getAppStore().settings.notifications.enabled) return;

		// if we're currently viewing the channel, don't send a notification for it
		if (notif.channel && window.location.href.includes(notif.channel)) return;

		sendNotification({
			title: notif.title,
			largeBody: notif.body,
			channelId: "messages",
		});
	});
};

// TODO: this is throwing because the command list-channels doesn't exist?
// export const createNotificationChannels = async () => {
// 	const existing = await getChannels();

// 	if (existing.find((x) => x.id === "messages")) return;

// 	await createChannel({
// 		id: "messages",
// 		name: "Messages",
// 		importance: Importance.High,
// 		vibration: true,
// 		visibility: Visibility.Private,
// 	});
// };
