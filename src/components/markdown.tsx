/**
 * Adapted from https://github.com/spacebarchat/client/blob/761581df24e14b015b259fb73957cc7176b4f5a3/src/components/markdown/MarkdownRenderer.tsx#L4
 * Spacebar Client AGLP-3.0-only 2025
 */

import { Marked } from "marked";
import MarkedComponent, { type ReactRenderer } from "marked-react";
import React from "react";
import reactStringReplace from "react-string-replace";
import { Mention } from "./mention";

const USER_MENTION_REGEX =
	/@(\w+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)*)/i;

const URL_REGEX =
	/(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gim;

const marked = new Marked({
	walkTokens(token) {
		console.log(token);
	},
});

export const MarkdownRenderer = React.memo(({ content }: { content: string }) => {
	const sanitisedContent = React.useMemo(() => sanitise(content), [content]);

	return (
		<MarkedComponent gfm={false} openLinksInNewTab renderer={MarkedRenderer} instance={marked}>
			{sanitisedContent}
		</MarkedComponent>
	);
});

const sanitise = (content: string) =>
	// Append empty character if string starts with html tag
	// This is to avoid inconsistencies in rendering Markdown inside/after HTML tags
	// https://github.com/revoltchat/revite/issues/733
	content.replaceAll(/^(<\/?[a-zA-Z0-9]+>)(.*$)/gm, (match) => `\u200E${match}`);

const MarkedRenderer: Partial<ReactRenderer> = {
	link: (href, text) => {
		return (
			<a
				className="text-link underline"
				href={href}
				target="_blank"
				referrerPolicy="no-referrer"
			>
				{text}
			</a>
		);
	},
	listItem: (children) => <li className="list-disc">{children}</li>,
	heading: (children, level) => <h1 className="text-2xl">{children}</h1>,
	code: (code, lang) => <pre className="bg-secondary w-full">{code}</pre>,
	codespan: (code, lang) => <pre className="inline p-0.5 bg-secondary">{code}</pre>,
	paragraph: (children) => <>{children}</>,
	text: (text: string) => {
		let ret: string | React.ReactNode[] = text;

		ret = reactStringReplace(ret, URL_REGEX, (match, i) => (
			<a
				className="text-link underline"
				href={match}
				target="_blank"
				referrerPolicy="no-referrer"
			>
				{match}
			</a>
		));

		ret = reactStringReplace(ret, USER_MENTION_REGEX, (match, i) => {
			return <Mention key={`user-${i}`} user={match} />;
		});

		return ret;
	},
};
