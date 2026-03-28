"use client";

import { Button } from "@/src/elements/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/elements/ui/dialog";
import { Label } from "@/src/elements/ui/label";
import { FilterModalProps } from "@/src/types/components";
import { useEffect, useState } from "react";

const FilterModal = ({
  isOpen,
  onClose,
  onApply,
  currentFilters = {},
}: FilterModalProps) => {
  const [statusFilter, setStatusFilter] = useState<string>(
    currentFilters.status || "all"
  );
  const [ratingFilter, setRatingFilter] = useState<string>(
    currentFilters.rating || "all"
  );

  useEffect(() => {
    if (isOpen) {
      setStatusFilter(currentFilters.status || "all");
      setRatingFilter(currentFilters.rating || "all");
    }
  }, [isOpen, currentFilters]);

  const handleApply = () => {
    onApply({
      status: statusFilter !== "all" ? statusFilter : undefined,
      rating: ratingFilter !== "all" ? ratingFilter : undefined,
    });
    onClose();
  };

  const handleReset = () => {
    setStatusFilter("all");
    setRatingFilter("all");
    onApply({});
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-w-[calc(100%-2rem)]">
        <DialogHeader>
          <DialogTitle>Filter Testimonials</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="space-y-2 flex flex-col">
            <Label htmlFor="status">Status</Label>
            <select id="status" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full h-10 dark:bg-(--card-color) dark:border-(--card-border-color) px-3 py-2 rounded-lg border border-gray-300 bg-(--input-color) text-sm focus:outline-none focus:ring-2 focus:ring-(--text-green-primary) focus:border-none">
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="hidden">Hidden</option>
            </select>
          </div>

          <div className="space-y-2 flex flex-col">
            <Label htmlFor="rating">Rating</Label>
            <select id="rating" value={ratingFilter} onChange={(e) => setRatingFilter(e.target.value)} className="w-full h-10 px-3 py-2 dark:bg-(--card-color) dark:border-(--card-border-color) rounded-lg border border-gray-300 bg-(--input-color) text-sm focus:outline-none focus:ring-2 focus:ring-(--text-green-primary) focus:border-none">
              <option value="all">All Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
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

export default FilterModal;
