/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/src/elements/ui/dialog";
import { Button } from "@/src/elements/ui/button";
import { toast } from "sonner";
import { Loader2, Clock, AlertCircle } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { useGetWorkingHoursQuery, useUpsertWorkingHoursMutation } from "@/src/redux/api/workingHoursApi";
import { DaySchedule, WeekDay, WorkingHoursPayload } from "@/src/types/working-hours";

import DayRow from "./working-hours/DayRow";
import Toggle from "./working-hours/Toggle";

interface WorkingHoursModalProps {
  open: boolean;
  onClose: () => void;
  wabaId: string;
}

type DayState = { status: "opened" | "closed"; hours: { from: string; to: string }[] };
type WeekState = Record<WeekDay, DayState>;

const WEEK_DAYS: { key: WeekDay; label: string; short: string }[] = [
  { key: "monday", label: "Monday", short: "MON" },
  { key: "tuesday", label: "Tuesday", short: "TUE" },
  { key: "wednesday", label: "Wednesday", short: "WED" },
  { key: "thursday", label: "Thursday", short: "THU" },
  { key: "friday", label: "Friday", short: "FRI" },
  { key: "saturday", label: "Saturday", short: "SAT" },
  { key: "sunday", label: "Sunday", short: "SUN" },
];

const DEFAULT_DAY: DayState = { status: "opened", hours: [{ from: "09:00", to: "18:00" }] };
const CLOSED_DAY: DayState = { status: "closed", hours: [] };

const DEFAULT_WEEK: WeekState = {
  monday: { ...DEFAULT_DAY },
  tuesday: { ...DEFAULT_DAY },
  wednesday: { ...DEFAULT_DAY },
  thursday: { ...DEFAULT_DAY },
  friday: { ...DEFAULT_DAY },
  saturday: { ...CLOSED_DAY },
  sunday: { ...CLOSED_DAY },
};

const WorkingHoursModal: React.FC<WorkingHoursModalProps> = ({ open, onClose, wabaId }) => {
  const [weekState, setWeekState] = useState<WeekState>(DEFAULT_WEEK);
  const [isHolidayMode, setIsHolidayMode] = useState(false);
  const initializedWabaId = useRef<string | null>(null);

  const { data, isLoading: isFetching } = useGetWorkingHoursQuery(wabaId, {
    skip: !open || !wabaId,
  });

  const [upsert, { isLoading: isSaving }] = useUpsertWorkingHoursMutation();

  useEffect(() => {
    if (open && data?.data && initializedWabaId.current !== wabaId) {
      const d = data.data;
      setIsHolidayMode(d.is_holiday_mode ?? false);

      const newState = { ...DEFAULT_WEEK };
      WEEK_DAYS.forEach(({ key }) => {
        const saved = d[key] as DaySchedule | undefined;
        if (saved) {
          newState[key] = {
            status: saved.status as "opened" | "closed",
            hours: saved.hours?.map((h) => ({ from: h.from, to: h.to })) || [],
          };
        }
      });
      setWeekState(newState);
      initializedWabaId.current = wabaId;
    }
  }, [data, open, wabaId]);

  useEffect(() => {
    if (!open) {
      setWeekState(DEFAULT_WEEK);
      setIsHolidayMode(false);
      initializedWabaId.current = null;
    }
  }, [open]);

  const updateDay = useCallback((key: WeekDay, s: DayState) => {
    setWeekState((prev) => ({ ...prev, [key]: s }));
  }, []);

  const handleSave = async () => {
    const payload: WorkingHoursPayload = {
      waba_id: wabaId,
      is_holiday_mode: isHolidayMode,
    };
    WEEK_DAYS.forEach(({ key }) => {
      payload[key] = weekState[key];
    });

    try {
      await upsert(payload).unwrap();
      toast.success("Working hours saved successfully");
      onClose();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to save working hours");
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-2xl! max-w-[calc(100%-2rem)]! dark:bg-(--card-color) dark:border-(--card-border-color) max-h-[90vh] flex flex-col p-0! gap-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-slate-100 dark:border-(--card-border-color) shrink-0">
          <DialogTitle className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <Clock size={18} className="text-primary" />
            </div>
            Working Hours
          </DialogTitle>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Configure your business hours. Messages outside these hours will trigger the out-of-hours reply.</p>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto custom-scrollbar sm:px-6 px-4 py-5 space-y-5">
          <div className={cn("flex [@media(max-width:475px)]:flex-wrap gap-2 items-center justify-between p-4 rounded-lg border transition-all", isHolidayMode ? "bg-amber-50 border-amber-200 dark:bg-amber-500/10 dark:border-amber-500/30" : "bg-slate-50 border-slate-200 dark:bg-(--page-body-bg) dark:border-(--card-border-color)")}>
            <div className="flex items-start gap-3">
              <div className={cn("mt-0.5", isHolidayMode ? "text-amber-500" : "text-slate-400")}>
                <AlertCircle size={18} />
              </div>
              <div>
                <p className={cn("text-sm font-bold", isHolidayMode ? "text-amber-700 dark:text-amber-400" : "text-slate-700 dark:text-white")}>Holiday Mode</p>
                <p className={cn("text-xs mt-0.5", isHolidayMode ? "text-amber-600 dark:text-amber-400/80" : "text-slate-400")}>When enabled, all incoming messages will be treated as out-of-hours regardless of schedule</p>
              </div>
            </div>
            <Toggle checked={isHolidayMode} onChange={setIsHolidayMode} />
          </div>

          {
            // eslint-disable-next-line react-hooks/refs
            isFetching && !initializedWabaId.current ? (
              <div className="flex flex-col items-center gap-3 py-16 text-slate-400">
                <Loader2 size={32} className="animate-spin text-primary" />
                <span className="text-sm">Loading saved hours…</span>
              </div>
            ) : (
              <div className="space-y-3">
                {WEEK_DAYS.map((day) => (
                  <DayRow key={day.key} day={day} state={weekState[day.key]} onChange={(s) => updateDay(day.key, s)} />
                ))}
              </div>
            )
          }
        </div>

        {/* Footer */}
        <div className="flex items-center flex-wrap justify-end gap-3 px-6 py-4 border-t border-slate-100 dark:border-(--card-border-color) shrink-0">
          <Button variant="outline" onClick={onClose} disabled={isSaving} className="h-10 px-5 rounded-xl font-semibold">
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving || isFetching} className="h-10 px-6 rounded-xl bg-primary text-white font-semibold shadow-md shadow-primary/20 active:scale-95 transition-all">
            {isSaving ? (
              <>
                <Loader2 size={16} className="animate-spin mr-2" />
                Saving…
              </>
            ) : (
              "Save Working Hours"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WorkingHoursModal;
