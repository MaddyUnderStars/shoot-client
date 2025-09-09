import { getFileDimensions, getFileMd5 } from "@/lib/file";
import { getHttpClient } from "@/lib/http/client";
import type { paths } from "@/lib/http/generated/v1";
import type { ApiPublicChannel } from "@/lib/http/types";
import { Actor } from "./actor";

type AttachmentSchema = Exclude<
	paths["/channel/{channel_id}/attachments/"]["post"]["requestBody"],
	undefined
>["content"]["application/json"][0];

type MessageSendOptions =
	| string
	| {
			content?: string;
			files?: File[];
	  };

export class Channel extends Actor implements ApiPublicChannel {
	public sendMessage = async (opts: MessageSendOptions) => {
		const { $fetch } = getHttpClient();

		const normalised = {
			content: typeof opts === "string" ? opts : opts.content,
			files:
				typeof opts === "string"
					? []
					: opts.files?.length
						? await this.uploadAttachments(opts.files)
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

	private uploadAttachments = async (files: File[]) => {
		const { $fetch } = getHttpClient();

		const filesMeta: Array<
			AttachmentSchema & {
				file: File;
			}
		> = await Promise.all(
			files.map(async (file, i) => ({
				id: `${i}`,
				name: file.name,
				size: file.size,
				mime: file.type,
				md5: await getFileMd5(file),

				...(await getFileDimensions(file)),

				file,
			})),
		);

		const { data, error } = await $fetch.POST("/channel/{channel_id}/attachments/", {
			body: filesMeta.map((x) => ({
				...x,
				file: undefined,
			})),
			params: {
				path: {
					channel_id: this.mention,
				},
			},
		});

		if (error) throw new Error(error.message);

		const ret: {
			name: string;
			hash: string;
		}[] = [];

		// now, find the original attachment metadata
		// and upload the associated file to returned endpoint
		for (const signed of data) {
			const file = filesMeta.find((x) => x.id === signed.id);
			if (!file) throw new Error("server gave us ID for attachment we didn't send?");

			const headers = {
				"Content-Type": file.mime,
				"Content-MD5": file.md5,
			};

			await fetch(signed.url, {
				method: "PUT",
				body: await file.file.arrayBuffer(),
				headers,
			});

			ret.push({
				name: file.name,
				hash: signed.hash,
			});
		}

		return ret;
	};
}
