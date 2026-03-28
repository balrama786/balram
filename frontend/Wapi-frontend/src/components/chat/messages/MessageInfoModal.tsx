import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/src/elements/ui/dialog";
import { cn } from "@/src/lib/utils";
import { ChatMessage } from "@/src/types/components/chat";
import { CheckCheck } from "lucide-react";
import React from "react";

interface MessageInfoModalProps {
  message: ChatMessage;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const MessageInfoModal: React.FC<MessageInfoModalProps> = ({ message, open, onOpenChange }) => {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date
      .toLocaleString("en-US", {
        month: "numeric",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
      .replace(",", " at");
  };

  const deliveryTime = formatDate(message.delivered_at);
  const readTime = formatDate(message.seen_at);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-105 p-0! gap-0 overflow-hidden dark:bg-(--card-color) dark:border-(--card-border-color) shadow-2xl">
        <DialogHeader className="px-6 py-4 border-b border-slate-200 dark:border-(--card-border-color)">
          <DialogTitle className="text-base font-semibold text-left text-slate-900 dark:text-slate-100">Message info</DialogTitle>
        </DialogHeader>

        <div className="px-6 py-5 space-y-6">
          {/* Read Status */}
          <div className="flex items-start gap-4">
            <div className="shrink-0 mt-0.5">
              <CheckCheck className={cn("w-5 h-5 transition-colors", message.is_seen ? "text-sky-500" : "text-slate-300 dark:text-slate-600")} />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-[15px] font-medium text-slate-900 dark:text-slate-100 mb-1">Read</h4>
              <p className="text-sm text-slate-500 dark:text-gray-500">{readTime || "Not read yet"}</p>
            </div>
          </div>

          {/* Delivered Status */}
          <div className="flex items-start gap-4">
            <div className="shrink-0 mt-0.5">
              <CheckCheck className={cn("w-5 h-5 transition-colors", message.is_delivered ? "text-slate-400 dark:text-slate-500" : "text-slate-300 dark:text-slate-600")} />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-[15px] font-medium text-slate-900 dark:text-slate-100 mb-1">Delivered</h4>
              <p className="text-sm text-slate-500 dark:text-gray-500">{deliveryTime || formatDate(message.createdAt) || "Pending"}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MessageInfoModal;
