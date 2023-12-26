import classNames from "classnames";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs) => twMerge(classNames(inputs));

export function isEmpty(value) {
	if (Array.isArray(value)) {
		return value.length === 0;
	}
	if (typeof value === "object") {
		if (value) {
			// invariant(
			// 	!isIterable(value) || value.size === undefined,
			// 	"isEmpty() does not support iterable collections."
			// );
			// eslint-disable-next-line no-unreachable-loop
			for (const _ in value) return false;
		}
		return true;
	}
	return !value;
}

export const isBot = (role) => {
	return role === "assistant";
};

export const REGEX_FILE = /(?:```json|```)\n([\s\S]*?)\n```/;

export const parsedText = (content, regex, replaceFn) => {
	let contentLeft = content;
	let matched;
	const parsedList = [];
	regex.lastIndex = 0;

	// eslint-disable-next-line no-cond-assign
	while (contentLeft && (matched = regex.exec(contentLeft))) {
		const contentBeforeMatch = contentLeft.substring(0, matched.index);
		parsedList.push(contentBeforeMatch);
		parsedList.push(replaceFn(matched[1]));
		contentLeft = contentLeft.substring(matched.index + matched[0].length);
		regex.lastIndex = 0;
	}
	parsedList.push(contentLeft);
	return parsedList;
};

export const getFileId = async (messages = []) => {
	let jsonMarkdown = "";
	await messages.find((i) => {
		jsonMarkdown = i?.content?.[0]?.text?.value?.match(REGEX_FILE)?.[1];
		return !!jsonMarkdown;
	});

	if (jsonMarkdown) {
		const r = safeParse(jsonMarkdown);
		return r?.["image_id"] || r?.["media_id"];
	}
	return null;
};

export const safeParse = (str) => {
	try {
		return JSON.parse(str);
	} catch (e) {
		return null;
	}
};

export const safePlay = (mediaEl, onError) => {
	const playPromise = mediaEl?.play?.();
	if (playPromise) {
		playPromise
			.then(() => {})
			.catch((err) => {
				console.warn(`play: ${err}`);
				if (typeof onError === "function") onError(err);
				if (err.name === "NotAllowedError") return;
				// eslint-disable-next-line no-console
			});
	}
};
