import type { ApiPublicEmbed } from "@/lib/http/types";
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "./ui/card";
import { PublicEmbedType } from "@/lib/http/generated/v1";
import { useState } from "react";
import { Button } from "./ui/button";

export const EmbedComponent = ({ embed }: { embed: ApiPublicEmbed }) => {
	if (
		embed.provider?.url === "https://www.youtube.com" &&
		embed.target.match(YOUTUBE_VIDEO_ID_REGEX)
	)
		return <YoutubeEmbed embed={embed} />;
	if (embed.type === PublicEmbedType.photo) return <SimpleEmbedComponent embed={embed} />;

	return (
		<Card className="sm:max-w-md flex-1 gap-1 rounded-sm p-3">
			<CardHeader className="p-0">
				<CardTitle>
					<LinkOr url={embed.target}>
						<span>{embed.title}</span>
					</LinkOr>
				</CardTitle>
				<CardAction>
					{embed.thumbnail ? (
						<img
							className="rounded-sm max-h-10 max-w-10"
							src={embed.thumbnail.url}
							width={embed.thumbnail.width ?? 100}
							height={embed.thumbnail.height ?? 100}
							alt={embed.thumbnail.alt}
						/>
					) : null}
				</CardAction>
				<CardDescription>
					<span>{embed.description}</span>
				</CardDescription>
			</CardHeader>
			<CardContent className="p-0 flex max-h-100">
				{embed.images.map((img, i) => (
					<img
						className="rounded-sm object-contain"
						src={img.url}
						width={img.width ?? 400}
						height={img.height ?? 400}
						alt={img.alt}
						key={`${img.url}-${i}`}
					/>
				))}

				{embed.videos.map((video) => (
					<video
						src={video.url}
						width={video.width ?? 400}
						height={video.height ?? 400}
						key={video.url}
					/>
				))}
			</CardContent>
			<CardFooter className="flex gap-1 p-0 text-sm font-thin">
				{embed.footer ? (
					<div>
						<img src={embed.footer?.icon} />
						<span>{embed.footer?.text}</span>
					</div>
				) : null}

				{embed.provider ? (
					<LinkOr url={embed.provider.url}>{embed.provider.name}</LinkOr>
				) : null}
			</CardFooter>
		</Card>
	);
};

const SimpleEmbedComponent = ({ embed }: { embed: ApiPublicEmbed }) => {
	return (
		<div className="sm:max-w-md flex-1 max-h-100">
			{embed.images.map((img) => (
				<img
					src={img.url}
					width={img.width ?? 400}
					height={img.height ?? 400}
					alt={img.alt ?? "Embedded image"}
					key={img.url}
				/>
			))}
		</div>
	);
};

// render an anchor or it's children if no link provided
const LinkOr = ({ url, children }: { url?: string; children: React.ReactNode }) => {
	if (!url) return children;

	return (
		<a href={url} target="_blank" referrerPolicy="no-referrer">
			{children}
		</a>
	);
};
const YOUTUBE_VIDEO_ID_REGEX =
	/(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/gi;

const YoutubeEmbed = ({ embed }: { embed: ApiPublicEmbed }) => {
	const videoId = [...embed.target.matchAll(YOUTUBE_VIDEO_ID_REGEX)]?.[0]?.[1];
	const [open, setOpen] = useState(false);

	const loadPlayer = () => setOpen(true);

	if (!videoId) return null;

	if (!open) {
		return (
			<Card className="rounded-sm p-3 h-80 sm:max-w-md flex-1">
				<CardContent className="p-0 w-full h-full relative">
					{embed.thumbnail ? (
						<img
							style={{ filter: "brightness(10%)" }}
							src={embed.thumbnail.url}
							alt={embed.thumbnail.alt}
							width={embed.thumbnail.width}
							height={embed.thumbnail.height}
						/>
					) : null}

					<div className="absolute top-0 left-0 w-full h-full flex flex-col gap-3 items-center justify-center">
						{embed.title !== " - YouTube" ? (
							<h1 className="text-lg">{embed.title}</h1>
						) : null}

						<Button onClick={loadPlayer}>Load Player</Button>
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card className="gap-1 rounded-sm p-3 h-80 sm:w-md w-full">
			<CardContent className="p-0 w-full h-full">
				<iframe
					src={`https://youtube.com/embed/${videoId}`}
					title={embed.title ?? "Youtube video"}
					height="100%"
					width="100%"
					frameBorder={0}
					referrerPolicy="strict-origin-when-cross-origin"
					allowFullScreen
					allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen"
				/>
			</CardContent>
		</Card>
	);
};
