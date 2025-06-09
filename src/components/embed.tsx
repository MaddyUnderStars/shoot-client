import type { EmbedSchema } from "../lib/entities/message";

export const MessageUrlEmbed = ({ embed }: { embed: EmbedSchema }) => {
	let body: JSX.Element | null;

	switch (embed.type) {
		case "photo":
			body = <image href={embed.thumbnail_url} />;
			break;
		case "rich":
			body = (
				<iframe
					title={embed.title ?? embed.target}
					srcDoc={embed.html}
				/>
			);
			break;
		case "video":
			body = (
				<iframe
					width={embed.width}
					height={embed.height}
					title={embed.title ?? embed.target}
					srcDoc={embed.html}
				/>
			);
			break;
		default:
			body = null;
			break;
	}

	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				padding: "5px",
			}}
		>
			<a href={embed.target} target="_blank" rel="noreferrer">
				{embed.title}
			</a>

			{body}
		</div>
	);
};
