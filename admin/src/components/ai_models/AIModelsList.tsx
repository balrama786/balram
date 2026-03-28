"use client";
import { AIModel } from "@/src/types/store";
import DataTable from "@/src/shared/DataTable";
import { useTranslation } from "react-i18next";
import { Edit, Trash2 } from "lucide-react";
import { Button } from "@/src/elements/ui/button";
import { Switch } from "@/src/elements/ui/switch";
import { Badge } from "@/src/elements/ui/badge";
import { ColumnDef } from "@/src/types/shared";

interface AIModelsListProps {
  models: AIModel[];
  isLoading: boolean;
  onDelete: (model: AIModel) => void;
  onEdit: (id: string) => void;
  onToggleStatus: (id: string, status: AIModel["status"]) => void;
  columns: { id: string; label: string; isVisible: boolean }[];
  selectedIds: string[];
  onSelectionChange: (ids: string[]) => void;
  onBulkDelete?: (ids: string[]) => void;
  page?: number;
  limit?: number;
  totalCount?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  onLimitChange?: (limit: number) => void;
  onSortChange?: (sortBy: string, sortOrder: "asc" | "desc") => void;
}

const AIModelsList = ({ models, isLoading, onDelete, onEdit, onToggleStatus, columns, selectedIds, onSelectionChange, onBulkDelete, page, limit, totalCount, totalPages, onPageChange, onLimitChange, onSortChange }: AIModelsListProps) => {
  const { t } = useTranslation();

  const tableColumns: (ColumnDef<AIModel> & { id: string; isVisible: boolean })[] = [
    {
      header: t("ai_models.name"),
      className: "[@media(max-width:1595px)]:min-w-[170px]",
      id: "display_name",
      sortable: true,
      sortKey: "display_name",
      isVisible: columns.find((c) => c.id === "display_name")?.isVisible ?? true,
      cell: (row: AIModel) => (
        <div className="flex flex-col">
          <span className="font-medium text-slate-900 dark:text-white">{row.display_name}</span>
          <span className="text-xs text-slate-500">{row.name}</span>
        </div>
      ),
    },
    {
      header: t("ai_models.provider"),
      className: "[@media(max-width:1595px)]:min-w-[175px]",
      id: "provider",
      sortable: true,
      sortKey: "provider",
      isVisible: columns.find((c) => c.id === "provider")?.isVisible ?? true,
      cell: (row: AIModel) => (
        <Badge variant="outline" className="capitalize bg-slate-50 dark:bg-(--dark-body) dark:border-(--card-border-color) dark:text-gray-400 border-slate-200 text-slate-600 font-semibold px-3 py-1 rounded-lg">
          {row.provider}
        </Badge>
      ),
    },
    {
      header: t("ai_models.model_name"),
      className: "[@media(max-width:1595px)]:min-w-[220px]",
      id: "model_id",
      sortable: true,
      sortKey: "model_id",
      isVisible: columns.find((c) => c.id === "model_id")?.isVisible ?? true,
      accessorKey: "model_id",
    },
    {
      header: t("ai_models.base_url"),
      className: "[@media(max-width:1595px)]:min-w-[254px]",
      id: "api_endpoint",
      isVisible: columns.find((c) => c.id === "api_endpoint")?.isVisible ?? true,
      cell: (row: AIModel) => (
        <div className=" break-all text-xs text-slate-400 font-mono [@media(max-width:1595px)]:line-clamp-2" title={row.api_endpoint}>
          {row.api_endpoint}
        </div>
      ),
    },
    {
      header: t("ai_models.is_default"),
      className: "[@media(max-width:1595px)]:min-w-[145px]",
      id: "is_default",
      sortable: true,
      sortKey: "is_default",
      isVisible: columns.find((c) => c.id === "is_default")?.isVisible ?? true,
      cell: (row: AIModel) => {
        return row.is_default ? <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-none text-[10px] h-5 px-1.5 font-bold uppercase tracking-wider">Yes</Badge> : "No";
      },
    },
    {
      header: t("common.status"),
      className: "[@media(max-width:1595px)]:min-w-[145px]",
      id: "status",
      sortable: true,
      sortKey: "status",
      isVisible: columns.find((c) => c.id === "status")?.isVisible ?? true,
      cell: (row: AIModel) => (
        <div className="flex items-center gap-2">
          <Switch checked={row.status === "active"} onCheckedChange={() => onToggleStatus(row._id, row.status)} className="data-[state=checked]:bg-emerald-500" />
        </div>
      ),
    },
  ];

  // Filter columns based on visibility
  const visibleColumns = tableColumns.filter((col) => col.isVisible);

  return (
    <div className="animate-in fade-in duration-500">
      <DataTable
        data={models}
        columns={visibleColumns}
        isLoading={isLoading}
        getRowId={(row) => row._id}
        renderActions={(row) => (
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => onEdit(row._id)} className="w-10 h-10 text-slate-400 hover:text-(--text-green-primary) hover:bg-emerald-50 rounded-lg dark:hover:bg-primary/20 transition-all" title={t("common.edit")}>
              <Edit className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => onDelete(row)} className="w-10 h-10 text-slate-400 hover:text-red-600 dark:text-red-500 hover:bg-red-50 rounded-lg transition-all dark:hover:bg-red-900/20" title={t("common.delete")}>
              <Trash2 className="w-5 h-5" />
            </Button>
          </div>
        )}
        selectedIds={selectedIds}
        onSelectionChange={onSelectionChange}
        onBulkDelete={onBulkDelete}
        itemLabel={t("ai_models.title")}
        emptyMessage={t("ai_models.no_models_found")}
        page={page}
        limit={limit}
        total={totalCount}
        totalPages={totalPages}
        onPageChange={onPageChange}
        onLimitChange={onLimitChange}
        onSortChange={onSortChange}
      />
    </div>
  );
};

export default AIModelsList;
