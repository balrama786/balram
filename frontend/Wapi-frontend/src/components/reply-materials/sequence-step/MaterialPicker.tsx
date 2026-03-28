/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { Search, Loader2, Check, Eye } from "lucide-react";
import { Input } from "@/src/elements/ui/input";
import { cn } from "@/src/lib/utils";
import { ReplyMaterialSourceType } from "@/src/types/sequence";

interface MaterialPickerProps {
  sourceType: ReplyMaterialSourceType;
  search: string;
  onSearchChange: (value: string) => void;
  isLoading: boolean;
  items: any[];
  selectedId: string;
  onSelect: (id: string) => void;
  onPreview?: (item: any) => void;
}

const MaterialPicker: React.FC<MaterialPickerProps> = ({ sourceType, search, onSearchChange, isLoading, items, selectedId, onSelect, onPreview }) => {
  return (
    <div className="relative mb-0">
      <div className="relative mb-3">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
        <Input value={search} onChange={(e) => onSearchChange(e.target.value)} placeholder={`Search ${sourceType.replace(/([A-Z])/g, " $1").trim()}...`} className="pl-10 h-10 rounded-xl border-slate-200 dark:border-(--card-border-color) bg-slate-50 dark:bg-(--dark-body)" />
      </div>

      <div className="grid mb-2 grid-cols-1 gap-2 max-h-56 overflow-y-auto pr-1 custom-scrollbar">
        {isLoading ? (
          <div className="py-10 flex flex-col items-center gap-2">
            <Loader2 size={24} className="animate-spin text-primary" />
            <span className="text-xs text-slate-400 font-medium">Loading items...</span>
          </div>
        ) : items.length === 0 ? (
          <div className="py-10 text-center text-xs text-slate-400 font-medium italic">No matching items found</div>
        ) : (
          items.map((item: any) => (
            <div
              key={item._id}
              role="button"
              tabIndex={0}
              onClick={() => onSelect(item._id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSelect(item._id);
                }
              }}
              className={cn("flex items-center justify-between p-3 rounded-xl border transition-all text-left cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20", selectedId === item._id ? "border-primary bg-primary/5 shadow-sm ring-1 ring-primary/10" : "border-slate-100 dark:border-(--card-border-color) hover:border-primary/30 hover:bg-slate-50/50 dark:hover:bg-(--table-hover)")}
            >
              <div className="flex-1 min-w-0 pr-3">
                <div className="font-bold text-sm text-slate-800 dark:text-white truncate">{item.name}</div>
                <div className="flex items-center gap-2 mt-0.5">
                  {item.category && <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">{item.category}</span>}
                  {onPreview && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onPreview(item);
                      }}
                      className="p-1 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-primary transition-colors cursor-pointer"
                    >
                      <Eye size={18} />
                    </button>
                  )}
                </div>
              </div>
              {selectedId === item._id ? (
                <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-white">
                  <Check size={12} strokeWidth={4} />
                </div>
              ) : (
                <div className="w-5 h-5 rounded-full border border-slate-200 dark:border-slate-700" />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MaterialPicker;
