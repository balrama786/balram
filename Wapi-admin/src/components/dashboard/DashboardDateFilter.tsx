"use client";

import * as React from "react";
import { format, startOfMonth } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";
import { Button } from "@/src/elements/ui/button";
import { Calendar } from "@/src/elements/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/elements/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/elements/ui/select";
import { cn } from "@/lib/utils";

interface DashboardDateFilterProps {
  onFilterChange: (params: { dateRange: string; startDate?: string; endDate?: string }) => void;
}

const presets = [
  { label: "Today", value: "today" },
  { label: "This Week", value: "this_week" },
  { label: "This Month", value: "this_month" },
  { label: "This Year", value: "this_year" },
  { label: "Custom", value: "custom" },
];

export function DashboardDateFilter({ onFilterChange }: DashboardDateFilterProps) {
  const [dateRange, setDateRange] = React.useState<string>("this_month");
  const [customRange, setCustomRange] = React.useState<DateRange | undefined>({
    from: startOfMonth(new Date()),
    to: new Date(),
  });

  const handlePresetChange = (value: string) => {
    setDateRange(value);
    if (value !== "custom") {
      onFilterChange({ dateRange: value });
    } else if (customRange?.from && customRange?.to) {
      onFilterChange({
        dateRange: value,
        startDate: format(customRange.from, "yyyy-MM-dd"),
        endDate: format(customRange.to, "yyyy-MM-dd"),
      });
    }
  };

  const handleCustomRangeChange = (range: DateRange | undefined) => {
    setCustomRange(range);
    if (range?.from && range?.to) {
      onFilterChange({
        dateRange: "custom",
        startDate: format(range.from, "yyyy-MM-dd"),
        endDate: format(range.to, "yyyy-MM-dd"),
      });
    }
  };

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <Select value={dateRange} onValueChange={handlePresetChange}>
        <SelectTrigger className="w-[140px] h-11 bg-white dark:bg-(--card-color) border-(--input-border-color) dark:border-(--card-border-color) rounded-lg font-semibold text-sm tracking-tight transition-all">
          <SelectValue placeholder="Range" />
        </SelectTrigger>
        <SelectContent className="dark:bg-(--card-color) border-(--input-border-color) dark:border-(--card-border-color) rounded-xl shadow-xl">
          {presets.map((preset) => (
            <SelectItem key={preset.value} value={preset.value} className="font-bold text-xs uppercase tracking-tighter rounded-lg m-1">
              {preset.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {dateRange === "custom" && (
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "h-11 justify-start text-left font-black text-xs border-(--input-border-color) dark:border-(--card-border-color) rounded-lg bg-white dark:bg-(--card-color) min-w-[220px] uppercase tracking-tighter shadow-sm hover:shadow-md transition-all hover:border-primary/50",
                !customRange && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
              {customRange?.from ? (
                customRange.to ? (
                  <span className="text-slate-700 dark:text-slate-200">
                    {format(customRange.from, "LLL dd, y")} -{" "}
                    {format(customRange.to, "LLL dd, y")}
                  </span>
                ) : (
                  <span className="text-slate-700 dark:text-slate-200">{format(customRange.from, "LLL dd, y")}</span>
                )
              ) : (
                <span>Pick a date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 dark:bg-(--card-color) border-(--input-border-color) dark:border-(--card-border-color) rounded-xl shadow-2xl" align="end">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={customRange?.from}
              selected={customRange}
              onSelect={handleCustomRangeChange}
              numberOfMonths={1}
            />
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
}
