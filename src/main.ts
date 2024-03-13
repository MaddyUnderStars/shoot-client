import "./app.css";
import App from './App.svelte';
import { initClient } from "./lib/client";

initClient();

const app = new App({
  target: document.getElementById('app')!,
})

export default app
