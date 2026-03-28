"use client";

import { ReplyMaterialType } from "@/src/types/reply-material";
import { Button } from "@/src/elements/ui/button";
import { Plus, FileText, Image, FileArchive, Video, Smile, Zap, Layout, ShoppingBag, Bot } from "lucide-react";

const TYPE_ICON: Record<ReplyMaterialType, React.ReactNode> = {
  text: <FileText size={40} />,
  // eslint-disable-next-line jsx-a11y/alt-text
  image: <Image size={40} />,
  document: <FileArchive size={40} />,
  video: <Video size={40} />,
  sticker: <Smile size={40} />,
  sequence: <Zap size={40} />,
  template: <Layout size={40} />,
  catalog: <ShoppingBag size={20} />,
  chatbot: <Bot size={40} />,
};

const TYPE_LABEL: Record<ReplyMaterialType, string> = {
  text: "text messages",
  image: "images",
  document: "documents",
  video: "videos",
  sticker: "stickers",
  sequence: "sequences",
  template: "templates",
  catalog: "catalog",
  chatbot: "chatbots",
};

interface ReplyMaterialEmptyStateProps {
  type: ReplyMaterialType;
  onAdd: () => void;
}

const ReplyMaterialEmptyState: React.FC<ReplyMaterialEmptyStateProps> = ({ type, onAdd }) => {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center px-6">
      <div className="w-20 h-20 rounded-lg bg-slate-50 dark:bg-(--page-body-bg) flex items-center justify-center text-slate-300 dark:text-gray-500 mb-6 border border-slate-100 dark:border-(--card-border-color)">{TYPE_ICON[type]}</div>
      <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2 tracking-tight">No {TYPE_LABEL[type]} yet</h3>
      <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xs font-medium mb-6">Add your first {TYPE_LABEL[type]} so agents can quickly reply without typing from scratch.</p>
      <Button onClick={onAdd} className="flex items-center gap-2 bg-primary text-white px-5 h-11 rounded-xl font-semibold text-sm shadow-lg shadow-primary/20 active:scale-95 transition-all">
        <Plus size={18} />
        Add {TYPE_LABEL[type]}
      </Button>
    </div>
  );
};

export default ReplyMaterialEmptyState;
