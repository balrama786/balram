"use client";

import { Button } from "@/src/elements/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/src/elements/ui/dialog";
import { Label } from "@/src/elements/ui/label";
import { useEffect, useState } from "react";
import { SECTOR_LABELS, SectorKey, SECTOR_TEMPLATE_CATEGORIES } from "@/src/data/sectorTemplateCategory";

interface TemplateFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: { sector?: string; template_category?: string; status?: string }) => void;
  currentFilters: { sector?: string; template_category?: string; status?: string };
}

const SECTORS_LIST = ["healthcare", "ecommerce", "fashion", "financial_service", "general"] as const;

const TemplateFilterModal = ({ isOpen, onClose, onApply, currentFilters = {} }: TemplateFilterModalProps) => {
  const [sectorFilter, setSectorFilter] = useState<string>(currentFilters.sector || "all");
  const [templateCategoryFilter, setTemplateCategoryFilter] = useState<string>(currentFilters.template_category || "all");
  const [statusFilter, setStatusFilter] = useState<string>(currentFilters.status || "all");

  useEffect(() => {
    if (isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSectorFilter(currentFilters.sector || "all");
      setTemplateCategoryFilter(currentFilters.template_category || "all");
      setStatusFilter(currentFilters.status || "all");
    }
  }, [isOpen, currentFilters]);

  useEffect(() => {
    if (sectorFilter === "all") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTemplateCategoryFilter("all");
    } else {
      const allowedCategories = SECTOR_TEMPLATE_CATEGORIES[sectorFilter as SectorKey] || [];
      if (templateCategoryFilter !== "all" && !allowedCategories.includes(templateCategoryFilter)) {
        setTemplateCategoryFilter("all");
      }
    }
  }, [sectorFilter, templateCategoryFilter]);

  const handleApply = () => {
    onApply({
      sector: sectorFilter !== "all" ? sectorFilter : undefined,
      template_category: templateCategoryFilter !== "all" ? templateCategoryFilter : undefined,
      status: statusFilter !== "all" ? statusFilter : undefined,
    });
    onClose();
  };

  const handleReset = () => {
    setSectorFilter("all");
    setTemplateCategoryFilter("all");
    setStatusFilter("all");
    onApply({});
    onClose();
  };

  const availableCategories = sectorFilter !== "all" ? SECTOR_TEMPLATE_CATEGORIES[sectorFilter as SectorKey] || [] : [];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-w-[calc(100%-2rem)] rounded-lg dark:bg-(--card-color)">
        <DialogHeader>
          <DialogTitle>Filter Templates</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="space-y-2 flex flex-col">
            <Label htmlFor="sector">Sector</Label>
            <select id="sector" value={sectorFilter} onChange={(e) => setSectorFilter(e.target.value)} className="w-full h-10 dark:bg-page-body dark:border-(--card-border-color) px-3 py-2 rounded-lg border border-gray-300 bg-(--input-color) text-sm focus:outline-none focus:ring-2 focus:ring-(--text-green-primary) focus:border-none">
              <option value="all">All Sectors</option>
              {SECTORS_LIST.map((s) => (
                <option key={s} value={s}>
                  {SECTOR_LABELS[s as SectorKey]}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2 flex flex-col">
            <Label htmlFor="template_category">Category</Label>
            <select id="template_category" value={templateCategoryFilter} onChange={(e) => setTemplateCategoryFilter(e.target.value)} disabled={sectorFilter === "all"} className="w-full h-10 dark:bg-page-body dark:border-(--card-border-color) px-3 py-2 rounded-lg border border-gray-300 bg-(--input-color) text-sm focus:outline-none focus:ring-2 focus:ring-(--text-green-primary) focus:border-none disabled:opacity-50 disabled:cursor-not-allowed">
              <option value="all">All Categories</option>
              {availableCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2 flex flex-col">
            <Label htmlFor="status">Status</Label>
            <select id="status" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full h-10 px-3 py-2 dark:bg-page-body dark:border-(--card-border-color) rounded-lg border border-gray-300 bg-(--input-color) text-sm focus:outline-none focus:ring-2 focus:ring-(--text-green-primary) focus:border-none">
              <option value="all">All Statuses</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" className="dark:bg-(--card-color) dark:hover:bg-(--dark-sidebar)" onClick={handleReset}>
            Reset
          </Button>
          <Button onClick={handleApply} className="dark:text-white">
            Apply Filters
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TemplateFilterModal;
