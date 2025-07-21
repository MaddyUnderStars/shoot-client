import z from "zod";

export const ActorMentionRegex = /^.*@.*$/;

export const ActorMention = z.custom<`${string}@${string}`>(
	(val) => typeof val === "string" && val.match(ActorMentionRegex),
	{
		message: "Invalid mention",
	},
);

export type ActorMention = z.infer<typeof ActorMention>;

export const isActorMention = (str: string): str is ActorMention =>
	!!str.match(ActorMentionRegex);
