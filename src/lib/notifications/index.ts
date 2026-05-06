export const getSupportedPush = () => {
	if ("PushManager" in window && "serviceWorker" in navigator) return "web";
	if (import.meta.env.VITE_IS_MOBILE_TAURI) return "unifiedpush";
	return null;
};
