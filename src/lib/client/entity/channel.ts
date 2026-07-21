import { v7 as uuidv7 } from "uuid";
import { getHttpClient } from "@/lib/http/client";
import type { ApiPublicChannel } from "@/lib/http/types";
import { Actor } from "./actor";
import { uploadFiles } from "@/lib/http/upload";

type MessageSendOptions =
	| string
	| {
			content?: string;
			files?: File[];
	  };

export class Channel extends Actor implements ApiPublicChannel {
	public sendMessage = async (opts: MessageSendOptions) => {
		const { $fetch } = getHttpClient();

		const nonce = uuidv7();

		const normalised = {
			nonce,

			content: typeof opts === "string" ? opts : opts.content,
			files:
				typeof opts === "string"
					? []
					: opts.files?.length
						? await uploadFiles(opts.files, this)
						: [],
		};

		const { data, error } = await $fetch.POST("/channel/{channel_id}/messages/", {
			body: normalised,
			params: {
				path: {
					channel_id: this.mention,
				},
			},
		});

		if (error) throw new Error(error.message);

		return data;
	};
}
