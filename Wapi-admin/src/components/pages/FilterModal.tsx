"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/src/elements/ui/button";
import { Label } from "@/src/elements/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/src/elements/ui/dialog";

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: { status?: string }) => void;
  currentFilters?: { status?: string };
}

const FilterModal = ({ isOpen, onClose, onApply, currentFilters = {} }: FilterModalProps) => {
  const { t } = useTranslation();
  const [statusFilter, setStatusFilter] = useState<string>(currentFilters.status || "all");

  useEffect(() => {
    if (isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStatusFilter(currentFilters.status || "all");
    }
  }, [isOpen, currentFilters]);

  const handleApply = () => {
    onApply({
      status: statusFilter !== "all" ? statusFilter : undefined,
    });
    onClose();
  };

  const handleReset = () => {
    setStatusFilter("all");
    onApply({});
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-w-[calc(100%-2rem)] bg-white dark:bg-(--card-color) dark:border-(--card-border-color)">
        <DialogHeader>
          <DialogTitle className="dark:text-white">{t("pages.filter_title", "Filter Pages")}</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="space-y-2 flex flex-col">
            <Label htmlFor="status" className="dark:text-gray-300">
              {t("common.status")}
            </Label>
            <select id="status" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full h-10 px-3 py-2 rounded-lg border border-gray-300 bg-(--input-color) text-sm focus:outline-none focus:ring-2 focus:ring-(--text-green-primary) focus:border-none dark:bg-page-body dark:border-(--card-border-color) dark:text-white dark:focus-visible:outline-none">
              <option value="all">{t("common.all")}</option>
              <option value="true">{t("common.published")}</option>
              <option value="false">{t("common.hidden")}</option>
            </select>
          </div>
        </div>
        <DialogFooter className="gap-2">
          <Button variant="outline" className="dark:bg-(--card-color) dark:hover:bg-(--dark-sidebar) dark:border-(--card-border-color) dark:text-gray-300" onClick={handleReset}>
            {t("common.reset")}
          </Button>
          <Button className="bg-(--text-green-primary) hover:bg-(--text-green-primary) text-white font-semibold" onClick={handleApply}>
            {t("common.apply_filters")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FilterModal;
