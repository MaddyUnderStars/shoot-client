import type { ActorMention } from "../client/common/actor";

export const getSupportedPush = () => {
	if ("PushManager" in window && "serviceWorker" in navigator) return "web";
	if (import.meta.env.VITE_IS_MOBILE_TAURI) return "unifiedpush";
	return null;
};

/**
 * https://github.com/MaddyUnderStars/shoot/blob/main/src/push/worker.ts#L23
 */
export type PushNotificationData = {
	title: string;
	body: string;
	sent: number; // timestamp of when notification sent
	image?: string; // url of image to display

	channel?: ActorMention;
	author?: ActorMention;
};
