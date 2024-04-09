import "./app.css";
import App from './App.svelte';
import { login } from "./lib/client";
import { getLogin } from "./lib/util";

const auth = getLogin();

if (auth) {
	login(auth);
	console.log('yes')
}

const app = new App({
  target: document.getElementById('app')!,
})

export default app
