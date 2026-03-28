"use client";

import { Badge } from "@/src/elements/ui/badge";
import { Button } from "@/src/elements/ui/button";
import { useApproveManualSubscriptionMutation, useRejectManualSubscriptionMutation } from "@/src/redux/api/subscriptionApi";
import DataTable from "@/src/shared/DataTable";
import { SubscriptionPlansTableProps } from "@/src/types/components";
import { ColumnDef } from "@/src/types/shared";
import { Subscription } from "@/src/types/store";
import { format } from "date-fns";
import { Check, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

const SubscriptionPlansTable = ({ subscriptions, page, totalPages, total, onPageChange, isLoading, limit, onLimitChange, onSortChange }: SubscriptionPlansTableProps & { onSortChange?: (sortBy: string, sortOrder: "asc" | "desc") => void }) => {
  const { t } = useTranslation();
  const [approveManual] = useApproveManualSubscriptionMutation();
  const [rejectManual] = useRejectManualSubscriptionMutation();

  const handleApprove = async (id: string) => {
    try {
      await approveManual(id).unwrap();
      toast.success(t("subscription.approved_success"));
    } catch {
      toast.error(t("subscription.approved_error"));
    }
  };

  const handleReject = async (id: string) => {
    try {
      await rejectManual(id).unwrap();
      toast.success(t("subscription.rejected_success"));
    } catch {
      toast.error(t("subscription.rejected_error"));
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-emerald-100 text-(--text-green-primary) dark:bg-transparent dark:border-(--card-border-color) dark:hover:bg-page-body hover:bg-emerald-100">{t("subscription.status.active")}</Badge>;
      case "pending":
        return <Badge className="bg-amber-100 text-amber-700 dark:bg-transparent dark:border-(--card-border-color) dark:hover:bg-page-body hover:bg-amber-100">{t("subscription.status.pending")}</Badge>;
      case "expired":
        return <Badge className="bg-red-100 text-red-700 dark:bg-transparent dark:border-(--card-border-color) dark:hover:bg-page-body hover:bg-red-100">{t("subscription.status.expired")}</Badge>;
      case "canceled":
        return <Badge className="bg-gray-100 text-gray-500 dark:bg-transparent dark:border-(--card-border-color) dark:hover:bg-page-body hover:bg-gray-100">{t("subscription.status.canceled")}</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-700 dark:bg-transparent dark:border-(--card-border-color) dark:hover:bg-page-body hover:bg-gray-100">{status}</Badge>;
    }
  };

  const columns: ColumnDef<Subscription>[] = [
    {
      header: t("subscription.table.user"),
      sortable: true,
      sortKey: "name",
      className: "[@media(max-width:1310px)]:min-w-[175px]",
      accessor: (sub) => (
        <div>
          <p className="font-semibold text-gray-900 dark:text-amber-50">{sub.user?.name || "N/A"}</p>
          <p className="text-sm text-gray-500 mt-1 dark:text-gray-400">{sub.user?.email || "N/A"}</p>
        </div>
      ),
    },
    {
      header: t("subscription.table.plan"),
      className: "[@media(max-width:1310px)]:min-w-[190px]",
      accessor: (sub) => (
        <div>
          <p className="font-semibold text-gray-900 dark:text-amber-50">{sub.plan?.name || "N/A"}</p>
          <p className="text-sm text-gray-500 mt-1 dark:text-gray-400 capitalize">
            {sub.plan?.billing_cycle || "N/A"} / {sub.plan?.price || "N/A"}
          </p>
        </div>
      ),
    },
    {
      header: t("subscription.table.amount"),
      className: "[@media(max-width:1310px)]:min-w-[126px]",
      sortable: true,
      sortKey: "amount_paid",
      accessor: (sub) => (
        <p className="font-semibold text-gray-900 dark:text-amber-50">
          {sub.currency} {sub.amount_paid || "0.00"}
        </p>
      ),
    },
    {
      header: t("subscription.table.method"),
      className: "[@media(max-width:1310px)]:min-w-[145px]",
      copyable: true,
      copyField: "transaction_id",
      accessor: (sub) => (
        <div>
          <p className="text-sm font-medium text-gray-900 dark:text-amber-50 capitalize">{sub.payment_gateway || "N/A"}</p>
          <p className="text-xs text-gray-500 mt-1 truncate max-w-30 dark:text-gray-400" title={sub.transaction_id}>
            {sub.transaction_id || sub.payment_id || "No ID"}
          </p>
        </div>
      ),
    },
    {
      header: t("subscription.table.dates"),
      sortable: true,
      sortKey: "current_period_start",
      className: "[@media(max-width:1310px)]:min-w-[180px]",
      accessor: (sub) => (
        <div className="text-sm">
          <p className="text-gray-900 dark:text-amber-50">
            <span className="text-gray-400 mr-1">{t("subscription.table.start")}</span>
            {sub.current_period_start ? format(new Date(sub.current_period_start), "MMM dd, yyyy") : "N/A"}
          </p>
          <p className="text-gray-900 mt-1 dark:text-amber-50">
            <span className="text-gray-400 mr-1">{t("subscription.table.end")}</span>
            {sub.current_period_end ? format(new Date(sub.current_period_end), "MMM dd, yyyy") : "N/A"}
          </p>
        </div>
      ),
    },
    {
      header: t("subscription.table.status"),
      className: "[@media(max-width:1310px)]:min-w-[140px]",
      sortable: true,
      sortKey: "status",
      accessor: (sub) => getStatusBadge(sub.status),
    },
  ];

  const renderActions = (sub: Subscription) => {
    const isManual = sub.payment_gateway === "manual";

    return (
      <div className="flex items-center gap-1.5">
        {isManual ? (
          <>
            <Button variant="ghost" size="icon" className="w-10 h-10 text-primary hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition-all" onClick={() => handleApprove(sub._id)} title={t("common.approve")}>
              <Check className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="w-10 h-10 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all" onClick={() => handleReject(sub._id)} title={t("common.reject")}>
              <X className="w-5 h-5" />
            </Button>
          </>
        ) : (
          "-"
        )}
      </div>
    );
  };

  return <DataTable data={subscriptions} columns={columns} page={page} totalPages={totalPages} total={total} onPageChange={onPageChange} onLimitChange={onLimitChange} limit={limit} isLoading={isLoading} emptyMessage={t("subscription.table.no_subscriptions")} itemLabel={t("subscription.table.item_plural")} itemLabelSingular={t("subscription.table.item")} renderActions={renderActions} onSortChange={onSortChange} />;
};

export default SubscriptionPlansTable;
