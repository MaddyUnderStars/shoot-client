<script>
	import { Router, Link, Route } from "svelte-routing";
	import Login from "./Login.svelte";
	import Home from "./Home.svelte";
	import { getLogin } from "./lib/util";
	import { ready } from "./lib/client";

	const loggedIn = !!getLogin();

	export let url = loggedIn ? "/@me" : "/login";
</script>

{#if !ready && loggedIn}
	<div class="connecting">Connecting</div>
{:else}
	<Router {url}>
		<Route path="/@me" component={Home} />
		<Route path="/channel/:channel_id" component={Home} />
		<Route path="/login" component={Login} />
	</Router>
{/if}

<style>
	.connecting {
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: rgb(10, 10, 10);
		width: 100vw;
		height: 100vh;
		color: white;
		font-size: 2rem;
	}
</style>