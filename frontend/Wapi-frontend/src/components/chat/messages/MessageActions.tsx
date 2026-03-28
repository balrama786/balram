import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/src/elements/ui/dropdown-menu";
import { cn } from "@/src/lib/utils";
import { ChatMessage } from "@/src/types/components/chat";
import { Copy, EllipsisVertical, Info, Reply } from "lucide-react";
import { useAppDispatch } from "@/src/redux/hooks";
import { setReplyToMessage } from "@/src/redux/reducers/messenger/chatSlice";
import React from "react";
import { toast } from "sonner";

interface MessageActionsProps {
  message: ChatMessage;
  isOutgoing: boolean;
  onInfoClick?: () => void;
  className?: string;
  isBaileys?: boolean;
}

const MessageActions: React.FC<MessageActionsProps> = ({ message, isOutgoing, onInfoClick, className, isBaileys }) => {
  const dispatch = useAppDispatch();
  const getMessageText = (msg: ChatMessage): string => {
    switch (msg.messageType) {
      case "text":
        return msg.content || "";
      case "template":
        if (msg.template) {
          let text = "";
          if (msg.template.header?.format === "text" && msg.template.header.text) {
            text += `*${msg.template.header.text}*\n\n`;
          }
          text += msg.template.message_body;
          if (msg.template.footer_text) {
            text += `\n\n_${msg.template.footer_text}_`;
          }
          return text;
        }
        return msg.content || "";
      case "interactive":
        if (msg.interactiveData) {
          const { list, buttons } = msg.interactiveData;
          let text = "";
          if (list?.header) text += `*${list.header}*\n\n`;
          if (msg.content) text += `${msg.content}\n`;
          if (list?.footer) text += `\n_${list.footer}_`;
          if (buttons) {
            text += "\n" + buttons.map((b) => `[${b.title}]`).join(" ");
          }
          if (list?.buttonTitle) {
            text += `\n\n[${list.buttonTitle}]`;
          }
          return text.trim();
        }
        return msg.content || "";
      case "image":
        return msg.content || "Photo";
      case "video":
        return msg.content || "Video";
      case "audio":
        return msg.content || "Audio";
      case "document":
        return msg.content || msg.fileUrl?.split("/").pop() || "Document";
      case "location":
        return "Location";
      case "order":
        return "Order";
      default:
        return msg.content || "";
    }
  };

  const handleCopy = async () => {
    const text = getMessageText(message);
    if (!text) return;

    try {
      await navigator.clipboard.writeText(text);
      toast.success("Message copied to clipboard");
    } catch (error) {
      console.error("Failed to copy text: ", error);
      toast.error("Failed to copy message");
    }
  };

  return (
    <div className={cn("opacity-0 group-hover/bubble:opacity-100 transition-opacity self-center", className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className={cn("bg-white border border-neutral-400 p-1.5 rounded-full shadow text-neutral-400 transition-all hover:text-neutral-600 dark:bg-(--table-hover) dark:border-(--card-border-color) dark:text-neutral-400 dark:hover:text-slate-300 dark:hover:bg-(--daek-sidebar)")}>
            <EllipsisVertical size={16} />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align={isOutgoing ? "end" : "start"} className="min-w-35">
          <DropdownMenuItem onClick={handleCopy} className="cursor-pointer flex items-center gap-2">
            <Copy />
            <span>Copy</span>
          </DropdownMenuItem>

          {!isBaileys && (
            <DropdownMenuItem
              onClick={() => {
                dispatch(
                  setReplyToMessage({
                    id: message.id,
                    wa_message_id: message.wa_message_id,
                    content: getMessageText(message),
                    messageType: message.messageType,
                    createdAt: message.createdAt,
                    unreadCount: "0",
                  })
                );
              }}
              className="cursor-pointer flex items-center gap-2"
            >
              <Reply size={14} />
              <span>Reply</span>
            </DropdownMenuItem>
          )}

          {isOutgoing && onInfoClick && (
            <DropdownMenuItem onClick={onInfoClick} className="cursor-pointer flex items-center gap-2">
              <Info size={14} />
              <span>Info</span>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default MessageActions;
