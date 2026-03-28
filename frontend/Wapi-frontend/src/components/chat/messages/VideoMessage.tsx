import { ChatMessage } from "@/src/types/components/chat";
import React from "react";
import BaseMessage from "./BaseMessage";

interface VideoMessageProps {
  message: ChatMessage;
}

const VideoMessage: React.FC<VideoMessageProps> = ({ message }) => {
  return (
    <BaseMessage message={message}>
      <div className="flex flex-col gap-2">
        {message.fileUrl && (
          <div className="relative rounded-lg overflow-hidden min-h-37.5 min-w-50 border border-black/5 dark:border-white/5 bg-black/10">
            <video
              src={message.fileUrl}
              className="w-full h-auto max-h-75 object-cover"
              controls
              poster="" // Could add a thumbnail if available
            />
          </div>
        )}
        {message.content && (
          <p className="whitespace-pre-wrap wrap-break-word leading-relaxed text-[13.5px]">
            {message.content}
          </p>
        )}
      </div>
    </BaseMessage>
  );
};

export default VideoMessage;
