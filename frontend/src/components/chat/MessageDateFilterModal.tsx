"use client";

import { Button } from "@/src/elements/ui/button";
import { DatePicker } from "@/src/elements/ui/date-picker";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/src/elements/ui/dialog";
import { Label } from "@/src/elements/ui/label";
import { format, parse } from "date-fns";
import { Filter, X } from "lucide-react";
import { useState } from "react";

interface MessageDateFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: { startDate?: string; endDate?: string }) => void;
  initialFilters: { startDate?: string; endDate?: string };
}

const MessageDateFilterModal = ({ isOpen, onClose, onApply, initialFilters }: MessageDateFilterModalProps) => {
  const [startDate, setStartDate] = useState(initialFilters.startDate || "");
  const [endDate, setEndDate] = useState(initialFilters.endDate || "");

  const handleApply = () => {
    onApply({
      startDate: startDate || undefined,
      endDate: endDate || undefined,
    });
    onClose();
  };

  const handleReset = () => {
    setStartDate("");
    setEndDate("");
    onApply({});
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-96 p-0! gap-0 overflow-hidden bg-white dark:bg-(--card-color) dark:border-(--card-border-color) shadow-xl rounded-lg">
        <DialogHeader className="p-4 border-b border-gray-100 dark:border-(--card-border-color)">
          <DialogTitle className="flex items-center gap-2 text-lg font-bold text-primary">
            <Filter className="w-5 h-5 text-primary" />
            Filter Messages
            <Button
              onClick={() => {
                onClose();
              }}
              className="p-1 hover:bg-gray-100 bg-gray-50 dark:bg-transparent dark:hover:bg-(--table-hover) rounded-lg transition-colors absolute right-4 top-4"
            >
              <X size={20} className="dark:text-amber-50 text-slate-500" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="p-6 space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Start Date</Label>
              <DatePicker 
                date={startDate ? parse(startDate, 'yyyy-MM-dd', new Date()) : undefined} 
                onChange={(date) => setStartDate(date ? format(date, 'yyyy-MM-dd') : "")} 
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">End Date</Label>
              <DatePicker 
                date={endDate ? parse(endDate, 'yyyy-MM-dd', new Date()) : undefined} 
                onChange={(date) => setEndDate(date ? format(date, 'yyyy-MM-dd') : "")} 
              />
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50/50 dark:bg-(--card-color) border-t border-gray-100 dark:border-(--card-border-color) flex gap-3">
          <Button variant="outline" onClick={handleReset} className="flex-1 h-10 rounded-lg border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700 dark:border-(--card-border-color) dark:text-rose-400 dark:hover:bg-(--table-hover)">
            <X className="w-4 h-4 mr-2" />
            Reset
          </Button>
          <Button onClick={handleApply} className="flex-1 h-10 rounded-lg bg-primary   text-white shadow-lg shadow-emerald-500/20">
            Apply Filters
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MessageDateFilterModal;
