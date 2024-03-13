<script lang="ts">
	import { channels, user, client } from "./lib/client";

	import GameIconsFastArrow from "~icons/game-icons/fast-arrow";

	import FluentChannel16Regular from "~icons/fluent/channel-16-regular";
	import { Link } from "svelte-routing";
	import type { Channel } from "shoot.ts/dist/lib/channel";

	export let channel_id: string = "@me";

	let channel: Channel | undefined = undefined;
	$: {
		channel = client?.channels.get(channel_id);
	}

	let sendContent: string;
</script>

<div class="container">
	<div class="left">
		<div class="sidebar">
			<div class="guildList">
				<div class="guild">
					<Link to="/@me">
						<GameIconsFastArrow />
					</Link>
				</div>

				{#each { length: 10 } as i, i}
					<div class="guild">{i + 1}</div>
				{/each}
			</div>

			<div class="channelList">
				{#each $channels as [id, channel], id}
					<div class="channel">
						<Link to="/channel/{channel.mention}"
							>{channel.name}</Link
						>

						<FluentChannel16Regular />

						<div class="tooltip">{channel.mention}</div>
					</div>
				{/each}
			</div>
		</div>

		<div class="user">
			<span class="user-name">{$user.display_name}</span>
			<span class="user-domain">@{$user.domain}</span>
		</div>
	</div>

	<div class="chat">
		<div>
			<div class="header">
				{channel_id}
			</div>

			<div class="messages">
				{#if channel}
					{#await channel.getMessages({})}
						<div>loading</div>
					{:then messages}
						{#each messages as [id, message]}
							<div class="message">
								<div class="author">
									{message.author_id}
								</div>

								<div class="content">
									{message.content}
								</div>
							</div>
						{/each}
					{:catch e}
						<div>{e}</div>
					{/await}
				{:else}
					<div>Nothing to see here</div>
				{/if}
			</div>
		</div>

		{#if channel}
			<form
				class="box"
				on:submit|preventDefault={(ev) => {
					channel?.send(sendContent);
					ev.currentTarget.reset();
				}}
			>
				<input bind:value={sendContent} type="text" />
			</form>
		{/if}
	</div>

	<div class="right">
		<div class="members">members</div>
	</div>
</div>

<style>
	.message {
		display: flex;
		flex-direction: column;

		margin-bottom: 15px;
	}

	.header {
		padding: 20px;
		background-color: rgb(20, 20, 20);
	}

	.messages {
		padding: 20px;
	}

	.chat {
		display: flex;
		flex-direction: column;
		justify-content: space-between;

		flex: 1;
	}

	.chat .box input {
		width: 100%;
		border: none;
		background-color: rgb(20, 20, 20);
		padding: 20px;
		color: white;
	}

	.container {
		background-color: rgb(10, 10, 10);
		color: rgb(230, 230, 230);

		display: flex;

		height: 100vh;
		width: 100vw;
	}

	.channelList {
		flex: 1;
	}

	.channel {
		margin: 5px 0 5px 0;
		padding: 5px;
		background-color: rgb(10, 10, 10);
		border-radius: 5px;

		display: flex;
		justify-content: space-between;
	}

	.channel .tooltip {
		visibility: hidden;
		position: absolute;
		z-index: 1;

		background-color: rgb(10, 10, 10);

		left: 300px;

		border: 2px solid white;
		padding: 5px;
	}

	.channel:hover .tooltip {
		visibility: visible;
	}

	.guild {
		background-color: rgb(10, 10, 10);
		margin-bottom: 10px;
		display: flex;
		justify-content: center;
		align-items: center;
		text-align: center;
		width: 50px;
		height: 50px;
		font-size: 2rem;
		white-space: nowrap;
		overflow: hidden;
		border-radius: 20px;

		transition: border-radius 0.25s ease-in-out;
	}

	.guild:hover {
		border-radius: 10px;
	}

	.sidebar {
		display: flex;
		gap: 20px;

		flex: 1;
	}

	.user {
		display: flex;
		font-weight: bold;
	}

	.user-domain {
		color: rgb(150, 150, 150);
	}

	.left {
		display: flex;
		flex-direction: column;
		justify-content: space-between;

		background-color: rgb(20, 20, 20);

		padding: 20px;
	}

	.right {
		width: 250px;
		text-align: center;
		padding: 20px 20px 0 0;
	}
</style>
