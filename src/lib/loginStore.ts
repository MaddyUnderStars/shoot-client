import type { ClientOptions } from "./client";

// biome-ignore lint/complexity/noStaticOnlyClass: TODO
export class LoginStore {
	static save = (data: ClientOptions | null) => {
		if (!data) {
			localStorage.removeItem("LoginStore");
			return;
		}
		
		localStorage.setItem("LoginStore", JSON.stringify(data));
	};

	static load = (): ClientOptions | null => {
		const data = localStorage.getItem("LoginStore");
		if (data) return JSON.parse(data);
		return null;
	};
}
