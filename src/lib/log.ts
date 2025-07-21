export const createLogger = (context: string) => {
	context = context.toUpperCase();
	const doLog = (
		level: "error" | "warn" | "log" | "debug",
		...args: unknown[]
	) => {
		console[level](`[${context}]`, ...args);
		return args.join(" ");
	};

	return {
		error: (...args: unknown[]) => doLog("error", ...args),
		warn: (...args: unknown[]) => doLog("warn", ...args),
		msg: (...args: unknown[]) => doLog("log", ...args),
		verbose: (...args: unknown[]) => doLog("debug", ...args),
	};
};
