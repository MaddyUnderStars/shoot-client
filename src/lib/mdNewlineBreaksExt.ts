/**
 * https://github.com/markedjs/marked/issues/3466#issuecomment-2378235513
 */

import { type MarkedExtension, type TokenizerAndRendererExtension } from "marked";

const newlineBreaksExtension: TokenizerAndRendererExtension = {
	name: "newlineBreaks",
	start(src) {
		return src.indexOf("\n");
	},
	tokenizer(src) {
		const match = src.match(/^\n+/);
		if (match) {
			return {
				type: "newlineBreaks",
				raw: match[0],
				text: match[0],
			};
		}

		return undefined;
	},
	renderer(token) {
		return token.text.replace(/\n/g, "<br>\n");
	},
};

export const newlineBreaks: MarkedExtension = {
	extensions: [
		{
			...newlineBreaksExtension,
			level: "block",
		},
		{
			...newlineBreaksExtension,
			level: "inline",
		},
	],
};
