import createFetchClient, { type Middleware } from "openapi-fetch";
import createClient from "openapi-react-query";
import { getLogin } from "../storage";
import type { paths } from "./generated/v1";

export const getHttpClient = () => {
	const login = getLogin();

	if (!login) throw new Error("Not logged in");

	const $fetch = createFetchClient<paths>({
		baseUrl: typeof login.instance === "string" ? login.instance : login.instance.http.href,
	});

	$fetch.use(authMiddleware);

	const $api = createClient($fetch);

	return { $fetch, $api };
};

const authMiddleware: Middleware = {
	onRequest({ request }) {
		const login = getLogin();
		if (!login) throw new Error("Not logged in");
		request.headers.set("Authorization", `Bearer ${login?.tokens.access}`);
		return request;
	},
};
