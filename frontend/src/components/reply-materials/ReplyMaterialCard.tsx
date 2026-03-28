"use client";

import { ReplyMaterial, ReplyMaterialType } from "@/src/types/reply-material";
import { Button } from "@/src/elements/ui/button";
import { cn } from "@/src/lib/utils";
import { Edit2, Trash2, FileText, Image, Video, FileArchive, Smile, CheckSquare, Square, ExternalLink, FileVideo, Zap, Layout, ShoppingBag, Bot } from "lucide-react";
import NextImage from "next/image";

interface ReplyMaterialCardProps {
  item: ReplyMaterial;
  isSelected: boolean;
  onToggleSelect: (id: string) => void;
  onEdit: (item: ReplyMaterial) => void;
  onDelete: (id: string) => void;
}

const TYPE_FALLBACK_ICON: Record<ReplyMaterialType, React.ReactNode> = {
  text: <FileText size={28} className="text-primary/60" />,
  // eslint-disable-next-line jsx-a11y/alt-text
  image: <Image size={28} className="text-blue-400" />,
  document: <FileArchive size={28} className="text-amber-400" />,
  video: <Video size={28} className="text-purple-400" />,
  sticker: <Smile size={28} className="text-pink-400" />,
  sequence: <Zap size={28} className="text-yellow-400" />,
  template: <Layout size={28} className="text-indigo-400" />,
  catalog: <ShoppingBag size={28} className="text-emerald-400" />,
  chatbot: <Bot size={28} className="text-cyan-400" />,
};

const TYPE_ACCENT: Record<ReplyMaterialType, string> = {
  text: "bg-primary/5 dark:bg-primary/10",
  image: "bg-blue-50 dark:bg-blue-500/10",
  document: "bg-amber-50 dark:bg-amber-500/10",
  video: "bg-purple-50 dark:bg-purple-500/10",
  sticker: "bg-pink-50 dark:bg-pink-500/10",
  sequence: "bg-yellow-50 dark:bg-yellow-500/10",
  template: "bg-indigo-50 dark:bg-indigo-500/10",
  catalog: "bg-emerald-50 dark:bg-emerald-500/10",
  chatbot: "bg-cyan-50 dark:bg-cyan-500/10",
};

const ReplyMaterialCard: React.FC<ReplyMaterialCardProps> = ({ item, isSelected, onToggleSelect, onEdit, onDelete }) => {
  const isImage = item.type === "image" || item.type === "sticker";
  const isVideo = item.type === "video";
  const isText = item.type === "text";

  return (
    <div className={cn("group relative bg-white dark:bg-(--card-color) rounded-lg border overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5", isSelected ? "border-primary shadow-md shadow-primary/10" : "border-slate-100 dark:border-(--card-border-color) shadow-sm")}>
      <button onClick={() => onToggleSelect(item._id)} className="absolute top-2.5 ltr:left-2.5 rtl:right-2.5 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-200" aria-label="Select item">
        {isSelected ? <CheckSquare size={20} className="text-primary drop-shadow-sm" /> : <Square size={20} className="text-slate-300 dark:text-slate-600 drop-shadow-sm" />}
      </button>

      <div className={cn("relative h-36 flex items-center justify-center overflow-hidden", TYPE_ACCENT[item.type])}>
        {isImage && item.file_url ? (
          <NextImage
            src={item.file_url}
            alt={item.name}
            fill
            className="object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
            unoptimized
          />
        ) : isVideo && item.file_url ? (
          <div className="flex flex-col items-center gap-2">
            <FileVideo size={36} className="text-purple-400" />
            <a href={item.file_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-[10px] font-bold text-purple-500 hover:text-purple-600 uppercase tracking-wider" onClick={(e) => e.stopPropagation()}>
              Preview <ExternalLink size={10} />
            </a>
          </div>
        ) : isText ? (
          <div className="px-4 text-center">
            <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-4 leading-relaxed font-medium">{item.content || "No content"}</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            {TYPE_FALLBACK_ICON[item.type]}
            {item.file_url && (
              <a href={item.file_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-[10px] font-bold text-slate-400 hover:text-primary uppercase tracking-wider" onClick={(e) => e.stopPropagation()}>
                Open <ExternalLink size={10} />
              </a>
            )}
          </div>
        )}
      </div>

      <div className="p-3 flex items-center justify-between gap-2">
        <p className="text-sm font-semibold text-slate-800 dark:text-white truncate flex-1">{item.name}</p>

        <div className="flex items-center gap-1 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity duration-200 shrink-0">
          <Button size="icon" variant="ghost" onClick={() => onEdit(item)} className="h-8 w-8 rounded-lg hover:bg-primary/5 hover:text-primary" aria-label="Edit">
            <Edit2 size={14} />
          </Button>
          <Button size="icon" variant="ghost" onClick={() => onDelete(item._id)} className="h-8 w-8 rounded-lg hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10 dark:hover:text-red-400" aria-label="Delete">
            <Trash2 size={14} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ReplyMaterialCard;
