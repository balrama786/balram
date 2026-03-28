/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Input } from "@/src/elements/ui/input";
import { Label } from "@/src/elements/ui/label";
import { ButtonSectionProps } from "@/src/types/components/Template";
import { Copy, FileText, Link, Plus, Smartphone, Trash2 } from "lucide-react";
import CharacterCountWrapper from "@/src/shared/CharacterCountWrapper";

export const ButtonSection = ({ interactiveType, setInteractiveType, buttons, addButton, removeButton, updateButton, interactiveActions, isLimitedTimeOffer }: ButtonSectionProps) => {
  return (
    <div className="bg-white dark:bg-(--card-color) sm:p-8 p-4 rounded-lg border border-slate-200 dark:border-(--card-border-color) shadow-sm space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 tracking-tight">Interactive Buttons</h3>
          <p className="text-xs text-slate-500 font-medium dark:text-gray-400">Add interactive buttons to your message to drive engagement.</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        {interactiveActions
          .filter((action) => (isLimitedTimeOffer ? action.value === "cta" : true))
          .map((action) => (
            <button key={action.value} type="button" onClick={() => setInteractiveType(action.value)} className={`px-5 py-2.5 rounded-lg border transition-all text-xs font-bold uppercase tracking-wider ${interactiveType === action.value ? "border-primary bg-emerald-50/50 text-primary dark:bg-(--card-color) dark:text-primary shadow-sm" : "border-slate-50 dark:border-(--card-border-color) bg-slate-50/20 dark:bg-(--dark-sidebar) dark:hover:border-(--card-border-color) text-slate-400 hover:border-slate-200"}`}>
              {action.label}
            </button>
          ))}
      </div>

      <div className="space-y-4">
        {buttons &&
          buttons.map((btn, idx) => (
            <div key={btn.id} className="sm:p-6 p-4 bg-slate-50/50 dark:bg-(--dark-body) dark:border-none border border-slate-100 dark:border-(--card-border-color) rounded-lg space-y-6 relative group animate-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white dark:bg-(--page-body-bg) flex items-center justify-center text-primary shadow-sm">{btn.type === "quick_reply" ? <FileText size={16} /> : btn.type === "url" || btn.type === "website" ? <Link size={16} /> : btn.type === "copy_code" ? <Copy size={16} /> : <Smartphone size={16} />}</div>
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest leading-none">
                    Button #{idx + 1} • {btn.type === "url" ? "URL" : btn.type.replace("_", " ")}
                  </span>
                </div>
                <button type="button" onClick={() => removeButton(btn.id)} className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100">
                  <Trash2 size={18} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-600 dark:text-gray-400">Button Title</Label>
                  <CharacterCountWrapper current={btn.text?.length || 0} max={60}>
                    <Input placeholder="Enter button text" value={btn.text || ""} onChange={(e) => updateButton(btn.id, { text: e.target.value.slice(0, 60) })} className="h-11 border-slate-200 dark:border-(--card-border-color) rounded-lg bg-(--input-color) dark:bg-(--page-body-bg) focus:border-emerald-500/50 transition-all font-medium" />
                  </CharacterCountWrapper>
                </div>

                {(btn.type === "url" || btn.type === "website") && (
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-slate-600 dark:text-gray-400">URL</Label>
                    <Input placeholder="https://example.com" value={btn.url || btn.website_url || ""} onChange={(e) => updateButton(btn.id, { url: e.target.value, website_url: e.target.value })} className="h-11 border-slate-200 dark:border-(--card-border-color) rounded-lg bg-(--input-color) dark:bg-(--page-body-bg) focus:border-emerald-500/50 transition-all font-medium" />
                  </div>
                )}

                {btn.type === "phone_call" && (
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-slate-600 dark:text-gray-400">Phone Number</Label>
                    <Input placeholder="+1 234 567 890" value={btn.phone_number || ""} onChange={(e) => updateButton(btn.id, { phone_number: e.target.value })} className="h-11 border-slate-200 dark:border-(--card-border-color) rounded-lg bg-(--input-color) dark:bg-(--page-body-bg) focus:border-emerald-500/50 transition-all font-medium" />
                  </div>
                )}

                {btn.type === "copy_code" && (
                  <div className="space-y-2">
                    <p className="text-[10px] text-slate-500 font-medium">This button text will be used as the coupon code.</p>
                  </div>
                )}
              </div>
            </div>
          ))}

        {interactiveType === "cta" && (
          <div className="flex gap-3 flex-col sm:flex-row">
            <button type="button" onClick={() => addButton("website")} className="flex-1 h-12 p-2 flex items-center justify-center gap-2 rounded-lg border-2 border-dashed border-slate-200 dark:hover:border-(--card-border-color) dark:text-amber-50 dark:border-(--card-border-color) text-slate-500 font-bold hover:border-emerald-500/50 hover:bg-emerald-50/30 dark:hover:bg-(--table-hover) transition-all text-sm">
              <Link size={16} />
              Add URL Button ({buttons?.filter((b: any) => b.type === "url").length || 0}/2)
            </button>
            {!isLimitedTimeOffer && (
              <button type="button" onClick={() => addButton("phone_call")} className="flex-1 h-12 p-2 flex items-center justify-center gap-2 rounded-lg border-2 border-dashed border-slate-200 dark:hover:border-(--card-border-color) dark:text-amber-50 dark:border-(--card-border-color) text-slate-500 font-bold hover:border-emerald-500/50 hover:bg-emerald-50/30 dark:hover:bg-(--table-hover) transition-all text-sm">
                <Smartphone size={16} />
                Add Phone Button ({buttons?.filter((b: any) => b.type === "phone_call").length || 0}/1)
              </button>
            )}
            {isLimitedTimeOffer && (
              <button type="button" onClick={() => addButton("copy_code")} className="flex-1 h-12 p-2 flex items-center justify-center gap-2 rounded-lg border-2 border-dashed border-slate-200 dark:hover:border-(--card-border-color) dark:text-amber-50 dark:border-(--card-border-color) text-slate-500 font-bold hover:border-emerald-500/50 hover:bg-emerald-50/30 dark:hover:bg-(--table-hover) transition-all text-sm">
                <Copy size={16} />
                Add Copy Code ({buttons?.filter((b: any) => b.type === "copy_code").length || 0}/1)
              </button>
            )}
          </div>
        )}

        {interactiveType === "quick_reply" && !isLimitedTimeOffer && (
          <button type="button" onClick={() => addButton("quick_reply")} className="w-full h-12 flex items-center justify-center gap-2 rounded-lg border-2 border-dashed border-slate-200 dark:hover:border-(--card-border-color) dark:text-amber-50 dark:border-(--card-border-color) text-slate-500 font-bold hover:border-emerald-500/50 hover:bg-emerald-50/30 dark:hover:bg-(--table-hover) transition-all text-sm">
            <Plus size={18} />
            Add Quick Reply ({buttons?.filter((b: any) => b.type === "quick_reply").length || 0}/10)
          </button>
        )}

        {interactiveType === "all" && !isLimitedTimeOffer && (
          <div className="flex gap-4">
            <button type="button" onClick={() => addButton("quick_reply")} className="flex-1 flex flex-col items-center gap-2 p-4 rounded-lg dark:bg-(--table-hover) dark:hover:border-(--card-border-color) border border-slate-100 dark:border-(--card-border-color) bg-slate-50/30 dark:text-amber-50 hover:border-emerald-200 transition-all font-bold text-xs text-slate-600">
              <FileText size={18} className="text-slate-400" />
              Quick Reply ({buttons?.filter((b: any) => b.type === "quick_reply").length || 0}/10)
            </button>
            <button type="button" onClick={() => addButton("website")} className="flex-1 flex flex-col items-center gap-2 p-4 rounded-lg dark:bg-(--table-hover) dark:hover:border-(--card-border-color) border border-slate-100 dark:border-(--card-border-color) bg-slate-50/30 dark:text-amber-50 hover:border-emerald-200 transition-all font-bold text-xs text-slate-600">
              <Link size={18} className="text-slate-400" />
              URL ({buttons?.filter((b: any) => b.type === "url").length || 0}/2)
            </button>
            <button type="button" onClick={() => addButton("phone_call")} className="flex-1 flex flex-col items-center gap-2 p-4 rounded-lg dark:bg-(--table-hover) dark:hover:border-(--card-border-color) border border-slate-100 dark:border-(--card-border-color) bg-slate-50/30 dark:text-amber-50 hover:border-emerald-200 transition-all font-bold text-xs text-slate-600">
              <Smartphone size={18} className="text-slate-400" />
              Phone ({buttons?.filter((b: any) => b.type === "phone_call").length || 0}/1)
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
