/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useGetAllSubscriptionsQuery } from "@/src/redux/api/subscriptionApi";
import { FilterOptions } from "@/src/types/components";
import useDebounce from "@/src/utils/hooks/useDebounce";
import { useState } from "react";
import { toast } from "sonner";
import FilterModal from "./FilterModal";
import SubscriptionPlansHeader from "./SubscriptionPlansHeader";
import SubscriptionPlansSearchBar from "./SubscriptionPlansSearchBar";
import SubscriptionPlansSummary from "./SubscriptionPlansSummary";
import SubscriptionPlansTable from "./SubscriptionPlansTable";
import { exportSubscriptionsToCSV } from "./utils/exportPlans";
import { useTranslation } from "react-i18next";

const SubscriptionPlansContainer = () => {
  const { t } = useTranslation();
  const [inputValue, setInputValue] = useState("");
  const searchTerm = useDebounce(inputValue, 500);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({});
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const handleSortChange = (key: string, order: "asc" | "desc") => {
    setSortBy(key);
    setSortOrder(order);
    setPage(1);
  };

  const { data, isLoading, isFetching } = useGetAllSubscriptionsQuery({
    page,
    limit,
    search: searchTerm,
    status: filters.status,
    sort_by: sortBy,
    sort_order: sortOrder.toUpperCase() as "ASC" | "DESC",
  });

  const subscriptions = data?.data?.subscriptions || [];
  const pagination = data?.data?.pagination;
  const totalPages = pagination?.totalPages || 1;
  const total = pagination?.totalItems || 0;
  const activeCount = subscriptions.filter((s) => s.status === "active").length;
  const totalRevenue = subscriptions.reduce((acc, s) => acc + s.amount_paid, 0);

  const handleSearch = (value: string) => {
    setInputValue(value);
    setPage(1);
  };

  const handleFilter = () => {
    setIsFilterModalOpen(true);
  };

  const handleApplyFilters = (newFilters: FilterOptions) => {
    setFilters(newFilters);
    setPage(1);
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
  };

  const handleExport = () => {
    try {
      exportSubscriptionsToCSV(subscriptions);
      toast.success(t("subscription.export_success"));
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error?.message || t("subscription.error_export"));
    }
  };

  const activeFilterCount = Object.values(filters).filter(Boolean).length;
  const hasActiveFilters = activeFilterCount > 0;

  return (
    <div>
      <SubscriptionPlansHeader isLoading={isLoading || isFetching} />
      <SubscriptionPlansSummary
        totalSubscriptions={total}
        activeSubscriptions={activeCount}
        monthlyRevenue={totalRevenue}
        isLoading={isLoading || isFetching}
      />
      <SubscriptionPlansSearchBar
        searchTerm={inputValue}
        onSearch={handleSearch}
        onFilter={handleFilter}
        onExport={handleExport}
        hasActiveFilters={hasActiveFilters}
        activeFilterCount={activeFilterCount}
        isLoading={isLoading || isFetching}
        canExport={subscriptions.length > 0}
      />

      <SubscriptionPlansTable
        subscriptions={subscriptions}
        page={page}
        totalPages={totalPages}
        total={total}
        onPageChange={setPage}
        isLoading={isLoading || isFetching}
        limit={limit}
        onLimitChange={handleLimitChange}
        onSortChange={handleSortChange}
      />

      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onApply={handleApplyFilters}
        currentFilters={filters}
      />
    </div>
  );
};

export default SubscriptionPlansContainer;
