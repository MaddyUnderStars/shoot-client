<script lang="ts">
	import { REST } from "shoot.ts";
	import { getFormData } from "./lib/util";
	import { loginPw } from "./lib/client";
	import { navigate } from "svelte-routing";

	type LoginFormData = {
		instance: string;
		username: string;
		password: string;
	}

	const login = async (ret: SubmitEvent) => {
		const input = getFormData<LoginFormData>(ret.target as HTMLFormElement);

		const client = await loginPw(input);

		navigate("/@me", { replace: true });
	}

	if (!!window.localStorage.getItem("token"))
		navigate("/@me", { replace: true })
</script>

<div class="container">
	<div class="modal">
		<h1>Shoot</h1>

		<form on:submit|preventDefault={login}>
			<label for="instance">Instance</label>
			<input id="instance" name="instance" type="text" />

			<label for="username">Username</label>
			<input id="username" name="username" type="text" />

			<label for="password">Password</label>
			<input name="password" id="password" type="password" />

			<input type="submit" value="Login" />
		</form>
	</div>
</div>

<style>
	.container {
		display: flex;
		justify-content: center;
		align-items: center;

		height: 100vh;

		background-color: rgb(10, 10, 10);
	}

	.modal {
		background-color: rgb(15, 15, 15);
		color: rgb(230, 230, 230);
		padding: 20px 100px 20px 100px;
	}

	.modal h1 {
		text-align: center;
		margin-bottom: 20px;
	}

	.modal form {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	input {
		background-color: transparent;
		border: 1px solid rgb(230, 230, 230);
		padding: 10px 10px 10px 10px;
		color: white;
	}
</style>
