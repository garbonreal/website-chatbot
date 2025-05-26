import { atom } from "recoil";
import { getFormattedTime } from "../util";
import { time } from "framer-motion";

// Atom for showing/hiding the chatbot
export const showNestyChatAtom = atom({
  key: "showNestyChatAtom",
  default: "close", // either close, min, or max
});

// Atom to store the history of messages
export const nestyChatMessageHistoryAtom = atom({
  key: "nestyChatMessageHistoryAtom",
  default: [
    {
      role: "assistant",
      content: "Hello! How can I assist you today?",
      source: [],
      time: getFormattedTime(new Date()),
    },
  ],
});

// Atom to track if the user is typing
export const isNestyChatThinkingAtom = atom({
  key: "isNestyChatThinkingAtom",
  default: false,
});

// Atom for storing any chatbot errors
export const nestyChatErrorAtom = atom({
  key: "nestyChatErrorAtom",
  default: "",
});

export const urlMapAtom = atom({
  key: "urlMapAtom",
  default: {},
});
