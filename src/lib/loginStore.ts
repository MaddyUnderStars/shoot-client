import { ClientOptions } from "./client";

export class LoginStore {
	static save = (data: ClientOptions) => {
		localStorage.setItem("LoginStore", JSON.stringify(data));
	};

	static load = (): ClientOptions | null => {
		const data = localStorage.getItem("LoginStore");
		if (data) return JSON.parse(data);
		return null;
	};
}
