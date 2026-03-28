"use client";

import React from "react";
import { Badge } from "@/src/elements/ui/badge";
import DataTable from "@/src/shared/DataTable";
import { ColumnDef } from "@/src/types/shared";
import { PaymentHistory, PaginationInfo } from "@/src/types/store";
import { format } from "date-fns";

interface PaymentsTableProps {
  payments: PaymentHistory[];
  isLoading: boolean;
  pagination?: PaginationInfo;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  page: number;
  limit: number;
  onSortChange?: (sortBy: string, sortOrder: "asc" | "desc") => void;
}

const PaymentsTable = ({ payments, isLoading, pagination, onPageChange, onLimitChange, page, limit, onSortChange }: PaymentsTableProps) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
      case "success":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
      case "pending":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "failed":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";
    }
  };

  const columns: ColumnDef<PaymentHistory>[] = [
    {
      header: "Transaction ID",
      sortable: true,
      sortKey: "transaction_id",
      copyable: true,
      copyField: "transaction_id",
      className: "[@media(max-width:1245px)]:min-w-[160px]",
      accessor: (payment) => <span className="font-mono text-xs text-gray-500">{payment.transaction_id || payment._id.slice(-8).toUpperCase()}</span>,
    },
    {
      header: "User",
      className: "[@media(max-width:1245px)]:min-w-[170px]",
      sortable: true,
      sortKey: "name",
      accessor: (payment) => (
        <div className="flex flex-col">
          <span className="font-medium text-gray-900 dark:text-gray-100 truncate max-w-37.5">{payment.user?.name || "Unknown User"}</span>
          <span className="text-xs text-gray-500 truncate max-w-37.5">{payment.user?.email || "No email"}</span>
        </div>
      ),
    },
    {
      header: "Plan",
      sortable: true,
      sortKey: "name",
      className: "[@media(max-width:1245px)]:min-w-[165px]",
      accessor: (payment) => <span className="text-gray-700 dark:text-gray-300">{payment.plan?.name || "N/A"}</span>,
    },
    {
      header: "Amount",
      sortable: true,
      sortKey: "amount",
      className: "[@media(max-width:1245px)]:min-w-[135px]",
      accessor: (payment) => (
        <span className="font-semibold text-gray-900 dark:text-gray-100 uppercase">
          {payment.amount} {payment.currency}
        </span>
      ),
    },
    {
      header: "Gateway",
      sortable: true,
      sortKey: "payment_gateway",
      className: "[@media(max-width:1245px)]:min-w-[125px]",
      accessor: (payment) => (
        <Badge variant="outline" className="capitalize border-slate-200 dark:border-slate-800">
          {payment.payment_gateway}
        </Badge>
      ),
    },
    {
      header: "Status",
      sortable: true,
      sortKey: "payment_status",
      className: "[@media(max-width:1245px)]:min-w-[130px]",
      accessor: (payment) => <Badge className={`border-none ${getStatusColor(payment.payment_status)}`}>{payment.payment_status}</Badge>,
    },
    {
      header: "Paid At",
      sortable: true,
      sortKey: "paid_at",
      className: "[@media(max-width:1245px)]:min-w-[185px]",
      accessor: (payment) => <span className="text-gray-500 text-sm whitespace-nowrap">{payment.paid_at ? format(new Date(payment.paid_at), "MMM d, yyyy HH:mm") : "N/A"}</span>,
    },
  ];

  return <DataTable data={payments} columns={columns} page={page} totalPages={pagination?.totalPages || 1} total={pagination?.totalItems || 0} limit={limit} onPageChange={onPageChange} onLimitChange={onLimitChange} isLoading={isLoading} emptyMessage="No payment transactions found." itemLabel="Transactions" onSortChange={onSortChange} />;
};

export default PaymentsTable;
