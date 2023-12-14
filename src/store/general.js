import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const initialValue = {
	visitorId: null,
	fileId: null,
	messages: [],
};

export const useGeneralStore = create(
	persist(
		(set) => ({
			...initialValue,
			setVisitorId: (props) => set(() => ({ visitorId: props })),
			setFileId: (props) => set(() => ({ fileId: props })),
			setMessages: (props) => set(() => ({ messages: props })),
		}),
		{
			name: "general-storage", // name of the item in the storage (must be unique)
			storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
		}
	)
);