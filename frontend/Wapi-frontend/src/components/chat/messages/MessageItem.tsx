import React from "react";
import { ChatMessage } from "@/src/types/components/chat";
import TextMessage from "./TextMessage";
import ImageMessage from "./ImageMessage";
import VideoMessage from "./VideoMessage";
import AudioMessage from "./AudioMessage";
import DocumentMessage from "./DocumentMessage";
import TemplateMessage from "./TemplateMessage";
import InteractiveMessage from "./InteractiveMessage";
import LocationMessage from "./LocationMessage";
import OrderMessage from "./OrderMessage";
import BaseMessage from "./BaseMessage";
import SystemMessage from "./SystemMessage";

interface MessageItemProps {
  message: ChatMessage;
  onImageClick?: (url: string) => void;
}

const MessageItem: React.FC<MessageItemProps> = ({ message, onImageClick }) => {
  switch (message.messageType) {
    case "text":
      return <TextMessage message={message} />;
    case "image":
      return <ImageMessage message={message} onImageClick={onImageClick} />;
    case "video":
      return <VideoMessage message={message} />;
    case "audio":
      return <AudioMessage message={message} />;
    case "document":
      return <DocumentMessage message={message} />;
    case "template":
      return <TemplateMessage message={message} />;
    case "interactive":
      return <InteractiveMessage message={message} />;
    case "location":
      return <LocationMessage message={message} />;
    case "order":
      return <OrderMessage message={message} />;
    case "system_messages":
      return <SystemMessage message={message} />;
    default:
      if (message.content) {
        return <TextMessage message={message} />;
      }
      return (
        <BaseMessage message={message}>
          <p className="text-slate-400 italic text-[13px]">
            Unsupported message type: {message.messageType}
          </p>
        </BaseMessage>
      );
  }
};

export default MessageItem;
