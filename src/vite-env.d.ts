/// <reference types="vite/client" />

interface ViteTypeOptions {
	strictImportMetaEnv: unknown;
}

interface ImportMetaEnv {
	readonly VITE_DEFAULT_INSTANCE: string;
	readonly VITE_LOCK_INSTANCE?: string;
	readonly VITE_USE_HASH_ROUTER?: string;
	readonly VITE_PUSH_PK?: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
