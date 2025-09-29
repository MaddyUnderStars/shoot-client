/// <reference types="vitest" />

import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react-swc";
import { buildSync } from "esbuild";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
	base: process.env.BASE_PATH ?? undefined,
	plugins: [
		tanstackRouter({
			target: "react",
			autoCodeSplitting: true,
		}),
		react({
			tsDecorators: true,
		}),
		tailwindcss(),
		VitePWA({
			workbox: {
				importScripts: ["./serviceWorker.js"],
			},
			manifest: {
				name: "Shoot Client",
				short_name: "Shoot",
				theme_color: "#6d6beb",
				background_color: "#17171b",
				icons: [
					{
						src: "512.png",
						type: "image/png",
						sizes: "512x512",
					},
					{
						src: "192.png",
						type: "image/png",
						sizes: "192x192",
					},
				],
				display: "standalone",
				prefer_related_applications: false,
			},
		}),
		{
			name: "compile-workers",
			apply: "build",
			enforce: "post",
			transformIndexHtml: {
				handler: () => {
					buildSync({
						minify: true,
						bundle: true,
						entryPoints: [path.join(process.cwd(), "src/workers/serviceWorker.js")],
						outfile: path.join(process.cwd(), "dist", "serviceWorker.js"),
					});
				},
			},
		},
	],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
	test: {
		globals: true,
		environment: "jsdom",
	},
});
