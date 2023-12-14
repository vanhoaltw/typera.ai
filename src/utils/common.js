import classNames from "classnames";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs) => twMerge(classNames(inputs));

export function isEmpty(value) {
	if (Array.isArray(value)) {
		return value.length === 0;
	}
	if (typeof value === "object") {
		if (value) {
			invariant(
				!isIterable(value) || value.size === undefined,
				"isEmpty() does not support iterable collections."
			);
			// eslint-disable-next-line no-unreachable-loop
			for (const _ in value) return false;
		}
		return true;
	}
	return !value;
}

export const isBot = (role) => {
	return role === "assistant"
}