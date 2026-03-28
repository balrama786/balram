/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/src/elements/ui/button";
import { DatePicker } from "@/src/elements/ui/date-picker";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/src/elements/ui/dialog";
import { Label } from "@/src/elements/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/elements/ui/select";
import { Switch } from "@/src/elements/ui/switch";
import { useGetAgentDataQuery } from "@/src/redux/api/agentApi";
import { useGetTagsQuery } from "@/src/redux/api/tagsApi";
import { format, parse } from "date-fns";
import { Filter, X } from "lucide-react";
import { useState } from "react";

interface ChatFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: { startDate?: string; endDate?: string; tagLabel?: string; hasNotes?: boolean; agentId?: string }) => void;
  initialFilters: {
    startDate?: string;
    endDate?: string;
    tagLabel?: string;
    hasNotes?: boolean;
    agentId?: string;
  };
}

const ChatFilterModal = ({ isOpen, onClose, onApply, initialFilters }: ChatFilterModalProps) => {
  const [startDate, setStartDate] = useState(initialFilters.startDate || "");
  const [endDate, setEndDate] = useState(initialFilters.endDate || "");
  const [tagLabel, setTagLabel] = useState(initialFilters.tagLabel || "all");
  const [agentId, setAgentId] = useState(initialFilters.agentId || "all");
  const [hasNotes, setHasNotes] = useState(initialFilters.hasNotes || false);

  const { data: tagsData } = useGetTagsQuery({});
  const { data: agentsData } = useGetAgentDataQuery({ limit: 1000 });

  const handleApply = () => {
    onApply({
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      tagLabel: tagLabel === "all" ? undefined : tagLabel,
      agentId: agentId === "all" ? undefined : agentId,
      hasNotes: hasNotes || undefined,
    });
    onClose();
  };

  const handleReset = () => {
    setStartDate("");
    setEndDate("");
    setTagLabel("all");
    setAgentId("all");
    setHasNotes(false);
    onApply({});
    onClose();
  };


  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-106.25 p-0! gap-0 overflow-hidden bg-white dark:bg-(--card-color) border-none shadow-xl rounded-lg">
        <DialogHeader className="p-4 border-b border-gray-100 dark:border-(--card-border-color)">
          <DialogTitle className="flex items-center gap-2 text-lg font-bold text-primary dark:text-emerald-100">
            <Filter className="w-5 h-5 text-primary" />
            Filter Conversations
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
          {/* Tags Filter */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Tags</Label>
            <Select value={tagLabel} onValueChange={setTagLabel}>
              <SelectTrigger className="w-full h-10 bg-(--input-color) dark:bg-(--page-body-bg) border-slate-200 dark:border-none rounded-lg focus:ring-primary dark:hover:bg-(--page-body-bg)">
                <SelectValue placeholder="All Tags" />
              </SelectTrigger>
              <SelectContent className="dark:bg-(--page-body-bg)">
                <SelectItem className=" dark:hover:bg-(--card-color)" value="all">
                  All Tags
                </SelectItem>
                {tagsData?.data?.tags?.map((tag: any) => (
                  <SelectItem className=" dark:hover:bg-(--card-color)" key={tag._id} value={tag.label}>
                    {tag.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Agent Filter */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Agents</Label>
            <Select value={agentId} onValueChange={setAgentId}>
              <SelectTrigger className="w-full h-10 bg-(--input-color) dark:bg-(--page-body-bg) border-slate-200 dark:border-none rounded-lg focus:ring-primary dark:hover:bg-(--page-body-bg)">
                <SelectValue placeholder="All Agents" />
              </SelectTrigger>
              <SelectContent className="dark:bg-(--page-body-bg)">
                <SelectItem className=" dark:hover:bg-(--card-color)" value="all">
                  All Agents
                </SelectItem>
                {agentsData?.data?.agents?.map((agent: any) => (
                  <SelectItem className=" dark:hover:bg-(--card-color)" key={agent._id} value={agent._id}>
                    {agent.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date Range Filter */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Date Range</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="relative">
                <DatePicker 
                  date={startDate ? parse(startDate, 'yyyy-MM-dd', new Date()) : undefined} 
                  onChange={(date) => setStartDate(date ? format(date, 'yyyy-MM-dd') : "")} 
                  placeholder="Start date"
                />
              </div>
              <div className="relative">
                <DatePicker 
                  date={endDate ? parse(endDate, 'yyyy-MM-dd', new Date()) : undefined} 
                  onChange={(date) => setEndDate(date ? format(date, 'yyyy-MM-dd') : "")} 
                  placeholder="End date"
                />
              </div>
            </div>
          </div>

          {/* Has Notes Filter */}
          <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-(--page-body-bg) rounded-lg border border-slate-100 dark:border-none">
            <Label htmlFor="has-notes" className="text-sm font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
              Has Notes Only
            </Label>
            <Switch id="has-notes" checked={hasNotes} onCheckedChange={setHasNotes} className="data-[state=checked]:bg-primary" />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50/50 dark:bg-(--card-color) border-t border-gray-100 dark:border-(--card-border-color) flex flex-wrap gap-3">
          <Button variant="outline" onClick={handleReset} className="flex-1 h-10 rounded-lg border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-red-600 dark:bg-(--table-hover) dark:border-none dark:text-white dark:hover:bg-(--table-hover)">
            <X className="w-4 h-4 mr-2" />
            Reset Filters
          </Button>
          <Button onClick={handleApply} className="flex-1 h-10 rounded-lg bg-primary hover:bg-primary text-white shadow-lg shadow-emerald-500/20">
            Apply Filters
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ChatFilterModal;
