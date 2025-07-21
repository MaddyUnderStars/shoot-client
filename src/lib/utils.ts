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
