import { Channel } from "../client/entity/channel";
import { getFileDimensions, getFileMd5 } from "../file";
import { getHttpClient } from "./client";
import type { paths } from "./generated/v1";

type AttachmentSchema = Exclude<
	paths["/channel/{channel_id}/attachments/"]["post"]["requestBody"],
	undefined
>["content"]["application/json"][0];

type FilesMetaType = Array<
	AttachmentSchema & {
		file: File;
	}
>;
type HttpClient = ReturnType<typeof getHttpClient>["$fetch"];

export const uploadFiles = async (files: File[], target: "@me" | Channel) => {
	const { $fetch } = getHttpClient();

	const filesMeta: FilesMetaType = await Promise.all(
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

	const { data, error } = await (
		target instanceof Channel
			? postChannelUpload.bind(null, $fetch, filesMeta, target)
			: postUserUpload.bind(null, $fetch, filesMeta)
	)();

	if (error) throw new Error(error.message);

	const ret: {
		name: string;
		hash: string;
	}[] = [];

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

const postChannelUpload = ($fetch: HttpClient, filesMeta: FilesMetaType, channel: Channel) =>
	$fetch.POST("/channel/{channel_id}/attachments/", {
		body: filesMeta.map((x) => ({
			...x,
			file: undefined,
		})),
		params: {
			path: {
				channel_id: channel.mention,
			},
		},
	});

const postUserUpload = ($fetch: HttpClient, filesMeta: FilesMetaType) =>
	$fetch.POST("/users/@me/upload/", {
		body: filesMeta.map((x) => ({
			...x,
			file: undefined,
		})),
	});
