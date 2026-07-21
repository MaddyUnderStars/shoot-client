import { useEffect, useState } from "react";
import type { Channel } from "@/lib/client/entity/channel";
import type { ApiPublicAttachment } from "@/lib/http/types";
import { getLogin } from "@/lib/storage";
import { makeUrl } from "@/lib/utils";

export const FilePreview = ({
	file,
	channel,
	className,
}: {
	file: File | ApiPublicAttachment;
	channel?: Channel;
	className?: string;
}) => {
	if (!className) className = "h-52";

	const [url, setUrl] = useState<string | null>(null);
	const [object] = useState(file);

	useEffect(() => {
		const instance = getLogin()?.instance;

		const src =
			object instanceof File
				? URL.createObjectURL(object)
				: channel?.mention && instance
					? makeUrl(
							`/channel/${channel.mention}/attachments/${object.hash}`,
							new URL(typeof instance === "string" ? instance : instance.http),
						).href
					: "";

		setUrl(src);

		return () => {
			URL.revokeObjectURL(src);
		};
	}, [object, channel]);

	if (!url) return null;

	if (file.type?.startsWith("image")) {
		return <img src={url} alt={file.name} className={className} />;
	}

	if (file.type?.startsWith("video")) {
		return <video controls src={url} title={file.name} className={className} />;
	}

	if (file.type.startsWith("audio")) {
		return <video controls src={url} title={file.name} className={className} />;
	}

	return (
		<a target="_blank" rel="noreferrer" href={url}>
			{file.name}
		</a>
	);
};
