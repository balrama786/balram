import React, { useState } from "react";
import { ChatMessage } from "@/src/types/components/chat";
import SystemMessage from "./SystemMessage";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/src/lib/utils";

interface CollapsibleSystemMessagesProps {
  messages: ChatMessage[];
}

const CollapsibleSystemMessages: React.FC<CollapsibleSystemMessagesProps> = ({ messages }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // If there are 2 or fewer, just render them normally (though caller should handle this)
  if (messages.length <= 2) {
    return (
      <>
        {messages.map((msg) => (
          <SystemMessage key={msg.id} message={msg} />
        ))}
      </>
    );
  }

  const visibleMessages = isExpanded ? messages : messages.slice(0, 2);
  const remainingCount = messages.length - 2;

  return (
    <div className="flex flex-col items-center w-full space-y-2 my-1">
      {visibleMessages.map((msg) => (
        <SystemMessage key={msg.id} message={msg} />
      ))}
      
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          "mt-1 flex items-center gap-1.5 text-[11px] font-bold py-1 px-3 rounded-full transition-all duration-200",
          "bg-slate-50 dark:bg-(--page-body-bg) text-primary hover:bg-emerald-50 dark:hover:bg-(--table-hover) border border-emerald-100/50 dark:border-emerald-500/10",
          "hover:shadow-sm transform hover:-translate-y-0.5"
        )}
      >
        {isExpanded ? (
          <>
            Show less <ChevronUp size={12} />
          </>
        ) : (
          <>
            Show {remainingCount} more updates <ChevronDown size={12} />
          </>
        )}
      </button>
    </div>
  );
};

export default CollapsibleSystemMessages;
