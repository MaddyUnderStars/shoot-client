import { makeUrl, tryParseUrl } from "./utils";

export const resolveHostmetaTemplate = async (url: URL, signal?: AbortSignal) => {
	url.pathname = "/.well-known/host-meta";

	const hostmetaRes = await fetch(url, { signal });
	const hostmetaText = await hostmetaRes.text();

	const parser = new DOMParser();
	const doc = parser.parseFromString(hostmetaText, "text/xml");

	const template = doc.querySelector("XRD Link[template]")?.getAttribute("template");

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

const resolveNodeinfo = async (url: URL, signal: AbortSignal) => {
	const wellknown = await fetch(makeUrl(".well-known/nodeinfo", url), { signal });
	const wellknownJson = await wellknown.json();

	const href = wellknownJson.links[0].href;

	const nodeinfo = await fetch(href, { signal });
	return await nodeinfo.json();
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

	try {
		return await resolveNodeinfo(url, instanceValidationAbort.signal);
	} catch {
		return false;
	}
};
