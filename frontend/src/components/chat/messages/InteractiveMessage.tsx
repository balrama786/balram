import { cn } from "@/src/lib/utils";
import { ChatMessage } from "@/src/types/components/chat";
import { List } from "lucide-react";
import React, { useState } from "react";
import BaseMessage from "./BaseMessage";
import { Button } from "@/src/elements/ui/button";
import ListViewModal from "./ListViewModal";

interface InteractiveMessageProps {
  message: ChatMessage;
}

const InteractiveMessage: React.FC<InteractiveMessageProps> = ({ message }) => {
  const { interactiveData } = message;
  const isOutgoing = message.direction === "outbound";
  const [isListModalOpen, setIsListModalOpen] = useState(false);

  if (!interactiveData) {
    return (
      <BaseMessage message={message}>
        <p className="whitespace-pre-wrap wrap-break-word leading-relaxed text-[14px] pr-3 pb-2">{message.content}</p>
      </BaseMessage>
    );
  }

  return (
    <>
      <BaseMessage message={message}>
        <div className={`flex flex-col gap-0 min-w-55 max-w-75 overflow-hidden -mx-3`}>
          {interactiveData?.list?.header && (
            <div className={cn("px-3 pt-3 pb-1.5", isOutgoing ? "border-b border-white/10" : "border-b border-slate-100 dark:border-white/10")}>
              <p className={cn("text-[13px] font-bold tracking-tight", isOutgoing ? "text-primary/90 dark:text-white/80" : "text-slate-700 dark:text-slate-200")}>{interactiveData.list.header}</p>
            </div>
          )}

          {interactiveData?.interactiveType === "button" && message.content && <div className="px-3 pt-3 pb-0">{/* no extra header label needed for button type */}</div>}

          <div className="px-3 py-2">{message.content && <p className={cn("whitespace-pre-wrap wrap-break-word leading-relaxed text-[14px]", isOutgoing ? "text-slate-600 dark:text-gray-300" : "text-slate-600 dark:text-gray-400")}>{message.content}</p>}</div>

          {interactiveData?.list?.footer && (
            <div className="px-3 pb-2">
              <p className="text-[11px] text-slate-400 dark:text-gray-500">{interactiveData.list.footer}</p>
            </div>
          )}

          {interactiveData?.interactiveType === "button" && interactiveData.buttons && (
            <div className={cn("flex flex-col border-t m-1 mx-2 gap-1 pt-1", isOutgoing ? "border-white/10" : "border-slate-100 dark:border-white/10")}>
              {interactiveData.buttons.map((btn, index) => (
                <Button key={index} className={cn("w-full text-[13.5px] py-1.5 border rounded-lg font-semibold transition-colors text-center", isOutgoing ? "border-white/20 text-white hover:bg-white/10" : "border-primary/20 text-primary hover:bg-emerald-50 dark:border-primary/20 dark:hover:bg-primary/10")} disabled>
                  {btn.title}
                </Button>
              ))}
            </div>
          )}

          {interactiveData?.interactiveType === "list" && interactiveData.list && (
            <div className={cn("border-t m-1 mx-2 pt-1", isOutgoing ? "border-white/10" : "border-slate-100 dark:border-white/10")}>
              <div onClick={() => setIsListModalOpen(true)} className={cn("flex items-center justify-center gap-2 cursor-pointer px-4 py-1.5 border rounded-lg transition-colors", isOutgoing ? "border-primary/50 hover:bg-white/10" : "border-primary/20 hover:bg-emerald-50 dark:hover:bg-primary/10")}>
                <List size={15} className={isOutgoing ? "text-primary" : "text-primary"} />
                <span className={cn("text-[13.5px] font-bold", isOutgoing ? "text-slate-600" : "text-white/80")}>{interactiveData.list.buttonTitle}</span>
              </div>
            </div>
          )}
        </div>
      </BaseMessage>

      {interactiveData?.list && <ListViewModal isOpen={isListModalOpen} onClose={() => setIsListModalOpen(false)} data={interactiveData.list} />}
    </>
  );
};

export default InteractiveMessage;
