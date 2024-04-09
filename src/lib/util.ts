import { writable } from "svelte/store";
import type { Login } from "./client";

export const WritableMap = <K, V>(map: Map<K, V> = new Map()) => {
	const { subscribe, set, update } = writable(map);

	return {
		subscribe,
		set,
		add: (key: K, value: V) => {
			map?.set(key, value);
			set(map)
		},
		remove: (key: K) => {
			map.delete(key);
			set(map);
		},
		clear: () => {
			map.clear();
			set(map);
		},
		get: (key: K) => {
			return map.get(key)
		}
	}
}

export const getFormData = <T extends { [key: string]: string }>(
	form: HTMLFormElement,
) => {
	const formData = new FormData(form);
	const data: { [key: string]: string } = {};
	for (let field of formData) {
		const [key, value] = field;
		if (typeof value != "string") continue; // bleh
		data[key] = value;
	}
	return data as T;
};

export const getLogin = (): Login | null => {
	const ret = window.localStorage.getItem("login");
	return ret ? JSON.parse(ret) : null;
	// return {
	// 	instance: {
	// 		http: new URL("https://chat.understars.dev"),
	// 		gateway: new URL("wss://chat.understars.dev"),
	// 		cdn: new URL("https://chat.understars.dev"),
	// 	},
	// 	token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImQ4ODJkZjNlLTE2MDgtNDYxZi04NTI2LTIyMTM1NzIyNGFmMCIsImlhdCI6MTcxMDIyMTI3Nn0.NLbKe4X_qntPqsDKKcnUB_N0hAswVg2Y-M79TnXWAK4",
	// };
};

export const setLogin = (instance: Login) => {
	window.localStorage.setItem("login", JSON.stringify(instance));
};
