"use client";

import React from "react";
import { Settings2 } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { Input } from "@/src/elements/ui/input";
import { Label } from "@/src/elements/ui/label";
import { ReplyRef, DelayedReplyRef } from "@/src/types/waba-configuration";
import ReplyMaterialDropdown from "../ReplyMaterialDropdown";
import ToggleSwitch from "./ToggleSwitch";

interface ToggleConfigField {
  key: string;
  label: string;
  description: string;
  hasDelayMinutes?: boolean;
}

interface ConfigRowProps {
  field: ToggleConfigField;
  value: ReplyRef | DelayedReplyRef | null | undefined;
  enabled: boolean;
  isExpanded: boolean;
  isSaving: boolean;
  wabaId: string;
  onToggle: (enabled: boolean) => void;
  onReplyChange: (ref: ReplyRef | null) => void;
  onDelayChange?: (minutes: number) => void;
}

const ConfigRow: React.FC<ConfigRowProps> = ({ field, value, enabled, isExpanded, isSaving, wabaId, onToggle, onReplyChange, onDelayChange }) => {
  const delayMinutes = (value as DelayedReplyRef)?.delay_minutes ?? 30;

  return (
    <div className={cn("rounded-lg border transition-all duration-300", enabled ? "border-primary/20 bg-white dark:bg-(--card-color) shadow-sm" : "border-slate-400 dark:border-(--card-border-color)/50 bg-slate-50/50 dark:bg-slate-900/10")}>
      <div className={cn("flex items-center justify-between p-4 sm:p-5", !enabled && "opacity-80")}>
        <div className="flex items-start gap-3 flex-1 min-w-0 pr-4">
          <div className={cn("mt-0.5 p-2 rounded-lg transition-colors", enabled ? "bg-(--light-primary) dark:bg-(--table-hover) text-primary" : "bg-slate-200 dark:bg-(--page-body-bg) text-slate-500")}>
            <Settings2 size={15} />
          </div>
          <div className="min-w-0">
            <p className={cn("text-sm font-bold", enabled ? "text-slate-800 dark:text-white" : "text-slate-500 dark:text-slate-400")}>{field.label}</p>
            <p className="text-xs text-slate-500 dark:text-slate-500 mt-0.5 leading-relaxed">{field.description}</p>
          </div>
        </div>
        <ToggleSwitch checked={enabled} onChange={onToggle} disabled={isSaving} />
      </div>

      {enabled && isExpanded && (
        <div className="px-4 sm:px-5 pb-4 sm:pb-5 space-y-3 border-t border-slate-100 dark:border-(--card-border-color)/50 pt-4 animate-in fade-in slide-in-from-top-2 duration-200">
          {field.hasDelayMinutes && onDelayChange && (
            <div className="flex items-center gap-3">
              <Label className="text-xs font-bold text-slate-500 dark:text-gray-400 shrink-0 ">Delay (minutes)</Label>
              <Input type="number" min={1} max={10080} value={delayMinutes} onChange={(e) => onDelayChange(Number(e.target.value))} className="h-9 w-32 rounded-lg text-sm border-slate-200 dark:border-(--card-border-color) bg-slate-50 dark:bg-(--dark-body)" disabled={isSaving} />
            </div>
          )}

          <div>
            <Label className="text-xs font-bold text-slate-500 mb-2 block">Reply Material</Label>
            <ReplyMaterialDropdown value={value} onChange={onReplyChange} placeholder={`Select ${field.label.toLowerCase()} material…`} wabaId={wabaId} disabled={isSaving} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ConfigRow;
