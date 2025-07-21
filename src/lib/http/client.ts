import createFetchClient from "openapi-fetch";
import createClient from "openapi-react-query";
import { getLogin } from "../storage";
import type { paths } from "./generated/v1";

export const getHttpClient = () => {
	const login = getLogin();

	if (!login) throw new Error("Not logged in");

	const $fetch = createFetchClient<paths>({
		baseUrl:
			typeof login.instance === "string"
				? login.instance
				: login.instance.http.href,
		headers: {
			Authorization: login.token,
		},
	});

	const $api = createClient($fetch);

	return { $fetch, $api };
};
