import type { ApiPublicEmbed } from "@/lib/http/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";

export const EmbedComponent = ({ embed }: { embed: ApiPublicEmbed }) => {
	return (
		<Card>
			<CardHeader>
				<CardTitle>
					<LinkOr url={embed.target}>
						<span>{embed.title}</span>
					</LinkOr>
				</CardTitle>
				<CardDescription>
					<LinkOr url={embed.author_url}>
						<span>{embed.author_name}</span>
					</LinkOr>
				</CardDescription>
			</CardHeader>
			<CardContent>
				{embed.thumbnail_url ? (
					<img
						alt="embed thumbnail"
						src={embed.thumbnail_url}
						height={200}
						width={200}
					></img>
				) : null}
			</CardContent>
			<CardFooter className="justify-between">
				<LinkOr url={embed.provider_url}>
					<span>{embed.provider_name}</span>
				</LinkOr>
			</CardFooter>
		</Card>
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
