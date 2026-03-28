"use client";

import React from "react";
import { CalendarDays } from "lucide-react";
import { Checkbox } from "@/src/elements/ui/checkbox";
import { Input } from "@/src/elements/ui/input";
import { cn } from "@/src/lib/utils";
import { SendDay } from "@/src/types/sequence";

interface SchedulingConfigProps {
  sendAnytime: boolean;
  onSendAnytimeChange: (value: boolean) => void;
  fromTime: string;
  onFromTimeChange: (value: string) => void;
  toTime: string;
  onToTimeChange: (value: string) => void;
  sendDays: SendDay[];
  onSendDaysChange: (days: SendDay[]) => void;
}

const WEEK_DAYS: { label: string; value: SendDay }[] = [
  { label: "Mon", value: "monday" },
  { label: "Tue", value: "tuesday" },
  { label: "Wed", value: "wednesday" },
  { label: "Thu", value: "thursday" },
  { label: "Fri", value: "friday" },
  { label: "Sat", value: "saturday" },
  { label: "Sun", value: "sunday" },
];

const SchedulingConfig: React.FC<SchedulingConfigProps> = ({ sendAnytime, onSendAnytimeChange, fromTime, onFromTimeChange, toTime, onToTimeChange, sendDays, onSendDaysChange }) => {
  const handleDayToggle = (day: SendDay) => {
    onSendDaysChange(sendDays.includes(day) ? sendDays.filter((d) => d !== day) : [...sendDays, day]);
  };

  return (
    <div className="space-y-4 pt-2">
      <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-(--dark-body) rounded-lg border border-slate-100 dark:border-(--card-border-color)">
        <div className="flex flex-col">
          <span className="text-sm font-bold text-slate-800 dark:text-white">Send Anytime</span>
          <span className="text-[10px] text-slate-400 font-medium">Ignore specific hours and days</span>
        </div>
        <Checkbox checked={sendAnytime} onCheckedChange={(checked) => onSendAnytimeChange(!!checked)} className="w-5 h-5 rounded-md border-2 border-slate-200 data-[state=checked]:bg-primary data-[state=checked]:border-primary" />
      </div>

      {!sendAnytime && (
        <div className="space-y-5 animate-in slide-in-from-top-2 duration-300">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5 flex flex-col">
              <label className="text-[10px] font-bold text-slate-400">From Time</label>
              <Input type="time" value={fromTime} onChange={(e) => onFromTimeChange(e.target.value)} className="h-10 rounded-xl" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400">To Time</label>
              <Input type="time" value={toTime} onChange={(e) => onToTimeChange(e.target.value)} className="h-10 rounded-xl" />
            </div>
          </div>
          <div className="space-y-2 flex flex-col">
            <label className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
              <CalendarDays size={12} /> Allowed Days
            </label>
            <div className="flex flex-wrap gap-2">
              {WEEK_DAYS.map((day) => (
                <button key={day.value} type="button" onClick={() => handleDayToggle(day.value)} className={cn("px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-all", sendDays.includes(day.value) ? "bg-primary text-white border-primary shadow-sm" : "bg-white dark:bg-slate-800 text-slate-500 border-slate-100 dark:border-slate-700 hover:border-primary/40")}>
                  {day.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SchedulingConfig;
