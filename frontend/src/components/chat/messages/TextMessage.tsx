import React from "react";
import BaseMessage from "./BaseMessage";
import { ChatMessage } from "@/src/types/components/chat";

interface TextMessageProps {
  message: ChatMessage;
}

const TextMessage: React.FC<TextMessageProps> = ({ message }) => {
  return (
    <BaseMessage message={message}>
      <p className="whitespace-break-spaces break-all leading-relaxed text-[14px]">{message.content}</p>
    </BaseMessage>
  );
};

export default TextMessage;
