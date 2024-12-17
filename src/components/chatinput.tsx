import { type FormEvent, useState } from "react";
import { createHttpClient } from "../lib/http";
import type { Channel } from "../lib/entities/channel";
import styled from "styled-components";
import { MdFileUpload } from "react-icons/md";
import { IoMdClose } from "react-icons/io";

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

		await channel?.sendMessage({ content, files: attachments ?? [] });
	};

	const doImageUploads = async () => {
		if (!channel) return;

		// get the upload endpoints
		const { data, error } = await createHttpClient().POST(
			"/channel/{channel_id}/attachments/",
			{
				body: [...attached].map((x) => ({ name: x.name, size: x.size })),
				params: {
					path: {
						channel_id: channel.mention,
					},
				},
			},
		);

		if (!data || error) return;

		// and then upload the files
        const ret: { name: string, hash: string }[] = [];
		for (let i = 0; i < data?.length; i++) {
			const file = attached[i];
			const signed = data[i];

			if (!file || !signed) continue;

            ret.push({ name: file.name, hash: signed.hash })

			await fetch(signed.url, {
				method: "PUT",
				body: await file.arrayBuffer(),
			});
		}

        return ret;
	};

	return (
		<form onSubmit={sendMessage}>
			{attached.length ? (
				<UploadPreviewSet>
					{attached.map((x) => (
						<UploadPreview
							src={URL.createObjectURL(x)}
							alt={x.name}
							key={`${x.name}${x.size}`}
							width={100}
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
				<ChatBox type="text" placeholder="Send a message..." name="content" />

				<UploadBox htmlFor="files" title="Upload">
					<MdFileUpload />
				</UploadBox>
				<input
					id="files"
					name="files"
					type="file"
					multiple
					hidden
					onChange={(e) => setAttached([...e.target.files ?? []])}
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

const UploadPreview = styled.img`
    margin-right: 10px;
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
