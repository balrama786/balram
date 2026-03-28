"use client";

import { Button } from "@/src/elements/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/src/elements/ui/dialog";
import { Label } from "@/src/elements/ui/label";
import { SubscriptionFilterModalProps } from "@/src/types/components";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const FilterModal = ({ isOpen, onClose, onApply, currentFilters = {} }: SubscriptionFilterModalProps) => {
  const { t } = useTranslation();
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const handleOpenChange = (open: boolean) => {
    if (open) {
      setStatusFilter(currentFilters.status || "all");
    } else {
      onClose();
    }
  };

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
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg max-w-[calc(100%-2rem)]">
        <DialogHeader>
          <DialogTitle>{t("subscription.filter_title") || "Filter Subscriptions"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2 flex flex-col">
            <Label htmlFor="status">{t("subscription.status.label") || "Subscription Status"}</Label>
            <select id="status" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full h-10 px-3 py-2 rounded-lg border border-gray-300 dark:bg-(--card-color) dark:border-(--card-border-color)">
              <option value="all">{t("common.all_status") || "All Status"}</option>
              <option value="active">{t("subscription.status.active")}</option>
              <option value="pending">{t("subscription.status.pending")}</option>
              <option value="expired">{t("subscription.status.expired")}</option>
              <option value="canceled">{t("subscription.status.canceled")}</option>
            </select>
          </div>
        </div>

        <DialogFooter>
          <Button className="dark:bg-(--card-color) dark:hover:bg-(--table-hover) dark:border-none" variant="outline" onClick={handleReset}>
            {t("common.reset")}
          </Button>
          <Button className="dark:text-white" onClick={handleApply}>{t("subscription.apply_filters") || "Apply Filters"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FilterModal;
