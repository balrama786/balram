"use client";

import { Input } from "@/src/elements/ui/input";
import { Label } from "@/src/elements/ui/label";
import { Textarea } from "@/src/elements/ui/textarea";
import { CarouselMediaSectionProps } from "@/src/types/components/Template";
import { Image as ImageIcon, Link, MessageSquareReply, Plus, Trash2, X } from "lucide-react";
import { useRef } from "react";
import { toast } from "sonner";
import CharacterCountWrapper from "@/src/shared/CharacterCountWrapper";

export const CarouselMediaSection = ({ buttonTemplates, cards, onAddButtonTemplate, onRemoveButtonTemplate, onAddCard, onRemoveCard, onUpdateCard, onUpdateCardButtonValue }: CarouselMediaSectionProps) => {
  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const handleFileChange = (cardId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) return toast.error("File size exceeds 5MB limit");
    onUpdateCard(cardId, { file });
  };

  return (
    <div className="bg-white dark:bg-(--card-color) sm:p-8 p-4 rounded-lg border border-slate-200 dark:border-(--card-border-color) shadow-sm space-y-8">
      {/* ── Shared Button Structure */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 tracking-tight">Shared Button Structure</h3>
          <p className="text-xs text-slate-500 font-medium dark:text-gray-400 mt-1">Define the button types and order. All cards will share this structure — only button text varies per card.</p>
        </div>

        {/* Existing button templates */}
        <div className="space-y-2">
          {buttonTemplates.map((btn, idx) => (
            <div key={btn.id} className="flex items-center justify-between px-4 py-3 bg-slate-50/60 dark:bg-(--dark-body) border border-slate-100 dark:border-(--card-border-color) rounded-lg group">
              <div className="flex items-center gap-3">
                <span className="w-5 h-5 flex items-center justify-center rounded-full bg-primary/10 text-primary text-[10px] font-black">{idx + 1}</span>
                <div className="flex items-center gap-1.5">
                  {btn.type === "url" ? <Link size={14} className="text-sky-500" /> : <MessageSquareReply size={14} className="text-emerald-500" />}
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{btn.type === "url" ? "URL Button" : "Quick Reply"}</span>
                </div>
              </div>
              <button type="button" onClick={() => onRemoveButtonTemplate(btn.id)} className="p-1.5 text-slate-300 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100">
                <X size={14} />
              </button>
            </div>
          ))}
        </div>

        {/* Add button type */}
        {buttonTemplates.length < 3 && (
          <div className="flex gap-2">
            <button type="button" onClick={() => onAddButtonTemplate("url")} className="flex-1 h-10 flex items-center justify-center gap-1.5 rounded-lg border-2 border-dashed border-slate-200 dark:border-(--card-border-color) text-slate-500 hover:border-primary hover:bg-emerald-50/20 dark:hover:bg-(--table-hover) transition-all text-xs font-bold">
              <Link size={13} /> Add URL Button
            </button>
            <button type="button" onClick={() => onAddButtonTemplate("quick_reply")} className="flex-1 h-10 flex items-center justify-center gap-1.5 rounded-lg border-2 border-dashed border-slate-200 dark:border-(--card-border-color) text-slate-500 hover:border-primary hover:bg-emerald-50/20 dark:hover:bg-(--table-hover) transition-all text-xs font-bold">
              <MessageSquareReply size={13} /> Add Quick Reply
            </button>
          </div>
        )}
      </div>

      {/* ── Media Cards */}
      <div className="space-y-4 border-t border-slate-100 dark:border-(--card-border-color) pt-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200 tracking-tight">Media Cards</h3>
            <p className="text-xs text-slate-500 font-medium dark:text-gray-400 mt-0.5">Add 2–10 cards. Each card has its own image, body text, and button texts.</p>
          </div>
          <button type="button" onClick={onAddCard} disabled={cards.length >= 10} className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-emerald-700 disabled:opacity-40 text-white rounded-lg text-xs font-bold transition-all">
            <Plus size={14} /> Add Card
          </button>
        </div>

        <div className="space-y-5">
          {cards.map((card, idx) => (
            <div key={card.id} className="p-5 bg-slate-50/50 dark:bg-(--dark-body) border border-slate-100 dark:border-(--card-border-color) rounded-xl space-y-5 relative group animate-in zoom-in-95 duration-200">
              {/* Card header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white dark:bg-(--page-body-bg) flex items-center justify-center text-primary shadow-sm">
                    <ImageIcon size={16} />
                  </div>
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest">Media Card #{idx + 1}</span>
                </div>
                {cards.length > 2 && (
                  <button type="button" onClick={() => onRemoveCard(card.id)} className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100">
                    <Trash2 size={16} />
                  </button>
                )}
              </div>

              {/* Image upload */}
              <div className="space-y-2">
                <Label className="text-xs font-bold text-slate-600 dark:text-gray-400">Card Image</Label>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  ref={(el) => {
                    fileRefs.current[card.id] = el;
                  }}
                  onChange={(e) => handleFileChange(card.id, e)}
                />
                {card.file ? (
                  <div className="flex items-center justify-between p-3 bg-emerald-50/50 dark:bg-emerald-500/5 border border-emerald-100 dark:border-emerald-500/20 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center">
                        <ImageIcon size={16} className="text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-700 dark:text-slate-300 truncate max-w-40">{card.file.name}</p>
                        <p className="text-[10px] text-emerald-600 font-bold uppercase">{(card.file.size / (1024 * 1024)).toFixed(2)} MB</p>
                      </div>
                    </div>
                    <button type="button" onClick={() => onUpdateCard(card.id, { file: null })} className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg transition-all">
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div onClick={() => fileRefs.current[card.id]?.click()} className="border-2 border-dashed border-slate-200 dark:border-(--card-border-color) rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-emerald-50/20 dark:hover:bg-(--table-hover) transition-all">
                    <ImageIcon size={24} className="text-slate-300 mb-2" />
                    <p className="text-xs font-bold text-slate-400">Click to upload image</p>
                    <p className="text-[10px] text-slate-400">JPG, PNG (Max 5MB)</p>
                  </div>
                )}
              </div>

              {/* Body text */}
              <div className="space-y-2">
                <Label className="text-xs font-bold text-slate-600 dark:text-gray-400">Card Body Text</Label>
                <CharacterCountWrapper current={card.body_text?.length || 0} max={200}>
                  <Textarea placeholder="Describe this card..." value={card.body_text || ""} onChange={(e) => onUpdateCard(card.id, { body_text: e.target.value.slice(0, 200) })} className="min-h-20 border-slate-200 dark:border-(--card-border-color) rounded-lg bg-(--input-color) dark:bg-(--page-body-bg) focus:border-emerald-500/50 transition-all font-medium resize-none text-sm" />
                </CharacterCountWrapper>
              </div>

              {/* Button text inputs — one per buttonTemplate */}
              {buttonTemplates.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-600 dark:text-gray-400">Button Texts</Label>
                  <div className="space-y-2">
                    {buttonTemplates.map((tmpl, bIdx) => {
                      const val = card.buttonValues.find((v) => v.templateId === tmpl.id);
                      return (
                        <div key={tmpl.id} className="flex items-center gap-3">
                          {/* Button type badge */}
                          <div className="shrink-0 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-(--page-body-bg) border border-slate-200 dark:border-(--card-border-color)">
                            {tmpl.type === "url" ? <Link size={12} className="text-sky-500" /> : <MessageSquareReply size={12} className="text-emerald-500" />}
                            <span className="text-[10px] font-bold text-slate-500 dark:text-gray-400 whitespace-nowrap">Btn {bIdx + 1}</span>
                          </div>
                          <div className="flex-1">
                            <CharacterCountWrapper current={val?.text?.length || 0} max={60}>
                              <Input placeholder={`Button ${bIdx + 1} text`} value={val?.text || ""} onChange={(e) => onUpdateCardButtonValue(card.id, tmpl.id, { text: e.target.value.slice(0, 60) })} className="h-9 w-full border-slate-200 dark:border-(--card-border-color) rounded-lg bg-(--input-color) dark:bg-(--page-body-bg) text-xs focus:border-emerald-500/50 transition-all" />
                            </CharacterCountWrapper>
                          </div>
                          {/* URL input for url type */}
                          {tmpl.type === "url" && <Input placeholder="https://example.com" value={val?.url || ""} onChange={(e) => onUpdateCardButtonValue(card.id, tmpl.id, { url: e.target.value })} className="h-9 flex-1 border-slate-200 dark:border-(--card-border-color) rounded-lg bg-(--input-color) dark:bg-(--page-body-bg) text-xs focus:border-emerald-500/50 transition-all" />}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {cards.length < 2 && <p className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">At least 2 media cards are required.</p>}
      </div>
    </div>
  );
};
