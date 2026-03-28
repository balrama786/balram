"use client";

import { Input } from "@/src/elements/ui/input";
import { FooterSectionProps } from "@/src/types/components/Template";
import CharacterCountWrapper from "@/src/shared/CharacterCountWrapper";

export const FooterSection = ({ footerText, setFooterText }: FooterSectionProps) => {
  return (
    <div className="bg-white dark:bg-(--card-color) sm:p-8 p-4 rounded-lg border border-slate-200 dark:border-(--card-border-color) shadow-sm space-y-6">
      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 tracking-tight">Template Footer (Optional)</h3>
        <p className="text-xs text-slate-500 font-medium dark:text-gray-400">Add a small footer text at the bottom of your message.</p>
      </div>
      <div className="space-y-4">
        <CharacterCountWrapper current={footerText?.length || 0} max={60}>
          <Input placeholder="Enter footer text..." value={footerText || ""} onChange={(e) => setFooterText(e.target.value.slice(0, 60))} className="h-12 border-slate-200 dark:border-(--card-border-color) rounded-lg bg-(--input-color) dark:bg-(--page-body-bg) focus:bg-white dark:focus:bg-(--page-body-bg) focus:border-emerald-500/50 transition-all font-medium" />
        </CharacterCountWrapper>
        <p className="text-[12px] text-slate-400 dark:text-gray-400">Footer text is limited to 60 characters.</p>
      </div>
    </div>
  );
};
