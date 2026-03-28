import React from "react";
import BaseMessage from "./BaseMessage";
import { ChatMessage } from "@/src/types/components/chat";

interface AudioMessageProps {
  message: ChatMessage;
}

const AudioMessage: React.FC<AudioMessageProps> = ({ message }) => {
  return (
    <BaseMessage message={message}>
      <div className="flex flex-col gap-2 min-w-70 sm:min-w-[320px]">
        {message.fileUrl && (
          <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-3 border border-slate-100 dark:border-slate-800">
            <audio
              src={message.fileUrl}
              controls
              className="w-full h-10 custom-audio-player"
            />
          </div>
        )}
        {message.content && (
          <p className="px-1 whitespace-pre-wrap wrap-break-word font-medium leading-relaxed text-[13px] text-slate-700 dark:text-slate-300">
            {message.content}
          </p>
        )}
      </div>
    </BaseMessage>
  );
};

export default AudioMessage;
