/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Badge } from "@/src/elements/ui/badge";
import { Button } from "@/src/elements/ui/button";
import { useCreateCustomFieldMutation, useDeleteCustomFieldMutation, useGetCustomFieldsQuery, useUpdateCustomFieldMutation } from "@/src/redux/api/customFieldApi";
import CommonHeader from "@/src/shared/CommonHeader";
import ConfirmModal from "@/src/shared/ConfirmModal";
import { DataTable } from "@/src/shared/DataTable";
import { CustomField } from "@/src/types/components";
import { Column } from "@/src/types/shared";
import { Edit2, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import ColumnModal from "./ColumnModal";
import { cn } from "@/src/lib/utils";
import useDebounce from "@/src/utils/hooks/useDebounce";

const Columns = () => {
  const [inputValue, setInputValue] = useState("");
  const searchTerm = useDebounce(inputValue, 500);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const handleSortChange = (key: string, order: "asc" | "desc") => {
    setSortBy(key);
    setSortOrder(order);
    setPage(1);
  };

  const {
    data: customFieldsResult,
    isLoading,
    refetch,
    isFetching,
  } = useGetCustomFieldsQuery({
    limit: limit,
    page: page,
    search: searchTerm,
    sort_by: sortBy,
    sort_order: sortOrder,
  });
  const [createField, { isLoading: isCreating }] = useCreateCustomFieldMutation();
  const [updateField, { isLoading: isUpdating }] = useUpdateCustomFieldMutation();
  const [deleteField, { isLoading: isDeleting }] = useDeleteCustomFieldMutation();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingColumn, setEditingColumn] = useState<CustomField | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkConfirmOpen, setBulkConfirmOpen] = useState(false);

  const [visibleColumns, setVisibleColumns] = useState([
    { id: "Label", label: "Label", isVisible: true },
    { id: "Type", label: "Type", isVisible: true },
    { id: "Max length", label: "Max length", isVisible: true },
    { id: "Min length", label: "Min length", isVisible: true },
    { id: "Max value", label: "Max value", isVisible: true },
    { id: "Min value", label: "Min value", isVisible: true },
    { id: "Required", label: "Required", isVisible: true },
    { id: "Status", label: "Status", isVisible: true },
    { id: "Options", label: "Options", isVisible: true },
    { id: "Action", label: "Action", isVisible: true },
  ]);

  const handleColumnToggle = (columnId: string) => {
    setVisibleColumns((prev) => prev.map((col) => (col.id === columnId ? { ...col, isVisible: !col.isVisible } : col)));
  };

  const customFields: CustomField[] = customFieldsResult?.data?.fields || [];

  const columns: Column<CustomField>[] = [
    {
      header: "Label",
      sortable: true,
      sortKey: "label",
      cell: (field) => (
        <div className="flex items-center gap-3">
          <span className="text-slate-600 dark:text-white">{field.label}</span>
        </div>
      ),
    },
    {
      header: "Type",
      cell: (field) => (
        <Badge variant="outline" className="text-[11px] bg-slate-50 dark:bg-(--card-color) text-slate-600 dark:text-gray-400 border-slate-200 dark:border-(--card-border-color) px-2.5 py-0.5 rounded-md">
          {field.type}
        </Badge>
      ),
    },
    {
      header: "Max length",
      sortable: true,
      sortKey: "max_length",
      cell: (field) => <p>{field.max_length ? field.max_length : "-"}</p>,
    },
    {
      header: "Min length",
      sortable: true,
      sortKey: "min_length",
      cell: (field) => <p>{field.min_length ? field.min_length : "-"}</p>,
    },
    {
      header: "Max value",
      sortable: true,
      sortKey: "max_value",
      cell: (field) => <p className="font-medium text-slate-600 dark:text-slate-500">{field.max_value ?? "-"}</p>,
    },
    {
      header: "Min value",
      sortable: true,
      sortKey: "min_value",
      cell: (field) => <p className="font-medium text-slate-600 dark:text-slate-500">{field.min_value ?? "-"}</p>,
    },
    {
      header: "Required",
      sortable: true,
      sortKey: "required",
      cell: (field) => (
        <div className="flex items-center gap-2">
          <div className={cn("w-1.5 h-1.5 rounded-full ring-4", field.required ? "bg-emerald-500 ring-emerald-500/10" : "bg-slate-300 ring-slate-100 dark:ring-slate-800/10")} />
          <span className={cn("text-xs font-bold", field.required ? "text-emerald-600" : "text-slate-500")}>{field.required ? "YES" : "NO"}</span>
        </div>
      ),
    },
    {
      header: "Status",
      sortable: true,
      sortKey: "is_active",
      cell: (field) => (
        <div className="flex items-center gap-2">
          <div className={cn("w-1.5 h-1.5 rounded-full ring-4", field.is_active ? "bg-emerald-500 ring-emerald-500/10" : "bg-slate-300 ring-slate-100 dark:ring-slate-800/10")} />
          <span className={cn("text-xs font-bold", field.is_active ? "text-emerald-600" : "text-slate-500")}>{field.is_active ? "ACTIVE" : "INACTIVE"}</span>
        </div>
      ),
    },
    {
      header: "Options",
      cell: (field) => (
        <div className="flex flex-wrap gap-1.5 max-w-37.5">
          {field.type === "select" && field.options && field.options.length > 0
            ? field.options.map((option, idx) => (
                <span key={idx} className="text-[10px] font-bold bg-slate-100 dark:bg-(--dark-body) text-slate-500 px-2 py-0.5 rounded-md dark:text-gray-400 tracking-tight">
                  {option}
                </span>
              ))
            : "-"}
        </div>
      ),
    },
    {
      header: "Action",
      className: "text-center w-[100px]",
      cell: (field) => (
        <div className="flex items-center justify-center gap-1.5">
          <Button
            variant="outline"
            size="icon"
            className="w-10 h-10 border-none text-slate-400 hover:text-primary hover:bg-emerald-50 rounded-lg dark:hover:bg-primary/20 transition-all"
            onClick={() => {
              setEditingColumn(field);
              setModalOpen(true);
            }}
          >
            <Edit2 size={13} />
          </Button>
          <Button variant="outline" size="icon" className="w-10 h-10 text-slate-400 hover:text-red-600 dark:text-red-500 hover:bg-red-50 rounded-lg transition-all dark:hover:bg-red-900/20 border-none" onClick={() => setDeleteId(field._id)}>
            <Trash2 size={13} />
          </Button>
        </div>
      ),
    },
  ];

  const handleSave = async (data: Partial<CustomField>) => {
    try {
      if (editingColumn) {
        await updateField({ id: editingColumn._id, ...data }).unwrap();
        toast.success("Column updated successfully");
      } else {
        await createField(data).unwrap();
        toast.success("Column created successfully");
      }
    } catch (error: any) {
      toast.error(error?.data?.message || error?.data?.message || "Failed to save column");
    }
  };

  const handleDelete = async () => {
    if (deleteId) {
      try {
        await deleteField([deleteId]).unwrap();
        toast.success("Column deleted successfully");
        setSelectedIds((prev) => prev.filter((id) => id !== deleteId));
      } catch (error: any) {
        toast.error(error?.data?.message || error?.data?.message || "Failed to delete column");
      } finally {
        setDeleteId(null);
      }
    }
  };

  const handleBulkDelete = () => {
    if (selectedIds.length === 0) return;
    setBulkConfirmOpen(true);
  };

  const confirmBulkDelete = async () => {
    try {
      await deleteField(selectedIds).unwrap();
      toast.success(`${selectedIds.length} columns deleted successfully`);
      setSelectedIds([]);
    } catch (error: any) {
      toast.error(error?.data?.message || error?.data?.message || "Failed to delete some columns");
    } finally {
      setBulkConfirmOpen(false);
    }
  };

  const onAddClick = () => {
    setEditingColumn(null);
    setModalOpen(true);
  };

  const handleSearch = (value: string) => {
    setInputValue(value);
    setPage(1);
  };

  const handleRefresh = () => {
    refetch();
    toast.success("Successfully refresh table.");
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
  };

  return (
    <div className="sm:p-8 p-4 space-y-8">
      <CommonHeader title="Custom Fields" description="Define custom data attributes to store personalized information about your contacts" onSearch={handleSearch} searchTerm={inputValue} featureKey="custom_fields_used" searchPlaceholder="Search custom fields..." onRefresh={handleRefresh} onAddClick={onAddClick} addLabel="Create New Field" isLoading={isLoading} columns={visibleColumns} onColumnToggle={handleColumnToggle} onBulkDelete={handleBulkDelete} selectedCount={selectedIds.length} />

      <div className="bg-white dark:bg-(--card-color) rounded-lg border border-slate-200/60 mt-8 dark:border-(--card-border-color) shadow-sm overflow-hidden">
        <DataTable data={customFields} columns={columns.filter((col) => visibleColumns.find((vc) => vc.id === col.header)?.isVisible !== false)} isLoading={isLoading} isFetching={isFetching || isDeleting} totalCount={customFieldsResult?.data?.pagination?.totalItems || 0} page={page} limit={limit} onPageChange={handlePageChange} onLimitChange={handleLimitChange} enableSelection={true} selectedIds={selectedIds} onSelectionChange={setSelectedIds} getRowId={(item) => item._id} emptyMessage={searchTerm ? `No columns found matching "${searchTerm}"` : "No columns found. Add your first custom column to better organize your data."} className="border-none shadow-none rounded-none" onSortChange={handleSortChange} />
      </div>

      <ColumnModal isOpen={modalOpen} onClose={() => setModalOpen(false)} onSave={handleSave} column={editingColumn} isLoading={isCreating || isUpdating} />
      <ConfirmModal isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} isLoading={isDeleting} title="Delete Column" subtitle="Are you sure you want to delete this custom field? This action cannot be undone and may affect existing data." confirmText="Delete" variant="danger" />
      <ConfirmModal isOpen={bulkConfirmOpen} onClose={() => setBulkConfirmOpen(false)} onConfirm={confirmBulkDelete} isLoading={isDeleting} title="Bulk Delete Columns" subtitle={`Are you sure you want to delete ${selectedIds.length} selected custom fields? This action cannot be undone and may affect existing data.`} confirmText="Delete All" variant="danger" />
    </div>
  );
};

export default Columns;
