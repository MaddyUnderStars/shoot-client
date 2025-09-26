/// <reference types="vitest" />

import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react-swc";
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
				importScripts: ["./serviceWorker.ts"],
			},
			manifest: {
				name: "Shoot",
				theme_color: "#6d6beb",
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
				start_url: "./",
				display: "standalone",
				prefer_related_applications: false,
			},
		}),
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
