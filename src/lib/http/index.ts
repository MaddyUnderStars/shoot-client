import createClient from "openapi-fetch";
import { paths } from "./generated/v1";

export const createHttpClient = (baseUrl: URL) => {
	return createClient<paths>({ baseUrl: baseUrl.toString() })
}