import { type FormEvent, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { MdFileUpload } from "react-icons/md";
import SparkMD5 from "spark-md5";
import styled from "styled-components";
import type { Channel } from "../lib/entities/channel";
import { createHttpClient } from "../lib/http";
import { FilePreview } from "./filepreview";

export const ChatInput = ({ channel }: { channel: Channel }) => {
	const [attached, setAttached] = useState<File[]>([]);

	const sendMessage = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		const form = event.currentTarget;
		const formData = new FormData(form);

		const content = formData.get("content")?.toString();

		form.reset();

		const attachments = await doImageUploads();
		setAttached([]);

		await channel?.sendMessage({
			content,
			files: attachments ?? undefined,
		});
	};

	/** mostly taken from the sparkmd5 readme */
	const getFileMd5 = (file: File): Promise<string> =>
		new Promise((resolve, reject) => {
			const spark = new SparkMD5.ArrayBuffer();
			const reader = new FileReader();

			const chunkSize = 1024 * 1024 * 2; // 2mb
			const chunks = Math.ceil(file.size / chunkSize);
			let currentChunk = 0;

			reader.onload = (e) => {
				if (!e.target?.result)
					return reject(new Error("result missing?"));

				spark.append(e.target.result as ArrayBuffer);
				currentChunk++;

				if (currentChunk < chunks) loadNext();
				else {
					resolve(btoa(spark.end(true)));
				}
			};

			reader.onerror = (e) => reject(e);

			const loadNext = () => {
				const start = currentChunk * chunkSize;
				const end =
					start + chunkSize >= file.size
						? file.size
						: start + chunkSize;

				reader.readAsArrayBuffer(file.slice(start, end));
			};

			loadNext();
		});

	const getFileDimensions = (
		file: File,
	): Promise<{ width?: number; height?: number }> =>
		new Promise((resolve) => {
			if (file.type.startsWith("image")) {
				const img = new Image();
				img.onload = () => {
					const ret = { width: img.width, height: img.height };
					URL.revokeObjectURL(img.src);
					resolve(ret);
				};
				img.src = URL.createObjectURL(file);
			} else if (file.type.startsWith("video")) {
				const video = document.createElement("video");
				video.addEventListener("loadedmetadata", () => {
					const ret = {
						width: video.videoWidth,
						height: video.videoHeight,
					};
					URL.revokeObjectURL(video.src);
					resolve(ret);
				});
				video.src = URL.createObjectURL(file);
			} else {
				resolve({});
			}
		});

	const doImageUploads = async () => {
		if (!channel) return;

		const body = [];
		for (const file of attached) {
			body.push({
				name: file.name,
				size: file.size,
				mime: file.type,
				md5: await getFileMd5(file),

				...(await getFileDimensions(file)),
			});
		}

		if (!body.length) return;

		// get the upload endpoints
		const { data, error } = await createHttpClient().POST(
			"/channel/{channel_id}/attachments/",
			{
				body,
				params: {
					path: {
						channel_id: channel.mention,
					},
				},
			},
		);

		if (!data || error) return;

		// and then upload the files
		const ret = [];
		for (let i = 0; i < data?.length; i++) {
			const file = attached[i];
			const meta = body[i];
			const signed = data[i];

			if (!file || !signed || !meta) continue;

			ret.push({
				hash: signed.hash,
				name: meta.name,
			});

			const headers: { [key: string]: string } = {
				"Content-Type": file.type,
				"Content-MD5": meta.md5,
			};

			// if (meta.height && meta.width) {
			//     headers["x-amz-meta-height"] = meta.height.toString();
			//     headers["x-amz-meta-width"] = meta.width.toString();
			// }

			await fetch(signed.url, {
				method: "PUT",
				body: await file.arrayBuffer(),
				headers,
			});
		}

		return ret;
	};

	return (
		<form onSubmit={sendMessage}>
			{attached.length ? (
				<UploadPreviewSet>
					{attached.map((x) => (
						<FilePreview
							file={x}
							key={x.name + x.type}
							channel={channel}
						/>
					))}
					<button
						type="reset"
						style={{
							position: "absolute",
							right: 20,
							top: 20,
							outline: "none",
							background: "none",
							border: "none",
							color: "white",
							cursor: "pointer",
						}}
						title="Reset uploads"
						onClick={() => setAttached([])}
					>
						<IoMdClose />
					</button>
				</UploadPreviewSet>
			) : null}

			<div style={{ display: "flex" }}>
				<ChatBox
					type="text"
					placeholder="Send a message..."
					name="content"
				/>

				<UploadBox htmlFor="files" title="Upload">
					<MdFileUpload />
				</UploadBox>
				<input
					id="files"
					name="files"
					type="file"
					multiple
					hidden
					onChange={(e) => setAttached([...(e.target.files ?? [])])}
				/>
			</div>
		</form>
	);
};

const UploadPreviewSet = styled.div`
position: relative;
    background: var(--background-tertiary);
    padding: 10px;
`;

const ChatBox = styled.input`
	margin: 0 0 20px 0;
	padding: 10px;
	background-color: rgb(10, 10, 10);
	border: 1px solid white;
	color: white;
	flex: 1;
`;

const UploadBox = styled.label`
	margin: 0 20px 20px 0;
	padding: 10px;
	background-color: rgb(10, 10, 10);
	border: 1px solid white;
	color: white;
    cursor: pointer;
`;
