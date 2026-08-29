import * as Oauth from "openid-client";
import { getLogin, setLogin } from "./storage";
import { onOpenUrl } from "@tauri-apps/plugin-deep-link";
import { openUrl } from "@tauri-apps/plugin-opener";

const LOGIN_DEEP_LINK = "shoot://login/";

export const doOAuthLogin = async (instance: URL) => {
	let config;
	try {
		config = await getConfig(instance);
	} catch (e) {
		throw new Error("Failed to discover OAuth endpoints or register client.", { cause: e });
	}

	const code_verifier = Oauth.randomPKCECodeVerifier();
	const code_challenge = await Oauth.calculatePKCECodeChallenge(code_verifier);

	const parameters: Record<string, string> = {
		redirect_uri: import.meta.env.VITE_IS_MOBILE_TAURI
			? LOGIN_DEEP_LINK
			: window.location.origin + "/",
		code_challenge,
		code_challenge_method: "S256",
	};

	if (!config.serverMetadata().supportsPKCE()) {
		parameters.state = Oauth.randomState();
	}

	const redirectTo = Oauth.buildAuthorizationUrl(config, parameters);

	let code = await doAuthPopup(redirectTo);

	let tokens;
	try {
		tokens = await Oauth.authorizationCodeGrant(config, code, {
			pkceCodeVerifier: code_verifier,
			expectedState: parameters.state,
		});
	} catch (e) {
		throw new Error("Failed to get authentication code", { cause: e });
	}

	return tokens;
};

const getConfig = async (instance: URL): Promise<Oauth.Configuration> => {
	const existing = window.localStorage.getItem(`client_${instance.origin}`);
	if (existing) {
		const parsed = JSON.parse(existing);

		return new Oauth.Configuration(parsed.server, parsed.client.client_id, parsed.client);
	}

	const config = await Oauth.dynamicClientRegistration(
		instance,
		{
			grant_types: ["authorization_code", "refresh_token"],
			client_name: "shoot.pub",
			redirect_uris: [window.location.origin + "/", LOGIN_DEEP_LINK],
		},
		undefined,
		{
			algorithm: "oauth2",
		},
	);

	window.localStorage.setItem(
		`client_${instance.origin}`,
		JSON.stringify({
			server: config.serverMetadata(),
			client: config.clientMetadata(),
		}),
	);

	return config;
};

export const refreshAuthToken = async () => {
	const login = getLogin();
	if (!login) throw new Error("Not logged in");

	const config = await getConfig(
		new URL(typeof login.instance === "string" ? login.instance : login.instance.http),
	);

	const refreshed = await Oauth.refreshTokenGrant(config, login.tokens.refresh);

	if (!refreshed.access_token || !refreshed.refresh_token || !refreshed.expires_in)
		throw new Error("The OAuth response did not include everything!");

	const ret = {
		instance: login.instance,
		tokens: {
			access: refreshed.access_token,
			refresh: refreshed.refresh_token,
			expiry: Date.now() + refreshed.expires_in,
		},
	};
	setLogin(ret);
	return ret;
};

const doAuthPopup = (url: URL) => {
	return (import.meta.env.VITE_IS_MOBILE_TAURI ? doAuthMobilePopup : doAuthBrowserPopup)(url);
};

const doAuthMobilePopup = async (url: URL): Promise<URL> => {
	const openPromise = openUrl(url);

	const promise = new Promise<URL>((resolve) => {
		void onOpenUrl((opened) => {
			if (!opened[0]) return;

			resolve(new URL(opened[0]));
		});
	});

	await openPromise;

	return promise;
};

const doAuthBrowserPopup = (url: URL) => {
	const width = Math.min(500, Math.floor(window.screen.width * 0.9));
	const height = Math.min(600, Math.floor(window.screen.height * 0.8));

	const features = `popup,width=${width},height=${height}`;

	const popup = createWindow(url.href, features);
	if (!popup) throw new Error("Failed to create popup. Your browser might be blocking them.");

	let interval: number;
	return new Promise<URL>((resolve, reject) => {
		interval = setInterval(pollPopup, 100, popup, resolve, reject);
	}).finally(() => clearInterval(interval));
};

const pollPopup = (
	popup: WindowProxy,
	resolve: (code: URL) => void,
	reject: (error: Error) => void,
) => {
	try {
		if (popup.closed) reject(new Error("Failed to login. The popup closed too early."));

		const url = new URL(popup.location.href);
		const code = url.searchParams.get("code");
		if (!code) return;

		resolve(url);
		popup.close();
	} catch {
		return;
	}
};

const createWindow = (url: string, features: string) => {
	try {
		const popup = window.open(url, "auth-popup", features);
		if (!popup || popup.closed || typeof popup.closed === "undefined") return null;
		return popup;
	} catch {
		return null;
	}
};
