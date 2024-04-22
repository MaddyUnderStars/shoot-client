export const tryParseUrl = (str: string) => {
	try {
		return new URL(str);
	}
	catch (e) {
		return null;
	}
}