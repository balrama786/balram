"use client";

import { SECTOR_LABELS, SectorKey } from "@/src/data/sectorTemplateCategory";
import { Badge } from "@/src/elements/ui/badge";
import { useBulkDeleteAdminTemplatesMutation, useDeleteAdminTemplateMutation, useGetAllAdminTemplatesQuery } from "@/src/redux/api/adminTemplateApi";
import CommonHeader from "@/src/shared/CommonHeader";
import ConfirmModal from "@/src/shared/ConfirmModal";
import DataTable from "@/src/shared/DataTable";
import { AdminTemplate } from "@/src/types/store";
import { Edit, LayoutTemplate } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import Can from "../shared/Can";

import { Button } from "@/src/elements/ui/button";
import TemplateFilterModal from "./TemplateFilterModal";

const CATEGORY_COLORS: Record<string, string> = {
  UTILITY: "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400",
  MARKETING: "bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400",
  AUTHENTICATION: "bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400",
};

const AdminTemplateContainer = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<{ sector?: string; template_category?: string; status?: string }>({});
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeletingSingle, setIsDeletingSingle] = useState(false);

  const handleSortChange = (key: string, order: "asc" | "desc") => {
    setSortBy(key);
    setSortOrder(order);
    setPage(1);
  };

  const { data, isLoading, isFetching } = useGetAllAdminTemplatesQuery({
    page,
    limit,
    search: search || undefined,
    sector: filters.sector,
    template_category: filters.template_category,
    status: filters.status,
    sort_by: sortBy,
    sort_order: sortOrder.toUpperCase() as "ASC" | "DESC",
  });

  const [deleteTemplate] = useDeleteAdminTemplateMutation();
  const [bulkDelete, { isLoading: isBulkDeleting }] = useBulkDeleteAdminTemplatesMutation();

  const templates = data?.data?.templates ?? [];
  const pagination = data?.data?.pagination;

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    setIsDeletingSingle(true);
    try {
      await deleteTemplate(deleteId).unwrap();
      toast.success(t("templates_library.delete_success"));
      setDeleteId(null);
    } catch {
      toast.error(t("templates_library.delete_error"));
    } finally {
      setIsDeletingSingle(false);
    }
  };

  const handleBulkDelete = async () => {
    try {
      await bulkDelete(selectedIds).unwrap();
      toast.success(t("templates_library.bulk_delete_success", { count: selectedIds.length }));
      setSelectedIds([]);
      setShowBulkDeleteModal(false);
    } catch {
      toast.error(t("templates_library.bulk_delete_error"));
    }
  };

  const handleApplyFilters = (newFilters: typeof filters) => {
    setFilters(newFilters);
    setPage(1);
  };

  const columns = [
    {
      header: t("templates_library.table.template_name"),
      className: "[@media(max-width:1920px)]:min-w-[245px]",
      sortable: true,
      sortKey: "template_name",
      copyable: true,
      copyField: "template_name",
      accessor: (template: AdminTemplate) => (
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => router.push(`/templates_library/${template._id}/edit`)}>
          <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center text-primary shrink-0">
            <LayoutTemplate size={16} />
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 text-sm break-all">{template.template_name}</p>
            <p className="text-[10px] text-slate-400 dark:text-gray-500 uppercase tracking-wider">{template.language}</p>
          </div>
        </div>
      ),
    },
    {
      header: t("templates_library.table.message_body"),
      className: "[@media(max-width:1920px)]:min-w-[170px]",
      sortable: true,
      sortKey: "message_body",
      copyable: true,
      copyField: "message_body",
      accessor: (template: AdminTemplate) => (template.message_body ? <span className="text-sm text-slate-600 dark:text-gray-400 capitalize truncate">{SECTOR_LABELS[template.message_body as SectorKey] ?? template.message_body}</span> : <span className="text-slate-300 dark:text-gray-600 text-xs">—</span>),
    },
    {
      header: t("templates_library.table.sector"),
      className: "[@media(max-width:1920px)]:min-w-[170px]",
      sortable: true,
      sortKey: "sector",
      accessor: (template: AdminTemplate) => (template.sector ? <span className="text-sm text-slate-600 dark:text-gray-400 capitalize">{SECTOR_LABELS[template.sector as SectorKey] ?? template.sector}</span> : <span className="text-slate-300 dark:text-gray-600 text-xs">—</span>),
    },
    {
      header: t("templates_library.table.category"),
      className: "[@media(max-width:1920px)]:min-w-[205px]",
      sortable: true,
      sortKey: "template_category",
      accessor: (template: AdminTemplate) => (template.template_category ? <span className="text-sm text-slate-600 dark:text-gray-400 capitalize">{template.template_category.replace(/_/g, " ")}</span> : <span className="text-slate-300 dark:text-gray-600 text-xs">—</span>),
    },
    {
      header: t("templates_library.table.wa_category"),
      className: "[@media(max-width:1920px)]:min-w-[170px]",
      sortable: true,
      sortKey: "category",
      accessor: (template: AdminTemplate) => <Badge className={`text-[10px] font-bold uppercase tracking-wider rounded-md px-2 py-0.5 border-0 ${CATEGORY_COLORS[template.category] ?? ""}`}>{template.category}</Badge>,
    },
    {
      header: t("templates_library.table.status"),
      className: "[@media(max-width:1920px)]:min-w-[120px]",
      sortable: true,
      sortKey: "status",
      accessor: (template: AdminTemplate) => (
        <Badge variant={template.status === "approved" ? "default" : "secondary"} className="capitalize text-[10px] font-bold text-white">
          {template.status || t("common.draft")}
        </Badge>
      ),
    },
    {
      header: t("templates_library.table.created"),
      className: "[@media(max-width:1920px)]:min-w-[130px]",
      sortable: true,
      sortKey: "created_at",
      accessor: (template: AdminTemplate) => <span className="text-xs text-slate-500 dark:text-gray-400">{template.created_at ? new Date(template.created_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "—"}</span>,
    },
  ];

  return (
    <div>
      <CommonHeader
        title={t("templates_library.title")}
        description={t("templates_library.description")}
        onSearch={(q) => {
          setSearch(q);
          setPage(1);
        }}
        searchTerm={search}
        searchPlaceholder={t("templates_library.search_placeholder")}
        onAddClick={() => router.push("/templates_library/create")}
        addLabel={t("templates_library.create_label")}
        addPermission="create.admin_templates"
        isLoading={isLoading || isFetching}
        selectedCount={selectedIds.length}
        onBulkDelete={selectedIds.length > 0 ? () => setShowBulkDeleteModal(true) : undefined}
        bulkDeletePermission="delete.admin_templates"
        bulkActionLoading={isBulkDeleting}
        onFilter={() => setIsFilterModalOpen(true)}
      />

      <DataTable<AdminTemplate>
        data={templates}
        columns={columns}
        page={pagination?.currentPage ?? page}
        totalPages={pagination?.totalPages ?? 1}
        total={pagination?.totalItems ?? 0}
        itemsPerPage={pagination?.itemsPerPage}
        onPageChange={setPage}
        onLimitChange={(l) => {
          setLimit(l);
          setPage(1);
        }}
        isLoading={isLoading || isFetching}
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
        emptyMessage={t("templates_library.no_templates")}
        onSortChange={handleSortChange}
        renderActions={(template) => (
          <div className="flex items-center gap-2">
            <Can permission="update.admin_templates">
              <Button onClick={() => router.push(`/templates_library/${template._id}/edit`)} className="w-10 h-10 text-slate-400 hover:text-(--text-green-primary) hover:bg-emerald-50 bg-transparent shadow-none rounded-lg dark:hover:bg-primary/10 transition-all border border-transparent hover:border-emerald-100 dark:hover:border-primary/20" title={t("templates_library.edit_tooltip")}>
                <Edit size={16} />
              </Button>
            </Can>
          </div>
        )}
        onDelete={(item: AdminTemplate) => setDeleteId(item._id)}
        deletePermission="delete.admin_templates"
        actionPermissions={["update.admin_templates"]}
      />

      <ConfirmModal isOpen={showBulkDeleteModal} onClose={() => setShowBulkDeleteModal(false)} onConfirm={handleBulkDelete} isLoading={isBulkDeleting} title={t("templates_library.bulk_delete_title")} subtitle={t("templates_library.bulk_delete_subtitle", { count: selectedIds.length })} confirmText={t("templates_library.delete_all_confirm")} cancelText={t("common.cancel")} variant="danger" />

      <ConfirmModal isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDeleteConfirm} isLoading={isDeletingSingle} title={t("templates_library.delete_title")} subtitle={t("templates_library.delete_subtitle")} confirmText={t("templates_library.delete_confirm")} cancelText={t("common.cancel")} variant="danger" />

      <TemplateFilterModal isOpen={isFilterModalOpen} onClose={() => setIsFilterModalOpen(false)} onApply={handleApplyFilters} currentFilters={filters} />
    </div>
  );
};

export default AdminTemplateContainer;
