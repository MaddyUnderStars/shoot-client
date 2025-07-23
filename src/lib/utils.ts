import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const tryParseUrl = (input: string | URL) => {
	if (input instanceof URL) return input;

	try {
		return new URL(input);
	} catch (_) {
		return null;
	}
};

export const makeUrl = (path: string, base: URL) => {
	const url = new URL(base);

	if (path.startsWith("/")) path = path.slice(1);

	url.pathname = `${url.pathname}${url.pathname.endsWith("/") ? "" : "/"}${path}`;

	return url;
};

export const splitQualifiedMention = (lookup: string | URL) => {
	let domain: string | undefined;
	let user: string | undefined;
	if (typeof lookup === "string" && lookup.includes("@")) {
		// lookup a @handle@domain
		if (lookup[0] === "@") lookup = lookup.slice(1);
		[user, domain] = lookup.split("@");
	} else {
		// lookup was a URL ( hopefully )

		const url = tryParseUrl(lookup);
		if (!url) {
			throw new Error("Lookup is not valid handle or URL");
		}

		domain = url.hostname;
		user = url.pathname.split("/").reverse()[0]; // not great
	}

	return {
		domain,
		user,
	};
};

export const capitalise = (str: string) => {
	return `${str.charAt(0).toUpperCase()}${str.slice(1)}`;
};

export enum CLOSE_CODES {
	CLOSE_NORMAL = 1000,
	CLOSE_TOO_LARGE = 1009,
	SERVER_ERROR = 1011,
	SERVICE_RESTART = 1012,
	TRY_AGAIN_LATER = 1013,

	/** We did not receive heartbeat in time */
	HEARTBEAT_TIMEOUT = 4000,

	/** We did not receive auth in time */
	IDENTIFY_TIMEOUT = 4001,

	/** We received a payload that failed validation */
	BAD_PAYLOAD = 4002,

	/** The token provided in IDENTIFY was invalid */
	BAD_TOKEN = 4100,
}
