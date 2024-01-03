export const specialRegex = /(?:```json|```)\n([\s\S]*?)\n```/;

export const safeParse = (str) => {
	try {
		return JSON.parse(str);
	} catch (e) {
		return null;
	}
};

export const extractJsonFromString = (str = "") => {
	const match = /(?:```json|```|\[)\n([\s\S]*?)\n(```|\])/.exec(str);

	return {
		str: match ? str.substring(0, match.index) : str,
		obj: safeParse(match?.[1]),
	};
};

export const isValidUrl = (str = "") => {
	if (!str) return false;
	const res = str.match(
		/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g
	);
	return res !== null;
};
