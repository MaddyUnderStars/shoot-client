export type InstanceOptions = {
	http: URL;
	gateway: URL;
};

export type ClientOptions = {
	instance: InstanceOptions | string;
	tokens: {
		access: string;
		refresh: string;
		expiry: number;
	};
};
