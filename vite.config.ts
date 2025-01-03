import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore node global
const BASE_PATH = process.env.BASE_PATH;

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react({ tsDecorators: true })],
    base: BASE_PATH ?? undefined
});
