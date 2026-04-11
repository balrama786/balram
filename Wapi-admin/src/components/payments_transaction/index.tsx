"use client";

import { useGetSubscriptionPaymentsQuery } from "@/src/redux/api/subscriptionApi";
import CommonHeader from "@/src/shared/CommonHeader";
import { GetPaymentHistoryParams } from "@/src/types/store";
import { exportData } from "@/src/utils/exportUtils";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import PaymentsTable from "./PaymentsTable";

const PaymentsTransaction = () => {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("paid_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const [columns, setColumns] = useState([
    { id: "invoice_number", label: "Invoice Number", isVisible: true, key: "invoice_number" },
    { id: "transaction_id", label: "Transaction ID", isVisible: true, key: "transaction_id" },
    { id: "user", label: "User", isVisible: true, key: "user.name" },
    { id: "user_email", label: "Email", isVisible: true, key: "user.email" },
    { id: "plan", label: "Plan", isVisible: true, key: "plan.name" },
    { id: "amount", label: "Amount", isVisible: true, key: "amount" },
    { id: "currency", label: "Currency", isVisible: true, key: "currency" },
    { id: "gateway", label: "Gateway", isVisible: true, key: "payment_gateway" },
    { id: "status", label: "Status", isVisible: true, key: "payment_status" },
    { id: "paid_at", label: "Paid At", isVisible: true, key: "paid_at" },
    { id: "actions", label: "Actions", isVisible: true, key: "actions" },
  ]);

  const handleColumnToggle = (columnId: string) => {
    setColumns((prev) => prev.map((col) => (col.id === columnId ? { ...col, isVisible: !col.isVisible } : col)));
  };

  const handleSortChange = (key: string, order: "asc" | "desc") => {
    setSortBy(key);
    setSortOrder(order);
    setPage(1);
  };

  const queryParams: GetPaymentHistoryParams = {
    page,
    limit,
    search: search || undefined,
    sort_by: sortBy,
    sort_order: sortOrder.toUpperCase() as "ASC" | "DESC",
  };

  const { data, isLoading, refetch } = useGetSubscriptionPaymentsQuery(queryParams);

  const payments = data?.data?.payments ?? [];
  const pagination = data?.data?.pagination;

  const handleRefresh = () => {
    refetch();
    toast.info(t("payment_transactions.refreshed"));
  };

  const handleExport = (format: "csv" | "excel" | "pdf") => {
    if (!payments.length) {
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
      data: payments,
      columns: exportColumns,
      filename: `payments_${new Date().toISOString().split("T")[0]}`,
      format,
    });
    toast.success(t("common.export_success") || "Export started successfully");
  };

  return (
    <div className="flex flex-col min-h-full">
      <CommonHeader title={t("payment_transactions.title")} description={t("payment_transactions.description")} searchTerm={search} onSearch={setSearch} onRefresh={handleRefresh} isLoading={isLoading} columns={columns} onColumnToggle={handleColumnToggle} onExport={handleExport} />

      <PaymentsTable
        payments={payments}
        isLoading={isLoading}
        pagination={pagination}
        onPageChange={setPage}
        onLimitChange={(l) => {
          setLimit(l);
          setPage(1);
        }}
        page={page}
        limit={limit}
        onSortChange={handleSortChange}
        visibleColumns={columns.filter((c) => c.isVisible).map((c) => c.id)}
      />
    </div>
  );
};

export default PaymentsTransaction;
