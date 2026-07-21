// This file is included in the generated service worker
import type { PushNotificationData } from "../lib/notifications/index";

declare var self: ServiceWorkerGlobalScope;

self.addEventListener("push", (event) => {
	if (!event.data) return;

	// oxlint-disable-next-line typescript/no-unsafe-type-assertion
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
		: `/channels/${notif.data.channel}`; // TODO

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
