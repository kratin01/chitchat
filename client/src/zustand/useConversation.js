import { create } from "zustand";

const useConversation = create((set) => ({
	selectedConversation: null,
	setSelectedConversation: (selectedConversation) => set({ selectedConversation }),
	messages: [],
	setMessages: (messages) => set({ messages }),
}));

export default useConversation;

//zustand is basically used to manage the global state of the application. It is a react hook that is used to manage the global state of the application just like context api but it is more efficient than context api