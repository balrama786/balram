"use client";

import { Input } from "@/src/elements/ui/input";
import { Label } from "@/src/elements/ui/label";
import { CarouselProductSectionProps } from "@/src/types/components/Template";
import { Plus, ShoppingBag, Trash2 } from "lucide-react";

export const CarouselProductSection = ({ cards, onAddCard, onRemoveCard, onUpdateCard }: CarouselProductSectionProps) => {
  return (
    <div className="bg-white dark:bg-(--card-color) sm:p-8 p-4 rounded-lg border border-slate-200 dark:border-(--card-border-color) shadow-sm space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 tracking-tight">Product Cards</h3>
          <p className="text-xs text-slate-500 font-medium dark:text-gray-400">Add product cards (min 2, max 10). Each card will show a product image and a button.</p>
        </div>
        <button type="button" onClick={onAddCard} disabled={cards.length >= 10} className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-emerald-700 disabled:opacity-40 text-white rounded-lg text-xs font-bold transition-all">
          <Plus size={14} />
          Add Card
        </button>
      </div>

      <div className="space-y-4">
        {cards.map((card, idx) => (
          <div key={card.id} className="p-5 bg-slate-50/50 dark:bg-(--dark-body) border border-slate-100 dark:border-(--card-border-color) rounded-lg space-y-4 relative group animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white dark:bg-(--page-body-bg) flex items-center justify-center text-primary shadow-sm">
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

            {/* Product image placeholder notice */}
            <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-100 dark:bg-(--page-body-bg) border border-slate-200 dark:border-(--card-border-color)">
              <div className="w-10 h-10 rounded-lg bg-white dark:bg-(--card-color) flex items-center justify-center shrink-0">
                <ShoppingBag size={18} className="text-slate-400" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">Product Header</p>
                <p className="text-[10px] text-slate-400 dark:text-gray-500">The product image is linked via the product catalog dynamically.</p>
              </div>
            </div>

            {/* Button text */}
            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-600 dark:text-gray-400">Button Text</Label>
              <Input placeholder="View" value="View" readOnly className="h-11 border-slate-200 dark:border-(--card-border-color) rounded-lg bg-slate-100 dark:bg-(--dark-sidebar) cursor-not-allowed font-medium" />
              <p className="text-[10px] text-slate-400">This button text is fixed to &quot;View&quot; for product cards.</p>
            </div>
          </div>
        ))}
      </div>

      {cards.length < 2 && <p className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">At least 2 product cards are required.</p>}
    </div>
  );
};
