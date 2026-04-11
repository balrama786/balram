"use client";

import { Badge } from "@/src/elements/ui/badge";
import { Button } from "@/src/elements/ui/button";
import { useApproveManualSubscriptionMutation, useCancelSubscriptionMutation, useRejectManualSubscriptionMutation } from "@/src/redux/api/subscriptionApi";
import ConfirmModal from "@/src/shared/ConfirmModal";
import DataTable from "@/src/shared/DataTable";
import { SubscriptionPlansTableProps } from "@/src/types/components";
import { ColumnDef } from "@/src/types/shared";
import { Subscription } from "@/src/types/store";
import { format } from "date-fns";
import { Check, X, XCircle } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import Can from "../shared/Can";

const SubscriptionPlansTable = ({ subscriptions, page, totalPages, total, onPageChange, isLoading, limit, onLimitChange, onSortChange, visibleColumns }: SubscriptionPlansTableProps & { onSortChange?: (sortBy: string, sortOrder: "asc" | "desc") => void; visibleColumns?: string[] }) => {
  const { t } = useTranslation();
  const [approveManual] = useApproveManualSubscriptionMutation();
  const [rejectManual] = useRejectManualSubscriptionMutation();
  const [cancelSubscription, { isLoading: isCancelling }] = useCancelSubscriptionMutation();

  const [cancelSub, setCancelSub] = useState<Subscription | null>(null);

  const handleCancel = async () => {
    if (!cancelSub) return;
    try {
      await cancelSubscription({
        id: cancelSub._id,
        user_id: cancelSub.user._id,
        cancel_at_period_end: false,
      }).unwrap();
      toast.success(t("subscription.cancelled_success") || "Subscription cancelled successfully");
      setCancelSub(null);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.data?.message || t("subscription.cancelled_error") || "Failed to cancel subscription");
    }
  };

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
      case "cancelled":
        return <Badge className="bg-rose-100 text-rose-500 dark:bg-transparent dark:border-(--card-border-color) dark:hover:bg-page-body hover:bg-rose-100">{t("subscription.status.canceled")}</Badge>;
      case "trial":
        return <Badge className="bg-blue-100 text-blue-700 dark:bg-transparent dark:border-(--card-border-color) dark:hover:bg-page-body hover:bg-blue-100">{t("subscription.status.trial") || "Trial"}</Badge>;
      case "suspended":
        return <Badge className="bg-slate-100 text-slate-700 dark:bg-transparent dark:border-(--card-border-color) dark:hover:bg-page-body hover:bg-slate-100">{t("subscription.status.suspended") || "Suspended"}</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-700 dark:bg-transparent dark:border-(--card-border-color) dark:hover:bg-page-body hover:bg-gray-100">{status}</Badge>;
    }
  };

  const allColumns: (ColumnDef<Subscription> & { id: string })[] = [
    {
      id: "user",
      header: t("subscription.table.user"),
      sortable: true,
      sortKey: "name",
      className: "[@media(max-width:1375px)]:min-w-[215px]",
      copyable: true,
      copyField: "user.email",
      accessor: (sub) => (
        <div>
          <p className="font-semibold text-gray-900 dark:text-amber-50">{sub.user?.name || "N/A"}</p>
          <p className="text-sm text-gray-500 mt-1 dark:text-gray-400">{sub.user?.email || "N/A"}</p>
        </div>
      ),
    },
    {
      id: "plan",
      header: t("subscription.table.plan"),
      className: "[@media(max-width:1375px)]:min-w-[190px]",
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
      id: "amount",
      header: t("subscription.table.amount"),
      className: "[@media(max-width:1375px)]:min-w-[126px]",
      sortable: true,
      sortKey: "amount_paid",
      accessor: (sub) => (
        <p className="font-semibold text-gray-900 dark:text-amber-50">
          {sub.currency} {sub.amount_paid || "0.00"}
        </p>
      ),
    },
    {
      id: "method",
      header: t("subscription.table.method"),
      className: "[@media(max-width:1375px)]:min-w-[145px]",
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
      id: "transaction_id",
      header: "Transaction ID",
      accessor: (sub) => <span className="text-xs font-mono">{sub.transaction_id || sub.payment_id || "N/A"}</span>,
    },
    {
      id: "dates",
      header: t("subscription.table.dates"),
      sortable: true,
      sortKey: "current_period_start",
      className: "[@media(max-width:1375px)]:min-w-[180px]",
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
      id: "status",
      header: t("subscription.table.status"),
      className: "[@media(max-width:1375px)]:min-w-[140px]",
      sortable: true,
      sortKey: "status",
      accessor: (sub) => getStatusBadge(sub.status),
    },
  ];

  const displayedColumns = visibleColumns ? allColumns.filter((col) => visibleColumns.includes(col.id)) : allColumns;

  const renderActions = (sub: Subscription) => {
    const isManualOrAdmin = sub.payment_gateway === "manual" || sub.payment_gateway === "admin generated" || sub.payment_method === "manual";
    const canCancel = sub.status === "active" || sub.status === "trial";
    const isPending = sub.status === "pending";

    return (
      <div className="flex items-center gap-1.5">
        {isManualOrAdmin && isPending ? (
          <>
            <Can permission="update.subscriptions">
              <Button variant="ghost" size="icon" className="w-10 h-10 text-primary hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition-all" onClick={() => handleApprove(sub._id)} title={t("common.approve")}>
                <Check className="w-5 h-5" />
              </Button>
            </Can>
            <Can permission="update.subscriptions">
              <Button variant="ghost" size="icon" className="w-10 h-10 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all" onClick={() => handleReject(sub._id)} title={t("common.reject")}>
                <X className="w-5 h-5" />
              </Button>
            </Can>
          </>
        ) : canCancel ? (
          <Can permission="update.subscriptions">
            <Button variant="ghost" size="icon" className="w-10 h-10 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all" onClick={() => setCancelSub(sub)} title={t("common.cancel") || "Cancel Subscription"}>
              <XCircle className="w-5 h-5" />
            </Button>
          </Can>
        ) : (
          "-"
        )}
      </div>
    );
  };

  return (
    <>
      <DataTable data={subscriptions} columns={displayedColumns} page={page} totalPages={totalPages} total={total} onPageChange={onPageChange} onLimitChange={onLimitChange} limit={limit} isLoading={isLoading} emptyMessage={t("subscription.table.no_subscriptions")} itemLabel={t("subscription.table.item_plural")} itemLabelSingular={t("subscription.table.item")} renderActions={renderActions} onSortChange={onSortChange} />

      <ConfirmModal isOpen={!!cancelSub} onClose={() => setCancelSub(null)} onConfirm={handleCancel} isLoading={isCancelling} title={t("subscription.cancel_title") || "Cancel Subscription"} subtitle={t("subscription.cancel_subtitle") || "Are you sure you want to cancel this subscription? This action will take effect immediately."} confirmText={t("common.confirm_cancel") || "Cancel Plan"} cancelText={t("common.no_keep_it") || "No, keep it"} variant="danger" loadingText="Cancelling..." />
    </>
  );
};

export default SubscriptionPlansTable;
