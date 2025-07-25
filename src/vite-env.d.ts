/// <reference types="vite/client" />

interface ViteTypeOptions {
	strictImportMetaEnv: unknown;
}

interface ImportMetaEnv {
	readonly VITE_DEFAULT_INSTANCE: string;
	readonly VITE_LOCK_INSTANCE?: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
