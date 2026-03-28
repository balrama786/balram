import React from "react";
import BaseMessage from "./BaseMessage";
import { ChatMessage } from "@/src/types/components/chat";
import { FileText, Download } from "lucide-react";

interface DocumentMessageProps {
  message: ChatMessage;
}

const DocumentMessage: React.FC<DocumentMessageProps> = ({ message}) => {
  const fileName = message.fileUrl?.split("/").pop() || "Document";

  return (
    <BaseMessage message={message}>
      <div className="flex flex-col gap-2 min-w-57.5">
        <div className="flex items-center gap-3 p-2 rounded-lg bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5">
          <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600">
            <FileText size={20} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold truncate leading-tight">{fileName}</p>
            <p className="text-[10px] text-slate-500 opacity-80 uppercase font-bold mt-0.5">{fileName.split(".").pop()}</p>
          </div>
          <a href={message.fileUrl || "#"} download className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-slate-600 dark:text-gray-500">
            <Download size={16} />
          </a>
        </div>
        {message.content && <p className="whitespace-pre-wrap wrap-break-word leading-relaxed text-[13.5px]">{message.content}</p>}
      </div>
    </BaseMessage>
  );
};

export default DocumentMessage;
