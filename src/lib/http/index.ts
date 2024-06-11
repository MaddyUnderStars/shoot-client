import createClient from "openapi-fetch";
import { shoot } from "../client";
import { paths } from "./generated/v1";

export const createHttpClient = (baseUrl?: URL) => {
	if (!baseUrl) baseUrl = shoot.instance?.http;
	if (!baseUrl) throw new Error("no base url for http client");
	return createClient<paths>({
		baseUrl: baseUrl.toString(),
		headers: {
			Authorization: shoot.token,
		},
	});
};

export type HttpClient = ReturnType<typeof createHttpClient>;
