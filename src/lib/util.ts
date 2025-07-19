export const tryParseUrl = (input: string | URL) => {
	if (input instanceof URL) return input;

	try {
		return new URL(input);
	} catch (_) {
		return null;
	}
};

export const createLogger = (context: string) => {
	const c = context.toUpperCase();
	const doLog = (level: "error" | "warn" | "log", ...args: unknown[]) => {
		console[level](
			`[${c} ${new Date().toISOString()}] ${args
				.map((x) => (typeof x === "object" ? JSON.stringify(x) : x))
				.join(" ")}`,
		);
		return args.join(" ");
	};

	return {
		error: (...args: unknown[]) => doLog("error", ...args),
		warn: (...args: unknown[]) => doLog("warn", ...args),
		msg: (...args: unknown[]) => doLog("log", ...args),
		verbose: (...args: unknown[]) => doLog("log", ...args),
	};
};

export const makeUrl = (path: string, base: URL) => {
	const url = new URL(base);

	if (path.startsWith("/")) path = path.slice(1);

	url.pathname = `${url.pathname}${url.pathname.endsWith("/") ? "" : "/"}${path}`;

	return url.href;
};

/**
 * Split a string or URL into the domain and user parts. For URLs, this is NOT the username auth part
 * @param lookup Either an ActorMention or URL string
 * @returns Domain and user parts of input
 */
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
