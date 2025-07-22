import { useEffect, useState } from "react";
import type { Channel } from "@/lib/client/entity/channel";
import type { ApiPublicAttachment } from "@/lib/http/types";
import { getLogin } from "@/lib/storage";
import { makeUrl } from "@/lib/utils";

export const FilePreview = ({
	file,
	channel,
}: {
	file: File | ApiPublicAttachment;
	channel?: Channel;
}) => {
	const [url, setUrl] = useState<string | null>(null);
	const [object] = useState(file);

	const instance = getLogin()?.instance;

	useEffect(() => {
		const src =
			object instanceof File
				? URL.createObjectURL(object)
				: channel?.mention && instance
					? makeUrl(
							`/channel/${channel.mention}/attachments/${object.hash}`,
							new URL(instance.toString()),
						).href
					: "";

		setUrl(src);

		return () => {
			URL.revokeObjectURL(src);
		};
	}, [object, channel, instance]);

	if (!instance) return null;
	if (!url) return;

	if (file.type?.startsWith("image")) {
		return <img src={url} alt={file.name} className="h-52" />;
	}

	if (file.type?.startsWith("video")) {
		// biome-ignore lint/a11y/useMediaCaption: impossible
		return <video controls src={url} title={file.name} className="h-52" />;
	}

	if (file.type.startsWith("audio")) {
		// biome-ignore lint/a11y/useMediaCaption: impossible
		return <video controls src={url} title={file.name} className="h-52" />;
	}

	return (
		<a target="_blank" rel="noreferrer" href={url}>
			{file.name}
		</a>
	);
};
