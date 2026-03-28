"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import CommonHeader from "@/src/shared/CommonHeader";
import { useGetSubscriptionPaymentsQuery } from "@/src/redux/api/subscriptionApi";
import { GetPaymentHistoryParams } from "@/src/types/store";
import PaymentsTable from "./PaymentsTable";
import { toast } from "sonner";

const PaymentsTransaction = () => {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("paid_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

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

  const { data, isLoading, refetch } =
    useGetSubscriptionPaymentsQuery(queryParams);

  const payments = data?.data?.payments ?? [];
  const pagination = data?.data?.pagination;

  const handleRefresh = () => {
    refetch();
    toast.info(t("payment_transactions.refreshed"));
  };

  return (
    <div className="flex flex-col min-h-full">
      <CommonHeader
        title={t("payment_transactions.title")}
        description={t("payment_transactions.description")}
        searchTerm={search}
        onSearch={setSearch}
        onRefresh={handleRefresh}
        isLoading={isLoading}
      />

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
      />
    </div>
  );
};

export default PaymentsTransaction;
