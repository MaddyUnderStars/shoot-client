import { makeUrl, tryParseUrl } from "./utils";

export const getQualifiedInstanceUrl = (urlOrName: string) => {
	let url = tryParseUrl(urlOrName);
	if (url) return url;

	// if it's not already a url, maybe they just forgot the https:// ?

	if (!urlOrName.startsWith("http://") && !urlOrName.startsWith("https://")) {
		url = tryParseUrl(`https://${urlOrName}`);
		if (url) return url;
	}

	// if appending protocol didn't work, can't do much else

	return undefined;
};

// TODO: move this
let instanceValidationAbort = new AbortController();
export const validateInstance = async (instance: string) => {
	const url = getQualifiedInstanceUrl(instance);

	if (!url) return false;

	instanceValidationAbort.abort();

	instanceValidationAbort = new AbortController();

	const nodeInfo = makeUrl("/.well-known/nodeinfo/2.0", url);

	try {
		const data = await fetch(nodeInfo, {
			signal: instanceValidationAbort.signal,
		}).then((x) => x.json());

		return data;
	} catch (_) {
		return false;
	}
};
