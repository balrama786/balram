"use client";

import { Chatbot } from "@/src/types/chatbot";
import { Edit2, Trash2, Bot, Brain } from "lucide-react";
import { Button } from "@/src/elements/ui/button";
import { Badge } from "@/src/elements/ui/badge";

interface ChatbotCardProps {
  chatbot: Chatbot;
  onEdit: (chatbot: Chatbot) => void;
  onDelete: (id: string) => void;
  onTrain: (chatbot: Chatbot) => void;
}

const ChatbotCard: React.FC<ChatbotCardProps> = ({ chatbot, onEdit, onDelete, onTrain }) => {
  const modelName = typeof chatbot.ai_model === 'object' ? chatbot.ai_model.display_name : chatbot.ai_model;

  return (
    <div className="group relative bg-white dark:bg-(--card-color) rounded-lg border border-slate-100 dark:border-(--card-border-color) p-5 shadow-sm hover:shadow-md transition-all flex flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <div className="w-12 h-12 rounded-lg bg-primary/5 dark:bg-primary/10 flex items-center justify-center text-primary shrink-0 border border-primary/10">
          <Bot size={24} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-slate-900 dark:text-white truncate uppercase tracking-tight text-sm">{chatbot.name}</h3>
          <p className="text-[11px] text-slate-400 font-medium truncate mt-0.5">{modelName}</p>
        </div>
        <Badge variant={chatbot.status === "active" ? "outline" : "secondary"} className={chatbot.status === "active" ? "bg-emerald-50 dark:bg-primary/20 dark:border-(--card-border-color) text-emerald-600 border-emerald-100" : ""}>
          {chatbot.status === "active" ? "Active" : "Inactive"}
        </Badge>
      </div>

      <div className="flex-1">
        <p className="text-xs text-slate-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
          {chatbot.business_description || "No business description provided."}
        </p>
      </div>

      <div className="flex items-center gap-2 pt-2 border-t border-slate-50 dark:border-(--card-border-color)">
        <Button 
          onClick={() => onTrain(chatbot)}
          className="flex-1 h-9 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-white border-none shadow-none font-bold text-[11px] uppercase tracking-wider transition-all"
        >
          <Brain size={14} className="mr-1.5" />
          Train AI
        </Button>
        <div className="flex items-center gap-1 transition-opacity">
          <Button 
            size="icon" 
            variant="ghost" 
            onClick={() => onEdit(chatbot)}
            className="h-9 w-9 rounded-lg hover:bg-slate-100 dark:hover:bg-(--table-hover)"
          >
            <Edit2 size={14} className="text-slate-400" />
          </Button>
          <Button 
            size="icon" 
            variant="ghost" 
            onClick={() => onDelete(chatbot._id)}
            className="h-9 w-9 rounded-lg hover:bg-rose-50 dark:hover:bg-red-900/20"
          >
            <Trash2 size={14} className="text-rose-400" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatbotCard;
