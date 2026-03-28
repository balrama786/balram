"use client";

import { Button } from "@/src/elements/ui/button";
import { cn } from "@/src/lib/utils";
import { WeekDay } from "@/src/types/working-hours";
import { Plus, Trash2 } from "lucide-react";
import React from "react";
import TimeInput from "./TimeInput";

interface DayRowProps {
  day: { key: WeekDay; label: string };
  state: { status: "opened" | "closed"; hours: { from: string; to: string }[] };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onChange: (s: any) => void;
}

const DayRow: React.FC<DayRowProps> = ({ day, state, onChange }) => {
  const isOpen = state.status === "opened";

  const toggleStatus = () => {
    if (isOpen) {
      onChange({ status: "closed", hours: [] });
    } else {
      onChange({ status: "opened", hours: [{ from: "09:00", to: "18:00" }] });
    }
  };

  const updateHour = (idx: number, field: "from" | "to", val: string) => {
    const newHours = [...state.hours];
    newHours[idx] = { ...newHours[idx], [field]: val };
    onChange({ ...state, hours: newHours });
  };

  const addRange = () => {
    if (state.hours.length >= 2) return;
    onChange({ ...state, hours: [...state.hours, { from: "14:00", to: "18:00" }] });
  };

  const removeRange = (idx: number) => {
    const newHours = state.hours.filter((_, i) => i !== idx);
    if (newHours.length === 0) {
      onChange({ status: "closed", hours: [] });
    } else {
      onChange({ ...state, hours: newHours });
    }
  };

  return (
    <div className={cn("rounded-xl border p-4 transition-all", isOpen ? "border-slate-200 dark:border-(--card-border-color) bg-white dark:bg-(--card-color)" : "border-slate-100 dark:border-(--card-border-color)/50 bg-slate-50/50 dark:bg-slate-900/20")}>
      <div className="flex items-start gap-4 flex-wrap">
        <div className="flex items-center gap-3 min-w-36">
          <button type="button" onClick={toggleStatus} className={cn("relative w-11 h-6 rounded-full transition-all duration-300 shrink-0", isOpen ? "bg-primary" : "bg-slate-200 dark:bg-slate-700")}>
            <span className={cn("absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-all duration-300", isOpen && "translate-x-5")} />
          </button>
          <div>
            <span className="text-sm font-bold text-slate-700 dark:text-white">{day.label}</span>
            <p className={cn("text-xs font-medium", isOpen ? "text-primary" : "text-slate-400")}>{isOpen ? "Open" : "Closed"}</p>
          </div>
        </div>

        {isOpen && (
          <div className="flex-1 space-y-2">
            {state.hours.map((range, idx) => (
              <div key={idx} className="flex items-center gap-2 flex-wrap">
                <TimeInput value={range.from} onChange={(v) => updateHour(idx, "from", v)} />
                <span className="text-slate-400 text-sm font-medium">to</span>
                <TimeInput value={range.to} onChange={(v) => updateHour(idx, "to", v)} />

                {idx === 0 && state.hours.length < 2 && (
                  <Button type="button" variant="outline" size="icon" onClick={addRange} className="h-9 w-9 border-primary text-primary hover:bg-primary/5 rounded-lg" title="Add time range">
                    <Plus size={16} />
                  </Button>
                )}

                {idx > 0 && (
                  <Button type="button" variant="outline" size="icon" onClick={() => removeRange(idx)} className="h-9 w-9 border-red-200 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg" title="Remove time range">
                    <Trash2 size={15} />
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DayRow;
