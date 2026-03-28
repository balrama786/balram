"use client";

import React from "react";
import { Clock } from "lucide-react";
import { Input } from "@/src/elements/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/elements/ui/select";
import { DelayUnit } from "@/src/types/sequence";

interface TimingConfigProps {
  delayValue: number;
  onDelayValueChange: (value: number) => void;
  delayUnit: DelayUnit;
  onDelayUnitChange: (value: DelayUnit) => void;
}

const DELAY_UNITS: { label: string; value: DelayUnit }[] = [
  { label: "Minutes", value: "minutes" },
  { label: "Hours", value: "hours" },
  { label: "Days", value: "days" },
];

const TimingConfig: React.FC<TimingConfigProps> = ({ delayValue, onDelayValueChange, delayUnit, onDelayUnitChange }) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-1.5 flex flex-col">
        <label className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
          <Clock size={12} /> Delay Value
        </label>
        <Input type="number" min={0} value={delayValue} onChange={(e) => onDelayValueChange(parseInt(e.target.value) || 0)} className="h-10 rounded-lg bg-slate-50 dark:bg-(--dark-body) border-slate-100 dark:border-slate-800" />
      </div>
      <div className="space-y-1.5">
        <label className="text-[10px] font-bold text-slate-400 px-1">Unit</label>
        <Select value={delayUnit} onValueChange={(v: DelayUnit) => onDelayUnitChange(v)}>
          <SelectTrigger className="h-10 rounded-lg bg-slate-50 dark:bg-(--dark-body) border-slate-100 dark:border-(--card-border-color)">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {DELAY_UNITS.map((u) => (
              <SelectItem key={u.value} value={u.value}>
                {u.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default TimingConfig;
