import { create } from "zustand";

const initialValue = {
	fileId: null,
	messages: [],
	research: null,
	currentQuestion: null,
};

export const useGeneralStore = create((set) => ({
	...initialValue,
	setCurrentQuestion: (props) => set(() => ({ currentQuestion: props })),
	setResearch: (props) => set(() => ({ research: props })),
	setFileId: (props) => set(() => ({ fileId: props })),
	setMessages: (props) => set(() => ({ messages: props })),
}));
