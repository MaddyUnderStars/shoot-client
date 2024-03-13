/** @type {import('vite').UserConfig} */

import { svelte } from "@sveltejs/vite-plugin-svelte";
import { defineConfig } from "vite";
import commonjs from "vite-plugin-commonjs";

import Icons from "unplugin-icons/vite";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [svelte(), commonjs(), Icons({ compiler: "svelte" })],
});
