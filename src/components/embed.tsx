import type { ApiPublicEmbed } from "@/lib/http/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";

export const EmbedComponent = ({ embed }: { embed: ApiPublicEmbed }) => {
	if (embed.provider?.url === "https://www.youtube.com") return <YoutubeEmbed embed={embed} />;
	if (embed.type === 1) return <SimpleEmbedComponent embed={embed} />;

	return (
		<Card className="max-w-100 min-w-80 w-full gap-1 rounded-sm p-3">
			<CardHeader className="p-0">
				<CardTitle>
					<LinkOr url={embed.target}>
						<span>{embed.title}</span>
					</LinkOr>
				</CardTitle>
				<CardDescription>
					<span>{embed.description}</span>
				</CardDescription>
			</CardHeader>
			<CardContent className="p-0 max-h-100">
				{embed.images.map((img) => (
					<img
						className="rounded-sm"
						src={img.url}
						width={img.width ?? 400}
						height={img.height ?? 400}
						alt={img.alt}
						key={img.url}
					/>
				))}

				{embed.videos.map((video) => (
					// biome-ignore lint/a11y/useMediaCaption: not possible
					<video
						src={video.url}
						width={video.width ?? 400}
						height={video.height ?? 400}
						key={video.url}
					/>
				))}
			</CardContent>
			<CardFooter className="justify-between p-0">
				{/** biome-ignore lint/a11y/useAltText: no */}
				<img src={embed.footer?.icon} />
				<span>{embed.footer?.text}</span>
			</CardFooter>
		</Card>
	);
};

const SimpleEmbedComponent = ({ embed }: { embed: ApiPublicEmbed }) => {
	return (
		<div className="max-w-100 max-h-100">
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

	if (!videoId) return null;

	return (
		<Card className="w-100 gap-1 rounded-sm p-3" style={{ width: "560px", height: "320px" }}>
			<CardContent className="p-0 w-full h-full">
				<iframe
					src={`https://youtube.com/embed/${videoId}`}
					title={embed.title ?? "Youtube video"}
					height="100%"
					width="100%"
					frameBorder={0}
					allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen"
				/>
			</CardContent>
		</Card>
	);
};
