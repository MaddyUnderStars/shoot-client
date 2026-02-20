/// <reference types="vite/client" />

interface ViteTypeOptions {
	strictImportMetaEnv: unknown;
}

interface ImportMetaEnv {
	/** Default instance to show in login/register */
	readonly VITE_DEFAULT_INSTANCE: string;

	/** Whether to disallow changing from the default instance */
	readonly VITE_LOCK_INSTANCE?: string;

	/** Whether to use hash based location router for e.g. github pages */
	readonly VITE_USE_HASH_ROUTER?: string;

	/** Whether we're building for mobile tauri */
	readonly VITE_IS_MOBILE_TAURI?: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
