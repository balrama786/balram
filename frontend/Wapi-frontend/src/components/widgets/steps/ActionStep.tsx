"use client";

import { Label } from "@/src/elements/ui/label";
import { ColorRow } from "./ColorRow";
import { StepProps } from "./widget-types";

export const ActionStep = ({ data, onChange }: StepProps) => (
  <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-300">
    <div className="space-y-1.5">
      <Label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Button Label</Label>
      <input value={data.start_chat_button_text || ""} onChange={(e) => onChange("start_chat_button_text", e.target.value)} placeholder="e.g. Start Chat" className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-none bg-slate-50 dark:bg-(--page-body-bg) text-slate-800 dark:text-slate-100 text-sm font-medium outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-slate-400 placeholder:font-normal" />
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <ColorRow label="Button Background" value={data.start_chat_button_background} onChange={(v) => onChange("start_chat_button_background", v)} fallback="#526161" />
      <ColorRow label="Button Text Color" value={data.start_chat_button_text_color} onChange={(v) => onChange("start_chat_button_text_color", v)} fallback="#c9f0f0" />
    </div>

    <div className="space-y-1.5">
      <Label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Pre-filled WhatsApp Message</Label>
      <input value={data.default_user_message || ""} onChange={(e) => onChange("default_user_message", e.target.value)} placeholder="e.g. Hi, I need help !!" className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-(--card-border-color) bg-slate-50 dark:bg-(--page-body-bg) text-slate-800 dark:text-slate-100 text-sm font-medium outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-slate-400 placeholder:font-normal" />
      <p className="text-xs text-slate-400 pl-1">{"Message auto-filled in user's WhatsApp when they click Start Chat"}</p>
    </div>
  </div>
);
