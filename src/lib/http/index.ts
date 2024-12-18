import createClient from "openapi-fetch";
import { shoot } from "../client";
import type { paths } from "./generated/v1";

export const createHttpClient = (baseUrl?: URL) => {
    const url = baseUrl ?? shoot.instance?.http;
	if (!url) throw new Error("no base url for http client");
	return createClient<paths>({
		baseUrl: url.toString(),
		headers: {
			Authorization: shoot.token,
		},
	});
};

export type HttpClient = ReturnType<typeof createHttpClient>;
