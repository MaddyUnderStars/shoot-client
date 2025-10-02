// This file is included in the generated service worker

import type { ActorMention } from "../lib/client/common/actor";

declare var self: ServiceWorkerGlobalScope;

/**
 * https://github.com/MaddyUnderStars/shoot/blob/main/src/push/worker.ts#L23
 */
type PushNotificationData = {
	title: string;
	body: string;
	sent: number; // timestamp of when notification sent
	image?: string; // url of image to display

	channel?: ActorMention;
	author?: ActorMention;
};

self.addEventListener("push", (event) => {
	if (!event.data) return;

	const data = event.data.json() as PushNotificationData;

	const promise = self.registration.showNotification(data.title, {
		requireInteraction: true,
		body: data.body,
		icon: data.image,

		//@ts-expect-error https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerRegistration/showNotification#timestamp
		timestamp: data.sent,

		data: {
			channel: data.channel,
			author: data.author,
		},
	});

	event.waitUntil(promise);
});

self.addEventListener("notificationclick", (event) => {
	const notif = event.notification;
	const messageUrl = notif.data.guild
		? `/${notif.data.guild}/${notif.data.channel}/${notif.data.message}`
		: `/channels/@me`; // TODO

	event.waitUntil(
		self.clients
			.matchAll({
				type: "window",
			})
			.then((clientList) => {
				const focused = clientList.find((x) => x.focused);
				if (focused) {
					// if there is a focused window, navigate to the message there

					return focused.navigate(messageUrl);
				}

				// otherwise, open a new window with the message
				return self.clients.openWindow(messageUrl);
			})
			.then(() => notif.close()),
	);
});
