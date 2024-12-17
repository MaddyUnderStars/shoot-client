import { type ChangeEvent, type FormEvent, useState } from "react";
import { createHttpClient } from "../lib/http";
import type { Channel } from "../lib/entities/channel";
import styled from "styled-components";
import { MdFileUpload } from "react-icons/md";

export const ChatInput = ({ channel }: { channel: Channel }) => {
	const [attached, setAttached] = useState<{ hash: string; name: string, file: File }[]>(
		[],
	);

	const sendMessage = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		const form = event.currentTarget;
		const formData = new FormData(form);

		const content = formData.get("content")?.toString();

		if (!content) return;

		form.reset();

		await channel?.sendMessage({ content, files: attached });
	};

	const doImageUploads = async (event: ChangeEvent<HTMLInputElement>) => {
		if (!channel) return;

		const files = event.target.files;
		if (!files) return;

		// get the upload endpoints
		const { data, error } = await createHttpClient().POST(
			"/channel/{channel_id}/attachments/",
			{
				body: [...files].map((x) => ({ name: x.name, size: x.size })),
				params: {
					path: {
						channel_id: channel.mention,
					},
				},
			},
		);

		if (!data || error) return;

		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		setAttached(data.map((x, i) => ({ hash: x.hash, name: files[i]!.name, file: files[i]! })));

		// and then upload the files
		for (let i = 0; i < data?.length; i++) {
			const file = files[i];
			const signed = data[i];

			if (!file || !signed) continue;

			await fetch(signed.url, {
				method: "PUT",
				body: await file.arrayBuffer(),
			});
		}
	};

	return (
		<form onSubmit={sendMessage}>
			{attached.length ? (
				<UploadPreviewSet>
					{attached.map(x => <UploadPreview src={URL.createObjectURL(x.file)} alt={x.name} key={x.hash} width={100} />)}
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
					onChange={doImageUploads}
				/>
			</div>
		</form>
	);
};

const UploadPreviewSet = styled.div`
    background: var(--background-tertiary);
    padding: 10px;
`;

const UploadPreview = styled.img`
    margin-right: 10px;
`

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
