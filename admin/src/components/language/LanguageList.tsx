"use client";

import { Button } from "@/src/elements/ui/button";
import DataTable from "@/src/shared/DataTable";
import { Language } from "@/src/types/store";
import { Edit } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

interface LanguageListProps {
  languages: Language[];
  page: number;
  totalPages: number;
  total: number;
  onPageChange: (page: number) => void;
  onDelete: (ids: string[]) => void;
  isLoading: boolean;
}

const LanguageList = ({
  languages,
  page,
  totalPages,
  total,
  onPageChange,
  onDelete,
  isLoading,
}: LanguageListProps) => {
  const router = useRouter();
  const { t } = useTranslation();

  const handleEdit = (language: Language) => {
    router.push(`/languages/edit/${language._id}`);
  };

  const columns = [
    {
      header: t("languages.name"),
      accessor: (row: Language) => <div className="font-medium text-slate-900 dark:text-white">{row.name}</div>,
    },
    {
      header: t("languages.code"),
      accessorKey: "code" as keyof Language,
    },
    {
      header: t("languages.status"),
      accessor: (row: Language) => <span className={`text-xs px-2 py-0.5 rounded-full ${row.status ? "bg-emerald-100 dark:bg-emerald-900/20 text-(--text-green-primary) dark:text-(--text-green-primary)" : "bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400"}`}>{row.status ? t("common.active") : t("common.inactive")}</span>,
    },
  ];

  return (
    <DataTable
      data={languages}
      columns={columns}
      page={page}
      totalPages={totalPages}
      total={total}
      onPageChange={onPageChange}
      isLoading={isLoading}
      itemLabel={t("languages.title_plural")}
      itemLabelSingular={t("languages.title_singular")}
      onDelete={(item: Language) => onDelete([item._id])}
      onBulkDelete={(ids: string[]) => onDelete(ids)}
      renderActions={(row: Language) => (
        <Button onClick={() => handleEdit(row)} variant="ghost" size="icon" className="w-8 h-8 text-gray-500 hover:text-(--text-green-primary) hover:bg-emerald-100" title={t("common.edit")}>
          <Edit className="w-4 h-4" />
        </Button>
      )}
    />
  );
};

export default LanguageList;
