import type { ClientOptions } from "./client/types";

export const setLogin = (login: ClientOptions | null) => {
	if (!login) {
		localStorage.removeItem("login");
		return;
	}

	localStorage.setItem("login", JSON.stringify(login));
};

export const getLogin = (): ClientOptions | null => {
	const data = localStorage.getItem("login");
	if (data) return JSON.parse(data);
	return null;
};
