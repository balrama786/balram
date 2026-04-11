"use client";

import { Input } from "@/src/elements/ui/input";
import { Label } from "@/src/elements/ui/label";
import { CarouselProductSectionProps } from "@/src/types/template";
import { Plus, ShoppingBag, Trash2 } from "lucide-react";
import CharacterCountWrapper from "@/src/shared/CharacterCountWrapper";

export const CarouselProductSection = ({ cards, onAddCard, onRemoveCard, onUpdateCard }: CarouselProductSectionProps) => {
  return (
    <div className="bg-white dark:bg-(--card-color) p-4 sm:p-6 rounded-lg border border-slate-200 dark:border-(--card-border-color) shadow-sm space-y-6 sm:space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1.5 sm:gap-2">
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 tracking-tight">Carousel Products</h3>
          <p className="text-xs text-slate-500 font-medium dark:text-gray-400">Add up to 10 product cards to your carousel.</p>
        </div>
        <button type="button" onClick={onAddCard} disabled={cards.length >= 10} className="w-full sm:w-auto h-11 flex items-center justify-center gap-2 px-6 rounded-lg bg-emerald-50 dark:bg-primary/10 text-primary dark:text-primary font-bold hover:bg-emerald-100 transition-all text-xs uppercase tracking-widest border border-emerald-200/50 dark:border-primary/20 disabled:opacity-50">
          <Plus size={16} /> Add Product Card
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {cards.map((card, idx) => (
          <div key={card.id} className="p-5 bg-slate-50/50 dark:bg-(--dark-body) border border-slate-100 dark:border-none rounded-lg space-y-4 relative group animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white dark:bg-page-body flex items-center justify-center text-primary shadow-sm">
                  <ShoppingBag size={16} />
                </div>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest">Product Card #{idx + 1}</span>
              </div>
              {cards.length > 2 && (
                <button type="button" onClick={() => onRemoveCard(card.id)} className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100">
                  <Trash2 size={16} />
                </button>
              )}
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-100 dark:bg-page-body border border-(--input-border-color) dark:border-none">
              <div className="w-10 h-10 rounded-lg bg-white dark:bg-(--dark-body) flex items-center justify-center shrink-0">
                <ShoppingBag size={18} className="text-slate-400" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">Product Header</p>
                <p className="text-[10px] text-slate-400 dark:text-gray-500">The product image is linked via the product catalog dynamically.</p>
              </div>
            </div>
            <div className="space-y-2 flex flex-col">
              <Label className="text-xs font-bold text-slate-600 dark:text-gray-400">Button Text</Label>
              <CharacterCountWrapper current={card.button_text?.length || 0} max={60} showCounter={false}>
                <Input placeholder="e.g. View" value={card.button_text || "View"} disabled className="h-11 border-(--input-border-color) p-3 dark:border-(--card-border-color) rounded-lg bg-(--input-color) dark:bg-page-body opacity-70 cursor-not-allowed transition-all font-medium" />
              </CharacterCountWrapper>
            </div>
          </div>
        ))}
      </div>
      {cards.length < 2 && <p className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">At least 2 product cards are required.</p>}
    </div>
  );
};
