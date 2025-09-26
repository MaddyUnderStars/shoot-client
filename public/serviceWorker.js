/// <reference lib="webworker" />
// This file is included in the generated service worker

self.addEventListener("push", (event) => {
	if (!event.data) return;

	const data = event.data.json();

	const promise = self.registration.showNotification(
		data.title,
		{
			requireInteraction: true,
			body: data.body,
			image: data.image,
			icon: null,
			badge: null,
			timestamp: data.sent,
		}
	);

	event.waitUntil(promise);
});
