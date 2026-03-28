import { stripHtml } from "@/lib/utils";
import { Badge } from "@/src/elements/ui/badge";
import { Button } from "@/src/elements/ui/button";
import DataTable from "@/src/shared/DataTable";
import { FaqListProps } from "@/src/types/components";
import { ColumnDef } from "@/src/types/shared";
import { Faq } from "@/src/types/store";
import { format } from "date-fns";
import { Edit } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

const FaqList = ({
  faqs,
  page,
  totalPages,
  total,
  onPageChange,
  onDelete,
  onBulkDelete,
  isLoading,
  limit = 10,
  onLimitChange = () => {},
  onSelectionChange,
  selectedIds,
  onSortChange,
}: FaqListProps) => {
  const router = useRouter();
  const { t } = useTranslation();

  const handleEdit = (faq: Faq) => {
    router.push(`/manage_faqs/edit/${faq._id}`);
  };

  const columns: ColumnDef<Faq>[] = [
    {
      header: t("faq.question_label"),
      className: "[@media(max-width:1830px)]:min-w-[325px]",
      sortable: true,
      sortKey: "title",
      accessor: (faq) => (
        <span className="font-semibold text-gray-900 dark:text-gray-100 break-all cursor-pointer [@media(max-width:1580px)]:line-clamp-2" onClick={() => handleEdit(faq)} title={faq.title}>
          {faq.title}
        </span>
      ),
    },
    {
      header: t("faq.answer_label"),
      className: "[@media(max-width:1830px)]:min-w-[240px]",
      accessor: (faq) => (
        <span className="text-gray-500 dark:text-gray-400 break-all w-25 [@media(max-width:1580px)]:line-clamp-1" title={stripHtml(faq.description)}>
          {stripHtml(faq.description)}
        </span>
      ),
    },
    {
      header: t("common.status"),
      className: "[@media(max-width:1830px)]:min-w-[140px]",
      sortable: true,
      sortKey: "status",
      accessor: (faq) => <Badge className={`${faq.status ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400" : "bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400"} border-none relative`}>{faq.status ? t("common.published") : t("common.draft")}</Badge>,
    },
    {
      header: t("common.created_at"),
      className: "[@media(max-width:1830px)]:min-w-[165px]",
      sortable: true,
      sortKey: "created_at",
      accessor: (faq) => <span className="text-gray-500 dark:text-gray-400 text-sm">{faq.created_at ? format(new Date(faq.created_at), "MMM d, yyyy") : "N/A"}</span>,
    },
  ];

  const renderActions = (faq: Faq) => (
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="icon" onClick={() => handleEdit(faq)} className="w-10 h-10 text-slate-400 hover:text-(--text-green-primary) hover:bg-emerald-50 rounded-lg dark:hover:bg-primary/20 transition-all" title={t("common.edit")} disabled={isLoading}>
        <Edit className="w-4 h-4" />
      </Button>
    </div>
  );

  return (
    <DataTable
      data={faqs}
      columns={columns}
      page={page}
      totalPages={totalPages}
      total={total}
      onPageChange={onPageChange}
      onLimitChange={onLimitChange}
      limit={limit}
      isLoading={isLoading}
      onDelete={(item) => onDelete(item._id)}
      onBulkDelete={onBulkDelete}
      onSelectionChange={onSelectionChange}
      selectedIds={selectedIds}
      emptyMessage={t("faq.no_faqs")}
      itemLabel="FAQs"
      renderActions={renderActions}
      onSortChange={onSortChange}
    />
  );
};

export default FaqList;
