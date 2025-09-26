import { createFileRoute } from "@tanstack/react-router";
import { observer } from "mobx-react-lite";
import { SettingsHeader } from "@/components/settings-header";
import { Button } from "@/components/ui/button";
import { usePermission } from "@/hooks/use-notifications";
import { subscribeNotifications } from "@/lib/notifications";

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

const NotificationSettings = observer(() => {
	const notificationsGranted = usePermission("notifications");

	return (
		<div>
			{notificationsGranted ? (
				<Button disabled>Permission granted!</Button>
			) : (
				<Button onClick={subscribeNotifications}>Grant notification permission</Button>
			)}
		</div>
	);
});
