import type { AnchorHTMLAttributes, PropsWithChildren } from "react";
import { openUrl } from "@tauri-apps/plugin-opener";

export const Anchor = ({
	children,
	href,
	...props
}: PropsWithChildren<AnchorHTMLAttributes<HTMLAnchorElement>>) => {
	if (import.meta.env.VITE_IS_MOBILE_TAURI && href) {
		const open = () => openUrl(href);

		return (
			<button className={props.className} onClick={open}>
				{children}
			</button>
		);
	}

	return (
		<a href={href} {...props}>
			{children}
		</a>
	);
};
