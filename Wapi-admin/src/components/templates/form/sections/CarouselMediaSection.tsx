"use client";

import { Input } from "@/src/elements/ui/input";
import { Label } from "@/src/elements/ui/label";
import { Textarea } from "@/src/elements/ui/textarea";
import { CarouselMediaSectionProps } from "@/src/types/template";
import { Image as ImageIcon, Link, MessageSquareReply, Plus, Trash2, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useRef } from "react";
import { toast } from "sonner";

import CharacterCountWrapper from "@/src/shared/CharacterCountWrapper";

export const CarouselMediaSection = ({ buttonTemplates, cards, onAddButtonTemplate, onRemoveButtonTemplate, onAddCard, onRemoveCard, onUpdateCard, onUpdateCardButtonValue }: CarouselMediaSectionProps) => {
  const { t } = useTranslation();
  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const handleFileChange = (cardId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) return toast.error(t("templates_library.form.carousel.file_size_error"));
    onUpdateCard(cardId, { file });
  };

  return (
    <div className="bg-white dark:bg-(--card-color) p-4 sm:p-6 md:p-8 rounded-lg border border-slate-200 dark:border-(--card-border-color) shadow-sm space-y-6 sm:space-y-8">
      {/* Shared Button Structure */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 tracking-tight">{t("templates_library.form.carousel.shared_button_structure")}</h3>
          <p className="text-xs text-slate-500 font-medium dark:text-gray-400 mt-1">{t("templates_library.form.carousel.shared_button_desc")}</p>
        </div>
        <div className="space-y-2">
          {buttonTemplates.map((btn, idx) => (
            <div key={btn.id} className="flex items-center justify-between px-4 py-3 bg-slate-50/60 dark:bg-(--dark-body) border border-slate-100 dark:border-(--card-border-color) rounded-lg group">
              <div className="flex items-center gap-3">
                <span className="w-5 h-5 flex items-center justify-center rounded-full bg-primary/10 text-primary text-[10px] font-black">{idx + 1}</span>
                <div className="flex items-center gap-1.5">
                  {btn.type === "url" ? <Link size={14} className="text-sky-500" /> : <MessageSquareReply size={14} className="text-primary" />}
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{btn.type === "url" ? t("templates_library.form.carousel.url_button") : t("templates_library.form.carousel.quick_reply")}</span>
                </div>
              </div>
              <button type="button" onClick={() => onRemoveButtonTemplate(btn.id)} className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg transition-all">
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
        {buttonTemplates.length < 3 && (
          <div className="flex flex-col sm:flex-row gap-2">
            <button type="button" onClick={() => onAddButtonTemplate("url")} className="flex-1 h-10 flex items-center justify-center gap-1.5 rounded-lg border-2 border-dashed border-slate-200 dark:border-(--card-border-color) text-slate-500 hover:border-primary hover:bg-emerald-50/20 dark:hover:bg-(--table-hover) transition-all text-xs font-bold">
              <Link size={13} /> {t("templates_library.form.carousel.add_url_btn")}
            </button>
            <button type="button" onClick={() => onAddButtonTemplate("quick_reply")} className="flex-1 h-10 flex items-center justify-center gap-1.5 rounded-lg border-2 border-dashed border-slate-200 dark:border-(--card-border-color) text-slate-500 hover:border-primary hover:bg-emerald-50/20 dark:hover:bg-(--table-hover) transition-all text-xs font-bold">
              <MessageSquareReply size={13} /> {t("templates_library.form.carousel.add_quick_reply_btn")}
            </button>
          </div>
        )}
      </div>

      {/* Media Cards */}
      <div className="space-y-4 border-t border-slate-100 dark:border-(--card-border-color) pt-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200 tracking-tight">{t("templates_library.form.carousel.media_cards")}</h3>
            <p className="text-xs text-slate-500 font-medium dark:text-gray-400 mt-0.5">{t("templates_library.form.carousel.media_cards_desc")}</p>
          </div>
          <button type="button" onClick={onAddCard} disabled={cards.length >= 10} className="w-full sm:w-auto h-11 flex items-center justify-center gap-2 px-6 rounded-lg bg-primary hover:bg-emerald-700 disabled:opacity-40 text-white text-xs font-bold transition-all">
            <Plus size={14} /> {t("templates_library.form.carousel.add_media_card")}
          </button>
        </div>
        <div className="space-y-5">
          {cards.map((card, idx) => (
            <div key={card.id} className="p-5 bg-slate-50/50 dark:bg-(--dark-body) border border-slate-100 dark:border-(--card-border-color) rounded-xl space-y-5 relative group animate-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white dark:bg-page-body flex items-center justify-center text-primary shadow-sm">
                    <ImageIcon size={16} />
                  </div>
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest">{t("templates_library.form.carousel.media_card_label", { index: idx + 1 })}</span>
                </div>
                {cards.length > 2 && (
                  <button type="button" onClick={() => onRemoveCard(card.id)} className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100">
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
              <div className="space-y-2 flex flex-col">
                <Label className="text-xs font-bold text-slate-600 dark:text-gray-400">{t("templates_library.form.carousel.card_image")}</Label>
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
                        <ImageIcon size={16} className="text-primary" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-700 dark:text-slate-300 truncate max-w-40">{card.file.name}</p>
                        <p className="text-[10px] text-primary font-bold uppercase">{(card.file.size / (1024 * 1024)).toFixed(2)} MB</p>
                      </div>
                    </div>
                    <button type="button" onClick={() => onUpdateCard(card.id, { file: null })} className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg transition-all">
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div onClick={() => fileRefs.current[card.id]?.click()} className="border-2 border-dashed border-slate-200 dark:border-(--card-border-color) rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-emerald-50/20 dark:hover:bg-(--table-hover) transition-all">
                    <ImageIcon size={24} className="text-slate-300 mb-2" />
                    <p className="text-xs font-bold text-slate-400">{t("templates_library.form.carousel.click_to_upload")}</p>
                    <p className="text-[10px] text-slate-400">{t("templates_library.form.carousel.upload_hint")}</p>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold text-slate-600 dark:text-gray-400">{t("templates_library.form.carousel.card_body_text")}</Label>
                <CharacterCountWrapper current={card.body_text?.length || 0} max={200}>
                  <Textarea
                    placeholder={t("templates_library.form.carousel.describe_card")}
                    value={card.body_text || ""}
                    onChange={(e) => onUpdateCard(card.id, { body_text: e.target.value.slice(0, 200) })}
                    className="min-h-20 border-slate-200 dark:border-(--card-border-color) rounded-lg bg-(--input-color) dark:bg-page-body focus:border-emerald-500/50 transition-all font-medium resize-none"
                  />
                </CharacterCountWrapper>
              </div>
              {buttonTemplates.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-600 dark:text-gray-400">{t("templates_library.form.carousel.button_texts")}</Label>
                  <div className="space-y-2">
                    {buttonTemplates.map((tmpl, bIdx) => {
                      const val = card.buttonValues.find((v) => v.templateId === tmpl.id);
                      return (
                        <div key={tmpl.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
                          <div className="shrink-0 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-page-body border border-slate-200 dark:border-(--card-border-color)">
                            {tmpl.type === "url" ? <Link size={12} className="text-sky-500" /> : <MessageSquareReply size={12} className="text-emerald-500" />}
                            <span className="text-[10px] font-bold text-slate-500 dark:text-gray-400 whitespace-nowrap">Btn {bIdx + 1}</span>
                          </div>
                          <div className="flex-1 w-full flex flex-col xs:flex-row gap-2">
                            <CharacterCountWrapper current={val?.text?.length || 0} max={60} className="flex-1">
                              <Input
                                placeholder={t("templates_library.form.carousel.btn_placeholder", { index: bIdx + 1 })}
                                value={val?.text || ""}
                                onChange={(e) => onUpdateCardButtonValue(card.id, tmpl.id, { text: e.target.value.slice(0, 60) })}
                                className="h-10 sm:h-11 border-(--input-border-color) dark:border-(--card-border-color) rounded-lg bg-(--input-color) p-3 dark:bg-page-body text-xs focus:border-primary transition-all"
                              />
                            </CharacterCountWrapper>
                            {tmpl.type === "url" && <Input placeholder="https://example.com" value={val?.url || ""} onChange={(e) => onUpdateCardButtonValue(card.id, tmpl.id, { url: e.target.value })} className="h-10 sm:h-11 border-(--input-border-color) dark:border-(--card-border-color) rounded-lg bg-(--input-color) dark:bg-page-body p-3 text-xs focus:border-primary transition-all" />}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        {cards.length < 2 && <p className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">{t("templates_library.form.carousel.min_cards_required")}</p>}
      </div>
    </div>
  );
};
