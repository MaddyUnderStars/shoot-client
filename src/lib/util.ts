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

export type Instance = {
	token: string;
	http: string;
};

export const getLoginInstance = (): Instance | null => {
	const ret = window.localStorage.getItem("instance");
	// return ret ? JSON.parse(ret) : null;
	return {
		http: "https://chat.understars.dev",
		token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImQ4ODJkZjNlLTE2MDgtNDYxZi04NTI2LTIyMTM1NzIyNGFmMCIsImlhdCI6MTcxMDIyMTI3Nn0.NLbKe4X_qntPqsDKKcnUB_N0hAswVg2Y-M79TnXWAK4",
	};
};

export const setLoginInstance = (instance: Instance) => {
	window.localStorage.setItem("instance", JSON.stringify(instance));
};
