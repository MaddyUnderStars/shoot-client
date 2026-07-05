import { makeUrl, tryParseUrl } from "./utils";

export const resolveHostmetaTemplate = async (url: URL, signal?: AbortSignal) => {
	url.pathname = "/.well-known/host-meta";

	const hostmetaRes = await fetch(url, { signal });
	const hostmetaText = await hostmetaRes.text();

	const parser = new DOMParser();
	const doc = parser.parseFromString(hostmetaText, "text/xml");

	const template = doc
		.querySelector("XRD Link[type='application/xrd+xml']")
		?.getAttribute("template");

	if (!template) throw new Error("Could not resolve host-meta");

	const ret = new URL(template);

	return getQualifiedInstanceUrl(ret.origin);
};

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
	let url = getQualifiedInstanceUrl(instance);
	if (!url) return false;

	instanceValidationAbort.abort();

	instanceValidationAbort = new AbortController();

	try {
		const hostmeta = await resolveHostmetaTemplate(url, instanceValidationAbort.signal);
		if (hostmeta) {
			console.log(`Host-meta found and resolved to ${hostmeta}`);
			url = hostmeta;
		}
	} catch {
		// intentionally blank
	}

	const nodeInfo = makeUrl("/.well-known/nodeinfo/2.0", url);

	try {
		const data = await fetch(nodeInfo, {
			signal: instanceValidationAbort.signal,
		}).then((x) => x.json());

		return data;
	} catch {
		return false;
	}
};
