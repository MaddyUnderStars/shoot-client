import {
	getUnifiedPushDistributor,
	saveUnifiedPushDistributor,
	unregisterFromUnifiedPush,
} from "@sableclient/tauri-plugin-notifications-api";
import { createFileRoute } from "@tanstack/react-router";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { SettingsHeader } from "@/components/settings-header";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { usePermission } from "@/hooks/use-notifications";
import { getSupportedPush } from "@/lib/notifications/index";
import { getDistributors, subscribeUnifiedPush } from "@/lib/notifications/unifiedpush";
import { subscribeWebPush } from "@/lib/notifications/webpush";
import { getAppStore } from "@/lib/store/app-store";

export const Route = createFileRoute("/_authenticated/settings/app/notifications")({
	component: RouteComponent,
});

function RouteComponent() {
	const supported = getSupportedPush();

	return (
		<>
			<SettingsHeader>Notifications</SettingsHeader>

			<div className="p-4">
				{supported === "web" ? (
					<WebNotificationSettings />
				) : supported === "unifiedpush" ? (
					<UnifiedPushSettings />
				) : (
					<p>Sorry, push notifications are not supported on this device.</p>
				)}
			</div>
		</>
	);
}

const UnifiedPushSettings = observer(() => {
	const settings = getAppStore().settings;

	const [distributors, setDistributors] = useState<string[]>([]);
	const [defaultDistributor, setDefaultDistributors] = useState<string>();

	useEffect(() => {
		void (async () => {
			setDistributors((await getDistributors()).distributors);
			setDefaultDistributors((await getUnifiedPushDistributor()).distributor);
		})();
	}, []);

	const changeDistributor = async (value: string) => {
		setDefaultDistributors(value);
		await saveUnifiedPushDistributor(value);
	};

	const toggleSubscription = async () => {
		if (!settings.notifications.enabled) await subscribeUnifiedPush();
		else {
			await unregisterFromUnifiedPush();
			settings.notifications.enabled = false;
		}
	};

	if (!distributors || !defaultDistributor) {
		<div>
			<h2>UnifiedPush</h2>

			<p>Loading distributors</p>
		</div>;
	}

	return (
		<div>
			<h2 className="mb-4">UnifiedPush</h2>

			<div className="mb-4">
				<Label className="mb-2">Distributor</Label>
				<Select onValueChange={changeDistributor}>
					<SelectTrigger>
						<SelectValue placeholder={defaultDistributor} />
					</SelectTrigger>

					<SelectContent>
						<SelectGroup>
							<SelectLabel>Installed Distributors</SelectLabel>
							{distributors.map((name) => (
								<SelectItem key={name} value={name}>
									{name}
								</SelectItem>
							))}
						</SelectGroup>
					</SelectContent>
				</Select>
			</div>

			<Button onClick={toggleSubscription}>
				{settings.notifications.enabled ? "Disable" : "Enable"} notifications
			</Button>
		</div>
	);
});

const WebNotificationSettings = observer(() => {
	const notificationsGranted = usePermission("notifications");
	const settings = getAppStore();

	return (
		<div>
			{notificationsGranted && settings.settings.notifications ? (
				<Button disabled>Permission granted!</Button>
			) : (
				<Button onClick={subscribeWebPush}>Grant notification permission</Button>
			)}
		</div>
	);
});
