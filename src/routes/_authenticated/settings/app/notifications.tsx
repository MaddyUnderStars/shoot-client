import { createFileRoute } from "@tanstack/react-router";
import { SettingsHeader } from "@/components/settings-header";
import { Button } from "@/components/ui/button";
import { usePermission } from "@/hooks/use-notifications";
import { getLogin } from "@/lib/storage";

export const Route = createFileRoute("/_authenticated/settings/app/notifications")({
	component: RouteComponent,
});

function RouteComponent() {
	const pushSupported = "PushManager" in window && "serviceWorker" in navigator;

	return (
		<>
			<SettingsHeader>Notifications</SettingsHeader>

			<div className="p-4">
				{pushSupported ? (
					<NotificationSettings />
				) : (
					<p>Sorry, push notifications are not supported on this device.</p>
				)}
			</div>
		</>
	);
}

const NotificationSettings = () => {
	const notificationsGranted = usePermission("notifications");

	const subscribe = async () => {
		await requestPermission();

		const worker = await navigator.serviceWorker.getRegistration();

		if (!worker) return;

		const applicationServerKey = await getPublicKey();

		worker.pushManager.subscribe({
			applicationServerKey,
			userVisibleOnly: true,
		});
	};

	return (
		<div>
			{notificationsGranted ? (
				<Button disabled>Permission granted!</Button>
			) : (
				<Button onClick={subscribe}>Grant notification permission</Button>
			)}
		</div>
	);
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
	new Promise((resolve, reject) => {
		const res = Notification.requestPermission((perm) => resolve(perm));

		if (res) res.then(resolve, reject);
	});
