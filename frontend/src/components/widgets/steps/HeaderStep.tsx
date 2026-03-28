"use client";

import { Label } from "@/src/elements/ui/label";
import { ColorRow } from "./ColorRow";
import { StepProps } from "./widget-types";

export const HeaderStep = ({ data, onChange }: StepProps) => (
  <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-300">
    <div className="space-y-1.5">
      <Label className="text-xs font-semibold text-slate-500 dark:text-slate-400 tracking-wider">Header Title Text</Label>
      <input value={data.header_text || ""} onChange={(e) => onChange("header_text", e.target.value)} placeholder="e.g. Chat with us" className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-(--card-border-color) bg-slate-50 dark:bg-(--page-body-bg) text-slate-800 dark:text-slate-100 text-sm font-medium outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-slate-400 placeholder:font-normal" />
    </div>

    <ColorRow label="Header Background" value={data.header_background_color} onChange={(v) => onChange("header_background_color", v)} fallback="#8dd6d9" />
    <ColorRow label="Header Text Color" value={data.header_text_color} onChange={(v) => onChange("header_text_color", v)} fallback="#cec3e6" />
  </div>
);
