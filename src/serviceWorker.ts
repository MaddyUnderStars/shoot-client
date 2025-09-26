/// <reference lib="webworker" />
// This file is included in the generated service worker

(self as unknown as ServiceWorkerGlobalScope).addEventListener("push", (event) => {
	if (!event.data) return;

	const promise = (self as unknown as ServiceWorkerGlobalScope).registration.showNotification(
		event.data?.text(),
	);

	event.waitUntil(promise);
});
