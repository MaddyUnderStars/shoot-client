/// <reference types="vitest/config" />

import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import { build } from "rolldown";
import { playwright } from "@vitest/browser-playwright";

// https://vite.dev/config/
export default defineConfig({
	base: process.env.BASE_PATH ?? undefined,
	plugins: [
		tanstackRouter({
			target: "react",
			autoCodeSplitting: true,
		}),
		react(),
		babel({ presets: [reactCompilerPreset()] }),
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
				handler: async () => {
					await build({
						input: [path.join(process.cwd(), "src/workers/serviceWorker.js")],
						output: {
							file: path.join(process.cwd(), "dist", "serviceWorker.js"),
							minify: true,
						},
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
		browser: {
			enabled: true,
			provider: playwright(),
			headless: true,
			instances: [{ browser: "chromium" }, { browser: "firefox" }],
		},
	},
});
