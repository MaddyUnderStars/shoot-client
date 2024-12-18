import styled from "styled-components";
import type { Channel } from "../lib/entities/channel";
import { shoot } from "../lib/client";
import type { MessageSchema } from "../lib/entities/message";

export const FilePreview = ({
	file,
	channel,
}: {
	file: MessageSchema["files"][0] | File;
	channel: Channel;
}) => {
	// TODO: actually set a media endpoint.
	// maybe allow running a cdn server or smth separate to the api serverside?
	const mediaEndpoint = shoot.instance?.http;
	if (!mediaEndpoint) return;

	const src =
		file instanceof File
			? URL.createObjectURL(file)
			: `${mediaEndpoint.origin}/channel/${channel.mention}/attachments/${file.hash}`;

	if (file.type?.startsWith("image")) {
		return <Image src={src} alt={file.name} height={200} />;
	}
	if (file.type?.startsWith("audio")) {
		// biome-ignore lint/a11y/useMediaCaption: <explanation>
		return <audio controls src={src} title={file.name} />;
	}
	if (file.type?.startsWith("video")) {
		// biome-ignore lint/a11y/useMediaCaption: <explanation>
		return <video controls src={src} title={file.name} height={200} />;
	}

	return <a target="_blank" rel="noreferrer" href={src}>{file.name}</a>;
};

const Image = styled.img`
`;
