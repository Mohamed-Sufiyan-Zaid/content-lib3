import ChatMessage from "../ChatMessage/ChatMessage";

const messages = [
  {
    msg: "You are a research agent who is provided with a user query and some context. Your task is to answer questions which can help your team \nresearch on the user’s questions. These are previously asked questions: {unanswered_questions}",
    isReply: false
  },
  {
    msg: "This is a chat message reply\nYou are a research agent who is provided with a user query and some context. Your task is to answer questi",
    isReply: true,
    citationsContent: "MAX608.0.pdf, , pages :- 2, 4, 6"
  },
  {
    msg: "You are a research agent who is provided with a user query and some context. Your task is to answer questions which can help your team \nresearch on the user’s questions. These are previously asked questions: {unanswered_questions}",
    isReply: false
  },
  {
    msg: "This is a chat message reply\nYou are a research agent who is provided with a user query and some context. Your task is to answer questi",
    isReply: true,
    citationsContent: "MAX608.0.pdf, , pages :- 2, 4, 6"
  },
  {
    msg: "You are a research agent who is provided with a user query and some context. Your task is to answer questions which can help your team \nresearch on the user’s questions. These are previously asked questions: {unanswered_questions}",
    isReply: false
  }
];

const ChatMessagesExample = () => (
  <>
    {messages.map((message, index) => (
      <div key={index}>
        <ChatMessage textMessage={message.msg} isReply={message.isReply} />
      </div>
    ))}
  </>
);

export default ChatMessagesExample;
