import { create } from "zustand";

const initialValue = {
	fileId: null,
	messages: [],
};

export const useGeneralStore = create((set) => ({
	...initialValue,
	setFileId: (props) => set(() => ({ fileId: props })),
	setMessages: (props) => set(() => ({ messages: props })),
}));
