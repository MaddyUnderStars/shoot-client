/**
 * Adapted from https://github.com/spacebarchat/client/blob/761581df24e14b015b259fb73957cc7176b4f5a3/src/components/markdown/MarkdownRenderer.tsx#L4
 * Spacebar Client AGLP-3.0-only 2025
 */

import { Marked } from "marked";
import MarkedComponent, { type ReactRenderer } from "marked-react";
import React from "react";
import reactStringReplace from "react-string-replace";
import type { ActorMention } from "@/lib/client/common/actor";
import { Mention } from "../chat/mention";
import { newlineBreaks } from "@/lib/mdNewlineBreaksExt";
import { Anchor } from "./anchor";

const USER_MENTION_REGEX =
	/@(\w+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)*)/i;

const URL_REGEX =
	/(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gim;

const marked = new Marked().use(newlineBreaks);

export const MarkdownRenderer = ({ content }: { content: string }) => {
	const sanitisedContent = React.useMemo(() => sanitise(content), [content]);

	return (
		<div className="break-all whitespace-pre-wrap flex-1">
			<MarkedComponent
				gfm={false}
				openLinksInNewTab
				renderer={MarkedRenderer}
				instance={marked}
			>
				{sanitisedContent}
			</MarkedComponent>
		</div>
	);
};

const sanitise = (content: string) => {
	// Append empty character if string starts with html tag
	// This is to avoid inconsistencies in rendering Markdown inside/after HTML tags
	// https://github.com/revoltchat/revite/issues/733
	content = content.replaceAll(/^(<\/?[a-zA-Z0-9]+>)(.*$)/gm, (match) => `\u200E${match}`);

	return content;
};

const HEADING_LEVELS = {
	1: "text-5xl",
	2: "text-4xl",
	3: "text-3xl",
	4: "text-2xl",
	5: "text-lg",
	6: "text",
};

const MarkedRenderer: Partial<ReactRenderer> = {
	link(href, text) {
		return (
			<Anchor
				className="text-link underline"
				href={href}
				target="_blank"
				referrerPolicy="no-referrer"
				key={this.elementId}
			>
				{text}
			</Anchor>
		);
	},
	listItem(children) {
		return (
			<li key={this.elementId} className="list-disc ms-4">
				{children}
			</li>
		);
	},
	heading(children, level) {
		return (
			<h1 key={this.elementId} className={HEADING_LEVELS[level]}>
				{children}
			</h1>
		);
	},
	code(code) {
		return (
			<pre key={this.elementId} className="bg-secondary w-full p-2 my-1 rounded border">
				{code}
			</pre>
		);
	},
	codespan(code) {
		return (
			<pre key={this.elementId} className="inline p-0.5 bg-secondary">
				{code}
			</pre>
		);
	},
	blockquote(children) {
		return (
			<blockquote key={this.elementId} className="bg-secondary border-l-2 ps-2 w-full">
				{children}
			</blockquote>
		);
	},
	paragraph(children) {
		return <React.Fragment key={this.elementId}>{children}</React.Fragment>;
	},
	text(text: string) {
		let ret: string | React.ReactNode[] = text;

		ret = reactStringReplace(ret, URL_REGEX, (match, i) => (
			<a
				className="text-link underline"
				href={match}
				target="_blank"
				referrerPolicy="no-referrer"
				key={`${this.elementId}-${i}`}
			>
				{match}
			</a>
		));

		ret = reactStringReplace(ret, USER_MENTION_REGEX, (match, i) => {
			// oxlint-disable-next-line typescript/no-unsafe-type-assertion
			return <Mention key={`user-${i}-${this.elementId}`} user={match as ActorMention} />;
		});

		return ret;
	},
};
