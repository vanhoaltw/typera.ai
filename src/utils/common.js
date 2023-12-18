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

export const REGEX_FILE = /\((image_id|media_id):\s*(.*?)\)/gi;
export const parsedText = (content, regex, replaceFn) => {
	let contentLeft = content;
	let matched;
	const parsedList = [];

	regex.lastIndex = 0;
	// eslint-disable-next-line no-cond-assign
	while (contentLeft && (matched = regex.exec(contentLeft))) {
		const contentBeforeMatch = contentLeft.substring(0, matched.index);
		parsedList.push(contentBeforeMatch);
		parsedList.push(replaceFn(matched[0]));
		contentLeft = contentLeft.substring(matched.index + matched[0].length);
		regex.lastIndex = 0;
	}
	parsedList.push(contentLeft);

	return parsedList;
};

export const getFileId = async (messages = []) => {
	const message = await messages.find((i) =>
		REGEX_FILE.test(i?.content?.[0]?.text?.value)
	);
	if (message) {
		const r = message.content[0].text.value;
		return r.split(":")?.[1]?.trim?.()?.replace(')', '');
	}
	return null;
};
