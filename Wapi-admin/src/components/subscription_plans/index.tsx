"use client";

import { useGetAllSubscriptionsQuery, useGetSubscriptionSummaryQuery } from "@/src/redux/api/subscriptionApi";
import { FilterOptions } from "@/src/types/components";
import { exportData } from "@/src/utils/exportUtils";
import useDebounce from "@/src/utils/hooks/useDebounce";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import CommonHeader from "../../shared/CommonHeader";
import FilterModal from "./FilterModal";
import SubscriptionPlansSummary from "./SubscriptionPlansSummary";
import SubscriptionPlansTable from "./SubscriptionPlansTable";

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

  const [columns, setColumns] = useState([
    { id: "user", label: "User", isVisible: true, key: "user.name" },
    { id: "user_email", label: "Email", isVisible: true, key: "user.email" },
    { id: "plan", label: "Plan", isVisible: true, key: "plan.name" },
    { id: "amount", label: "Amount", isVisible: true, key: "amount_paid" },
    { id: "method", label: "Method", isVisible: true, key: "payment_gateway" },
    { id: "transaction_id", label: "Transaction ID", isVisible: false, key: "transaction_id" },
    { id: "dates", label: "Dates", isVisible: true, key: "current_period_end" },
    { id: "status", label: "Status", isVisible: true, key: "status" },
  ]);

  const handleColumnToggle = (columnId: string) => {
    setColumns((prev) => prev.map((col) => (col.id === columnId ? { ...col, isVisible: !col.isVisible } : col)));
  };

  const handleSortChange = (key: string, order: "asc" | "desc") => {
    setSortBy(key);
    setSortOrder(order);
    setPage(1);
  };

  const { data: summaryData, isLoading: isSummaryLoading } = useGetSubscriptionSummaryQuery();

  const { data, isLoading, isFetching } = useGetAllSubscriptionsQuery({
    page,
    limit,
    search: searchTerm,
    status: filters.status,
    is_expiring_soon: filters.is_expiring_soon,
    sort_by: sortBy,
    sort_order: sortOrder.toUpperCase() as "ASC" | "DESC",
  });

  const subscriptions = data?.data?.subscriptions || [];
  const pagination = data?.data?.pagination;
  const totalPages = pagination?.totalPages || 1;
  const total = pagination?.totalItems || 0;

  const handleCardClick = (type: string) => {
    if (type === "total") {
      setFilters({});
    } else if (type === "active" || type === "expired") {
      setFilters({ status: type });
    } else if (type === "expiring_soon") {
      setFilters({ is_expiring_soon: true });
    }
    setPage(1);
  };

  const activeFilterId = filters.is_expiring_soon ? "expiring_soon" : filters.status === "active" ? "active" : filters.status === "expired" ? "expired" : Object.keys(filters).length === 0 ? "total" : "";

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

  const handleExport = (format: "csv" | "excel" | "pdf") => {
    if (!subscriptions.length) {
      toast.error(t("common.no_data_export") || "No data to export");
      return;
    }

    const exportColumns = columns
      .filter((col) => col.isVisible)
      .map((col) => ({
        header: col.label,
        key: col.key,
      }));

    exportData({
      data: subscriptions,
      columns: exportColumns,
      filename: `subscriptions_${new Date().toISOString().split("T")[0]}`,
      format,
    });
    toast.success(t("common.export_success") || "Export started successfully");
  };

  return (
    <div className="flex flex-col min-h-full">
      <CommonHeader title={t("subscription.title")} description={t("subscription.description")} searchTerm={inputValue} onSearch={handleSearch} onFilter={handleFilter} onExport={handleExport} isLoading={isLoading || isFetching} columns={columns} onColumnToggle={handleColumnToggle} />
      <SubscriptionPlansSummary totalSubscriptions={summaryData?.data.totalSubscriptions || 0} activeSubscriptions={summaryData?.data.activeSubscriptions || 0} expiredSubscriptions={summaryData?.data.expiredSubscriptions || 0} expiringSoonSubscriptions={summaryData?.data.expiringSoonSubscriptions || 0} monthlyRevenue={summaryData?.data.monthlyRevenue || 0} isLoading={isSummaryLoading} onCardClick={handleCardClick} activeFilter={activeFilterId} />

      <SubscriptionPlansTable subscriptions={subscriptions} page={page} totalPages={totalPages} total={total} onPageChange={setPage} isLoading={isLoading || isFetching} limit={limit} onLimitChange={handleLimitChange} onSortChange={handleSortChange} visibleColumns={columns.filter((c) => c.isVisible).map((c) => c.id)} />

      <FilterModal isOpen={isFilterModalOpen} onClose={() => setIsFilterModalOpen(false)} onApply={handleApplyFilters} currentFilters={filters} />
    </div>
  );
};

export default SubscriptionPlansContainer;
