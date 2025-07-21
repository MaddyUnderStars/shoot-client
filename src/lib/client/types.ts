export type InstanceOptions = {
	http: URL;
	gateway: URL;
};

export type ClientOptions = {
	instance: InstanceOptions | string;
	token: string;
};
