/// <reference lib="webworker" />
// This file is included in the generated service worker

self.addEventListener("push", (event) => {
	if (!event.data) return;

	const promise = self.registration.showNotification(
		event.data?.text(),
	);

	event.waitUntil(promise);
});
