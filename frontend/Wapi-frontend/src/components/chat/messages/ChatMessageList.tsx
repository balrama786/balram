import React, { useEffect, useRef, useState, useImperativeHandle, forwardRef } from "react";
import { GetMessagesResponse } from "@/src/types/components/chat";
import MessageGroup from "./MessageGroup";
import { ArrowDown } from "lucide-react";
import { Button } from "@/src/elements/ui/button";
import { formatChatDate } from "@/src/utils";
import { ChatMessageSkeleton } from "../ChatSkeleton";

interface ChatMessageListProps {
  data: GetMessagesResponse | undefined;
  isLoading: boolean;
  onImageClick?: (url: string) => void;
}

const ChatMessageList = forwardRef<{ scrollToTop: () => void; scrollToBottom: () => void }, ChatMessageListProps>(({ data, isLoading, onImageClick }, ref) => {
  const listRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const [showScrollBottom, setShowScrollBottom] = useState(false);

  const scrollToBottom = (behavior: ScrollBehavior = "smooth") => {
    if (!listRef.current) return;

    const scroll = () => {
      if (!listRef.current) return;
      const { scrollHeight, clientHeight } = listRef.current;
      listRef.current.scrollTo({
        top: scrollHeight - clientHeight,
        behavior,
      });
    };

    // Use requestAnimationFrame to ensure the DOM has updated
    requestAnimationFrame(() => {
      scroll();
      // Second pass after a small delay for content that might still be rendering
      if (behavior === "auto") {
        setTimeout(scroll, 100);
      }
    });
  };

  const scrollToTop = () => {
    listRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  useImperativeHandle(ref, () => ({
    scrollToTop,
    scrollToBottom: () => scrollToBottom("smooth"),
  }));

  useEffect(() => {
    if (data?.messages) {
      // Use smooth scroll to show the "top to bottom" effect requested by the user
      const timeout = setTimeout(() => {
        scrollToBottom("smooth");
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [data]);

  useEffect(() => {
    if (!listRef.current) return;

    const resizeObserver = new ResizeObserver(() => {
      if (!listRef.current) return;
      // Scroll to bottom if we are already near bottom
      const { scrollTop, scrollHeight, clientHeight } = listRef.current;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      if (isNearBottom) {
        scrollToBottom("auto");
      }
    });

    resizeObserver.observe(listRef.current);
    return () => resizeObserver.disconnect();
  }, [data]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    // Show button if scrolled up more than 300px from bottom (with a small buffer)
    setShowScrollBottom(scrollHeight - scrollTop - clientHeight > 300);
  };

  if (isLoading) {
    return <ChatMessageSkeleton />;
  }

  if (!data?.messages || data.messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-2">
        <p className="text-slate-400 text-sm">No messages yet. Send a message to start the conversation.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 relative flex flex-col min-h-0 overflow-hidden">
      <div ref={listRef} onScroll={handleScroll} className="flex-1 overflow-y-auto py-6 pb-0 px-2 space-y-8 custom-scrollbar">
        {data.messages.map((dateGroup) => (
          <div key={dateGroup.dateKey} className="flex flex-col space-y-6">
            {/* Date Label */}
            <div className="flex justify-center sticky top-1 z-10">
              <span className="px-3 py-1 rounded-full bg-slate-100/50 dark:bg-(--page-body-bg) backdrop-blur-sm text-[11px] font-bold text-slate-500 dark:text-gray-400 shadow-sm border border-slate-200/50 dark:border-(--card-border-color)">{formatChatDate(dateGroup.dateKey)}</span>
            </div>

            <div className="flex flex-col space-y-4">
              {dateGroup.messageGroups.map((group, index) => (
                <MessageGroup key={`${dateGroup.dateKey}-${group.senderId}-${index}`} group={group} onImageClick={onImageClick} />
              ))}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Scroll to Bottom Button */}
      {showScrollBottom && (
        <Button size="icon" variant="secondary" className="absolute bottom-6 right-6 rounded-full shadow-lg bg-white dark:bg-(--page-body-bg) border border-slate-200 dark:border-(--card-border-color) animate-in fade-in zoom-in duration-200" onClick={() => scrollToBottom()}>
          <ArrowDown size={18} className="text-primary" />
        </Button>
      )}
    </div>
  );
});

ChatMessageList.displayName = "ChatMessageList";

export default ChatMessageList;
