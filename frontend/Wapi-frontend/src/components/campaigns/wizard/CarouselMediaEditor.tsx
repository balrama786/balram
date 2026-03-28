/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Input } from "@/src/elements/ui/input";
import { Label } from "@/src/elements/ui/label";
import { Attachment } from "@/src/types/components";
import { CloudUpload, Image as ImageIcon, PlayCircle, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import MediaSelectionModal from "../../chat/MediaSelectionModal";
import { CampaignCard, TemplateCarouselCard } from "./types";

// ─── Card Header Media Picker ─────────────────────────────────────────────────

/** Media library picker + URL input for a single carousel card header */
const CardHeaderMedia = ({ cardIndex, headerFormat, link, onLinkChange }: { cardIndex: number; headerFormat: string; link: string; onLinkChange: (val: string) => void }) => {
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);

  const isImage = headerFormat === "image";
  const isVideo = headerFormat === "video";

  const handleMediaSelect = (selectedMedia: Attachment[]) => {
    if (selectedMedia.length > 0) {
      const mediaUrl = selectedMedia[0].fileUrl;
      if (mediaUrl) {
        onLinkChange(mediaUrl);
        toast.success(`Card ${cardIndex + 1} media selected`);
      }
    }
  };

  const handleClearMedia = () => {
    onLinkChange("");
  };

  return (
    <div className="space-y-3">
      {/* Media preview / picker */}
      {link ? (
        <div className="relative rounded-xl border border-slate-200 dark:border-(--card-border-color) overflow-hidden bg-slate-50 dark:bg-(--dark-body)">
          <div className="flex items-center gap-3 p-3">
            <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-slate-200 dark:bg-slate-800 flex items-center justify-center">{isImage ? <Image src={link} alt={`Card ${cardIndex + 1}`} width={64} height={64} className="w-full h-full object-cover" unoptimized /> : isVideo ? <video src={link} className="w-full h-full object-cover" muted /> : <ImageIcon size={24} className="text-slate-400" />}</div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-600 dark:text-slate-300 truncate">Media selected</p>
              <p className="text-[10px] text-slate-400 truncate">{link.substring(0, 60)}...</p>
            </div>
            <button onClick={handleClearMedia} className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/30 dark:hover:bg-rose-900/40 text-rose-400 hover:text-rose-600 transition-colors shrink-0">
              <X size={14} />
            </button>
          </div>
          <div className="px-3 pb-3">
            <button type="button" onClick={() => setIsMediaModalOpen(true)} className="w-full text-xs font-bold text-primary hover:text-primary/80 transition-colors py-1.5 rounded-lg bg-primary/5 hover:bg-primary/10">
              Replace Media
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200 dark:border-(--card-border-color) bg-slate-50/50 dark:bg-(--dark-body) p-6 cursor-pointer transition-colors hover:border-primary/40 hover:bg-primary/5" onClick={() => setIsMediaModalOpen(true)}>
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <CloudUpload size={20} className="text-primary" />
          </div>
          <p className="text-xs font-bold text-slate-600 dark:text-slate-300">Select {headerFormat} from media library</p>
          <p className="text-[10px] text-slate-400">Choose from your uploaded media</p>
        </div>
      )}

      {/* OR divider */}
      <div className="flex items-center gap-2">
        <div className="flex-1 h-px bg-slate-200 dark:bg-(--table-hover)" />
        <span className="text-[10px] font-bold text-slate-400 uppercase">or paste url</span>
        <div className="flex-1 h-px bg-slate-200 dark:bg-(--table-hover)" />
      </div>

      {/* URL input */}
      <Input placeholder={`https://example.com/${isVideo ? "video.mp4" : "image.jpg"}`} value={link} onChange={(e) => onLinkChange(e.target.value)} className="h-11 bg-slate-50 dark:bg-(--dark-body) rounded-xl" />

      {/* Media Selection Modal */}
      <MediaSelectionModal isOpen={isMediaModalOpen} onClose={() => setIsMediaModalOpen(false)} onSelect={handleMediaSelect} />
    </div>
  );
};

// ─── Carousel Media Editor (Template-driven) ─────────────────────────────────

export const CarouselMediaEditor = ({ cards, templateCards, onChange }: { cards: CampaignCard[]; templateCards: TemplateCarouselCard[]; onChange: (cards: CampaignCard[]) => void }) => {
  const updateCard = (i: number, field: string, value: string) => {
    const next = cards.map((c, idx) => {
      if (idx !== i) return c;
      if (field === "link") return { ...c, header: { ...c.header, link: value } };
      return c;
    });
    onChange(next);
  };

  return (
    <div className="space-y-4">
      {templateCards.map((tCard, i) => {
        const card = cards[i];
        if (!card) return null;

        const headerComp = tCard.components?.find((c: any) => c.type === "header");
        const headerFormat = headerComp?.format || "image";

        return (
          <div key={i} className="rounded-lg border border-slate-100 dark:bg-(--page-body-bg) dark:border-none overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 bg-slate-50 dark:bg-(--page-body-bg) border-b border-slate-100 dark:border-(--card-border-color)">
              <span className="text-[11px] font-black uppercase tracking-widest text-slate-500">Card {i + 1}</span>
              <span className="text-[10px] font-medium text-slate-400 italic">Header: {headerFormat}</span>
            </div>
            <div className="p-5 space-y-4">
              {/* Header media: gallery picker + URL */}
              <div className="space-y-1.5">
                <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  {headerFormat === "video" ? <PlayCircle size={11} /> : <ImageIcon size={11} />} Header {headerFormat === "video" ? "Video" : "Image"}
                </Label>
                <CardHeaderMedia cardIndex={i} headerFormat={headerFormat} link={card.header.link} onLinkChange={(val) => updateCard(i, "link", val)} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
