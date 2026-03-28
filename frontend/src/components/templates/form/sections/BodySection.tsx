"use client";

import { Input } from "@/src/elements/ui/input";
import { Label } from "@/src/elements/ui/label";
import CkEditor from "@/src/shared/CkEditor";
import { BodySectionProps } from "@/src/types/components/Template";
import { Plus } from "lucide-react";
import CharacterCountWrapper from "@/src/shared/CharacterCountWrapper";

export const BodySection = ({ messageBody, handleBodyChange, addVariable, setEditor, variables_example, updateVariable }: BodySectionProps) => {
  return (
    <div className="bg-white dark:bg-(--card-color) sm:p-8 p-4 rounded-lg border border-slate-200 dark:border-(--card-border-color) shadow-sm space-y-8">
      <div className="flex flex-col gap-2 mb-3">
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 tracking-tight">Message Body</h3>
        <p className="text-xs text-slate-500 font-medium dark:text-gray-400">This is the main content of your message. Use {"{{1}}"} to add variables.</p>
        <p className="text-xs text-slate-500 font-medium dark:text-gray-400">{"Variable parameters must be whole numbers with two sets of curly brackets (for example, {{1}}, {{2}}) ."}</p>
      </div>

      <div className="space-y-4">
        <CharacterCountWrapper current={messageBody?.replace(/<[^>]*>/g, "")?.length || 0} max={1600}>
          <div className="relative group rounded-lg overflow-hidden border-2 border-slate-100 dark:border-(--card-border-color) focus-within:border-emerald-500/30 transition-all shadow-sm">
            <CkEditor value={messageBody} onChange={handleBodyChange} onReady={setEditor} placeholder="Type your message here..." minHeight="200px" />
            <div className="p-3 bg-slate-50/50 dark:bg-(--table-hover) border-t border-slate-100 dark:border-(--card-border-color) flex flex-wrap gap-3 sm:gap-0 items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none">Rich Text Editor</span>
              </div>
              <button type="button" onClick={addVariable} className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-(--dark-sidebar) border border-slate-200 dark:border-(--card-border-color) rounded-lg text-[10px] font-bold text-emerald-600 dark:text-primary hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-(--table-hover) transition-all shadow-sm uppercase tracking-wider">
                <Plus size={12} />
                Add Variable
              </button>
            </div>
          </div>
        </CharacterCountWrapper>
        <p className="text-[11px] text-slate-400 font-medium italic">
          Example: <span className="text-slate-500 dark:text-gray-400">{`Hello ${"{{1}}"}`}</span>, <span className="text-slate-500 dark:text-gray-400">{`welcome your store.`}</span>
        </p>
      </div>

      {variables_example.length > 0 && (
        <div className="space-y-4 pt-6 border-t border-slate-50 dark:border-(--card-border-color) animate-in fade-in slide-in-from-top-2 duration-300">
          <Label className="text-sm font-bold text-slate-700 dark:text-slate-300">Variable Examples</Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {variables_example.map((variable, index) => (
              <div key={variable.key} className="p-4 rounded-lg border border-slate-100 dark:border-(--card-border-color) bg-slate-50/50 dark:bg-(--dark-sidebar) space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-primary uppercase tracking-widest leading-none">Variable {"{{" + variable.key + "}}"}</span>
                </div>
                <Input placeholder={`Example for ${variable.key}`} value={variable.example} onChange={(e) => updateVariable(index, e.target.value)} className="h-10 border-slate-200 dark:border-(--card-border-color) rounded-lg bg-white dark:bg-(--page-body-bg) text-sm focus:border-emerald-500/50 transition-all" />
              </div>
            ))}
          </div>
          <p className="text-[11px] text-slate-400 mt-2 font-medium italic">{"Provide realistic examples for Meta's review process."}</p>
        </div>
      )}
    </div>
  );
};
