import { useMemo } from "react";
import { FilterOptions, PlanWithSubscribers } from "@/src/types/components";

export const usePlanFilters = (
  plans: PlanWithSubscribers[],
  searchTerm: string,
  filters: FilterOptions
) => {
  const filteredPlans = useMemo(() => {
    return plans.filter((plan) => {
      // Search filter
      const matchesSearch =
        plan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plan.description?.toLowerCase().includes(searchTerm.toLowerCase());

      if (!matchesSearch) return false;

      // Status filter
      if (filters.status) {
        const isActive = filters.status === "active";
        if (plan.is_active !== isActive) return false;
      }

      // Billing cycle filter
      if (filters.billing_cycle && filters.billing_cycle !== "all") {
        if (plan.billing_cycle !== filters.billing_cycle) return false;
      }

      // Featured filter
      if (filters.is_featured && filters.is_featured !== "all") {
        const isFeatured = filters.is_featured === "true";
        if (plan.is_featured !== isFeatured) return false;
      }

      return true;
    });
  }, [plans, searchTerm, filters]);

  const hasActiveFilters = useMemo(() => {
    return (
      Object.keys(filters).length > 0 &&
      Object.values(filters).some((v) => v !== undefined && v !== "all")
    );
  }, [filters]);

  const activeFilterCount = useMemo(() => {
    return Object.values(filters).filter(
      (v) => v !== undefined && v !== "all"
    ).length;
  }, [filters]);

  return {
    filteredPlans,
    hasActiveFilters,
    activeFilterCount,
  };
};
