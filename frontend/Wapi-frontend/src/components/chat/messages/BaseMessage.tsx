import { cn } from "@/src/lib/utils";
import { ChatMessage } from "@/src/types/components/chat";
import { AlertCircle, Check, CheckCheck, Clock, FileText, Image as ImageIcon, Mic, Video } from "lucide-react";
import React, { useState } from "react";
import MessageActions from "./MessageActions";
import MessageInfoModal from "./MessageInfoModal";
import MessageTranslation from "./MessageTranslation";
import { useAppSelector } from "@/src/redux/hooks";
import { maskSensitiveData } from "@/src/utils/masking";
import MessageReactionPicker from "./MessageReactionPicker";

interface BaseMessageProps {
  message: ChatMessage;
  children: React.ReactNode;
}

const StatusIcon = ({ status }: { status: string | null }) => {
  switch (status) {
    case "pending":
      return <Clock size={12} className="text-slate-400" />;
    case "sent":
      return <Check size={12} className="text-slate-400" />;
    case "delivered":
      return <CheckCheck size={12} className="text-slate-400" />;
    case "read":
      return <CheckCheck size={12} className="text-blue-500" />;
    case "failed":
      return <AlertCircle size={12} className="text-rose-500" />;
    default:
      return <Check size={12} className="text-slate-400" />;
  }
};

const BaseMessage: React.FC<BaseMessageProps> = ({ message, children }) => {
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [translatedText, setTranslatedText] = useState<string | null>(null);
  const { user } = useAppSelector((state) => state.auth);
  const { is_demo_mode } = useAppSelector((state) => state.setting);
  const { selectedWorkspace } = useAppSelector((state) => state.workspace);
  const isBaileys = selectedWorkspace?.waba_type === "baileys";
  const isAgent = user?.role === "agent";

  const time = new Date(message.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const isOutgoing = message?.direction === "outbound";
  const showSenderName = !isOutgoing;

  return (
    <>
      <div id={`message-${message.id}`} className={cn("group/bubble flex w-full mb-0.5 px-4", isOutgoing ? "justify-end" : "justify-start")}>
        <div className={cn("relative max-w-[85%] sm:max-w-[70%] lg:max-w-[60%] group flex flex-col", isOutgoing ? "items-end" : "items-start")}>
          {!isOutgoing && showSenderName && (
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[13px] font-semibold text-primary">{isAgent && user?.is_phoneno_hide ? "Customer" : maskSensitiveData(message.sender.name, "phone", is_demo_mode)}</span>
            </div>
          )}

          <div className="relative flex items-start">
            <div className={cn(
              "absolute z-10 whitespace-nowrap transition-all duration-300",
              // Desktop: Side positioning
              "sm:top-1/2 sm:-translate-y-1/2",
              isOutgoing
                ? "sm:right-full sm:mr-3"
                : "sm:left-full sm:ml-3",
              // Mobile: Top positioning to prevent overflow
              "-top-5 flex items-center gap-1 sm:flex-row",
              isOutgoing
                ? "right-0 flex-row"
                : "left-0 flex-row-reverse"
            )}>
              {!isOutgoing && message.content && <MessageTranslation messageText={message.content || ""} onTranslated={setTranslatedText} />}
              <MessageReactionPicker message={message} isOutgoing={isOutgoing} isBaileys={isBaileys} />
              <MessageActions message={message} isOutgoing={isOutgoing} onInfoClick={() => setIsInfoModalOpen(true)} isBaileys={isBaileys} />
            </div>

            <div className={cn("relative shadow-sm min-w-15 pl-1", isOutgoing ? "px-3 py-1.5 rounded-lg rounded-tr-none bg-primary/20 dark:bg-(--chat-send-color) text-slate-900 dark:text-gray-300 border border-primary/25 dark:border-none" : "px-3 pr-2 py-1.5 rounded-lg rounded-tl-none bg-slate-100 dark:bg-(--page-body-bg) text-slate-800 dark:text-slate-300 border border-slate-200 dark:border-none flex flex-row")}>
              <div className={cn("w-full", !isOutgoing ? "pr-1" : "")}>
                {message.reply_message && (
                  <div
                    className={cn("mb-1.5 p-2 rounded-lg border-l-4 text-xs cursor-pointer hover:opacity-80 transition-opacity", isOutgoing ? "bg-black/5 dark:bg-black/20 border-primary" : "bg-white/60 dark:bg-black/30 border-primary")}
                    onClick={() => {
                      const el = document.getElementById(`message-${message.reply_message?.id}`);
                      el?.scrollIntoView({ behavior: "smooth", block: "center" });
                      el?.classList.add("bg-primary/20", "dark:bg-primary/40", "transition-colors", "duration-500", "py-4");
                      setTimeout(() => {
                        el?.classList.remove("bg-primary/20", "dark:bg-primary/40", "transition-colors", "duration-500", "py-4");
                      }, 2000);
                    }}
                  >
                    <div className="font-bold text-primary text-[10px] uppercase mb-0.5">{message.reply_message.sender.name || "User"}</div>
                    <div className="flex items-center gap-1.5 opacity-70 italic text-[11px]">
                      {message.reply_message.messageType === "image" && <ImageIcon size={10} />}
                      {message.reply_message.messageType === "video" && <Video size={10} />}
                      {message.reply_message.messageType === "audio" && <Mic size={10} />}
                      {message.reply_message.messageType === "document" && <FileText size={10} />}
                      <p className="truncate break-all">{message.reply_message.content}</p>
                    </div>
                  </div>
                )}
                <div className={`text-[14px] leading-normal ${message.messageType === "text" ? "pr-5 rtl:pr-0 rtl:pl-5 pb-2" : ""}`}>
                  {children}
                  {translatedText && (
                    <div className="mt-2 pt-2 border-t border-slate-200 dark:border-(--card-border-color)">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">AI Translation</span>
                      </div>
                      <p className="whitespace-pre-wrap wrap-break-word leading-relaxed text-[14px] text-slate-700 dark:text-gray-500">{translatedText}</p>
                    </div>
                  )}
                </div>

                <div className={cn("flex items-center gap-1 mt-0.5 justify-end h-3", isOutgoing ? "text-slate-500" : "text-slate-400 dark:text-slate-500")}>
                  <span className="text-[10px] tabular-nums dark:text-gray-400">{time}</span>
                  {isOutgoing && <StatusIcon status={message.wa_status} />}
                </div>
              </div>

              {message.reactions && message.reactions.length > 0 && (
                <div className={cn("absolute -bottom-3 left-2 z-10 flex flex-wrap gap-1")}>
                  {message.reactions.map((reaction, i) => (
                    <div key={i} className="flex items-center gap-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-1.5 py-1.5 shadow-md text-[14px] animate-in zoom-in-50 duration-200 hover:scale-110 transition-transform cursor-default" title={reaction.users?.map((u) => u.name).join(", ") || ""}>
                      <span className="leading-none">{reaction.emoji}</span>
                      {reaction.users && reaction.users.length > 1 && <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold">{reaction.users.length}</span>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <MessageInfoModal message={message} open={isInfoModalOpen} onOpenChange={setIsInfoModalOpen} />
    </>
  );
};

export default BaseMessage;
