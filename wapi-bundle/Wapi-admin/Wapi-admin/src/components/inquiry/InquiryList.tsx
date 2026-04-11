"use client";

import { TruncatedText } from "@/src/shared/TruncatedText";
import { InquiryListProps } from "@/src/types/components";
import { ColumnDef } from "@/src/types/shared";
import { Inquiry } from "@/src/types/store";
import { format } from "date-fns";
import { Calendar, User } from "lucide-react";
import { useTranslation } from "react-i18next";
import DataTable from "../../shared/DataTable";

const InquiryList = ({ inquiries, page, totalPages, total, onPageChange, onLimitChange, limit, onDelete, onBulkDelete, isLoading, onSelectionChange, selectedIds, onSortChange }: InquiryListProps) => {
  const { t } = useTranslation();
  const columns: ColumnDef<Inquiry>[] = [
    {
      header: t("inquiry.table.name"),
      sortable: true,
      sortKey: "name",
      accessor: (inquiry) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-(--dark-body) flex items-center justify-center shrink-0">
            <User className="w-5 h-5 text-slate-600 dark:text-primary" />
          </div>
          <div className="space-y-0.5 min-w-0">
            <p className="font-semibold text-gray-900 text-sm dark:text-amber-50">{inquiry.name}</p>
            <div className="flex items-center gap-1.5">
              <TruncatedText text={inquiry.email} className="text-xs text-slate-500 dark:text-slate-400" />
            </div>
          </div>
        </div>
      ),
    },
    {
      header: t("inquiry.table.subject"),
      sortable: true,
      sortKey: "subject",
      accessor: (inquiry) => (
        <div className="space-y-1 max-w-xs sm:max-w-md">
          <p className="font-semibold text-gray-900 text-sm leading-snug dark:text-amber-50">{inquiry.subject}</p>
          <TruncatedText text={inquiry.message} maxLength={50} />
        </div>
      ),
    },
    {
      header: "DATE",
      sortable: true,
      sortKey: "created_at",
      accessor: (inquiry) => (
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-amber-50">
          <Calendar className="w-4 h-4 text-gray-400" />
          {inquiry.created_at ? format(new Date(inquiry.created_at), "MMM d, yyyy") : "N/A"}
        </div>
      ),
    },
  ];

  return <DataTable data={inquiries} columns={columns} page={page} totalPages={totalPages} total={total} onPageChange={onPageChange} onLimitChange={onLimitChange} limit={limit} isLoading={isLoading} onDelete={(item: Inquiry) => onDelete(item._id)} deletePermission="delete.contact_inquiries" onBulkDelete={onBulkDelete} onSelectionChange={onSelectionChange} selectedIds={selectedIds} itemLabel="Inquiries" onSortChange={onSortChange} />;
};

export default InquiryList;
