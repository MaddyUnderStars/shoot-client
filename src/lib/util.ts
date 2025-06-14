export const tryParseUrl = (str: string) => {
	try {
		return new URL(str);
	} catch (e) {
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
