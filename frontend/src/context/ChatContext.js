import { createContext } from "react";

const ChatContext = createContext({
  chatHistory: [],
  setChatHistory: () => {}
});

export default ChatContext;
