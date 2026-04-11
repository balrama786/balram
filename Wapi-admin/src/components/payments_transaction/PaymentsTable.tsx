"use client";

import { Badge } from "@/src/elements/ui/badge";
import { Button } from "@/src/elements/ui/button";
import DataTable from "@/src/shared/DataTable";
import { ColumnDef } from "@/src/types/shared";
import { PaginationInfo, PaymentHistory } from "@/src/types/store";
import { format } from "date-fns";
import { Download } from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

interface PaymentsTableProps {
  payments: PaymentHistory[];
  isLoading: boolean;
  pagination?: PaginationInfo;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  page: number;
  limit: number;
  onSortChange?: (sortBy: string, sortOrder: "asc" | "desc") => void;
  visibleColumns?: string[];
}

const PaymentsTable = ({ payments, isLoading, pagination, onPageChange, onLimitChange, page, limit, onSortChange, visibleColumns }: PaymentsTableProps) => {
  const { t } = useTranslation();

  const handleDownloadInvoice = (paymentId: string) => {
    window.location.assign(`/api/subscription/payment/${paymentId}/invoice`);
    toast.success(t("payment_transactions.download_success") || "Invoice download started");
  };

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

  const allColumns: (ColumnDef<PaymentHistory> & { id: string })[] = [
    {
      id: "invoice_number",
      header: "Invoice Number",
      sortable: true,
      sortKey: "invoice_number",
      copyable: true,
      copyField: "invoice_number",
      className: "[@media(max-width:1678px)]:min-w-[160px]",
      accessor: (payment) => <span className="font-mono text-xs text-gray-500">{payment.invoice_number}</span>,
    },
    {
      id: "transaction_id",
      header: "Transaction ID",
      sortable: true,
      sortKey: "transaction_id",
      copyable: true,
      copyField: "transaction_id",
      className: "[@media(max-width:1678px)]:min-w-[160px]",
      accessor: (payment) => <span className="font-mono text-xs text-gray-500">{payment.transaction_id || payment._id.slice(-8).toUpperCase()}</span>,
    },
    {
      id: "user",
      header: "User",
      className: "[@media(max-width:1678px)]:min-w-[170px]",
      sortable: true,
      sortKey: "name",
      copyable: true,
      copyField: "user.email",
      accessor: (payment) => (
        <div className="flex flex-col">
          <span className="font-medium text-gray-900 dark:text-gray-100 truncate max-w-37.5">{payment.user?.name || "Unknown User"}</span>
          <span className="text-xs text-gray-500 truncate max-w-37.5">{payment.user?.email || "No email"}</span>
        </div>
      ),
    },
    {
      id: "plan",
      header: "Plan",
      sortable: true,
      sortKey: "name",
      className: "[@media(max-width:1678px)]:min-w-[165px]",
      accessor: (payment) => <span className="text-gray-700 dark:text-gray-300">{payment.plan?.name || "N/A"}</span>,
    },
    {
      id: "amount",
      header: "Amount",
      sortable: true,
      sortKey: "amount",
      className: "[@media(max-width:1678px)]:min-w-[255px]",
      accessor: (payment) => (
        <span className="font-semibold text-gray-900 dark:text-gray-100 uppercase">
          {payment.amount} {payment.currency}
        </span>
      ),
    },
    {
      id: "gateway",
      header: "Gateway",
      sortable: true,
      sortKey: "payment_gateway",
      className: "[@media(max-width:1678px)]:min-w-[125px]",
      accessor: (payment) => (
        <Badge variant="outline" className="capitalize border-slate-200 dark:border-slate-800">
          {payment.payment_gateway}
        </Badge>
      ),
    },
    {
      id: "status",
      header: "Status",
      sortable: true,
      sortKey: "payment_status",
      className: "[@media(max-width:1678px)]:min-w-[130px]",
      accessor: (payment) => <Badge className={`border-none ${getStatusColor(payment.payment_status)}`}>{payment.payment_status}</Badge>,
    },
    {
      id: "paid_at",
      header: "Paid At",
      sortable: true,
      sortKey: "paid_at",
      className: "[@media(max-width:1678px)]:min-w-[185px]",
      accessor: (payment) => <span className="text-gray-500 text-sm whitespace-nowrap">{payment.paid_at ? format(new Date(payment.paid_at), "MMM d, yyyy HH:mm") : "N/A"}</span>,
    },
    {
      id: "actions",
      header: "Actions",
      className: "text-right",
      accessor: (payment) => (
        <div className="flex justify-end pr-2">
          <Button variant="ghost" size="icon" title="Download Invoice" onClick={() => handleDownloadInvoice(payment._id)} className="w-10 h-10 hover:bg-emerald-50 rounded-lg dark:hover:bg-primary/20 text-gray-500 hover:text-(--text-green-primary) transition-colors">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  const displayedColumns = visibleColumns ? allColumns.filter((col) => visibleColumns.includes(col.id)) : allColumns;

  return <DataTable data={payments} columns={displayedColumns} page={page} totalPages={pagination?.totalPages || 1} total={pagination?.totalItems || 0} limit={limit} onPageChange={onPageChange} onLimitChange={onLimitChange} isLoading={isLoading} emptyMessage="No payment transactions found." itemLabel="Transactions" onSortChange={onSortChange} />;
};

export default PaymentsTable;
