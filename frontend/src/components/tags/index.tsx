/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/src/elements/ui/button";
import { useCreateTagMutation, useDeleteTagMutation, useGetTagsQuery, useUpdateTagMutation } from "@/src/redux/api/tagsApi";
import ConfirmModal from "@/src/shared/ConfirmModal";
import { DataTable } from "@/src/shared/DataTable";
import { Tag } from "@/src/types/components";
import { Column } from "@/src/types/shared";
import { Edit2, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import TagModal from "./TagModal";
import CommonHeader from "@/src/shared/CommonHeader";
import useDebounce from "@/src/utils/hooks/useDebounce";

const TagsPage = () => {
  const [inputValue, setInputValue] = useState("");
  const searchTerm = useDebounce(inputValue, 500);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkConfirmOpen, setBulkConfirmOpen] = useState(false);
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const handleSortChange = (key: string, order: "asc" | "desc") => {
    setSortBy(key);
    setSortOrder(order);
    setPage(1);
  };

  const {
    data: tagsResult,
    isLoading,
    refetch,
    isFetching,
  } = useGetTagsQuery({
    page,
    limit,
    search: searchTerm,
    sort_by: sortBy,
    sort_order: sortOrder,
  });
  const [createTag, { isLoading: isCreating }] = useCreateTagMutation();
  const [updateTag, { isLoading: isUpdating }] = useUpdateTagMutation();
  const [deleteTag, { isLoading: isDeleting }] = useDeleteTagMutation();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const tags: Tag[] = tagsResult?.data?.tags || [];
  const totalCount = tagsResult?.data?.pagination?.totalItems || 0;

  const [visibleColumns, setVisibleColumns] = useState([
    { id: "Tag Name", label: "Tag Name", isVisible: true },
    { id: "ACTIONS", label: "Actions", isVisible: true },
  ]);

  const handleColumnToggle = (columnId: string) => {
    setVisibleColumns((prev) => prev.map((col) => (col.id === columnId ? { ...col, isVisible: !col.isVisible } : col)));
  };

  const handleSave = async (name: string, color: string) => {
    try {
      if (editingTag) {
        await updateTag({ id: editingTag._id, name, color }).unwrap();
        toast.success("Tag updated successfully");
      } else {
        await createTag({ label: name, color: color }).unwrap();
        toast.success("Tag created successfully");
      }
      setModalOpen(false);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error?.data?.message);
    }
  };

  const handleDelete = async () => {
    if (deleteId) {
      try {
        const response = await deleteTag([deleteId]).unwrap();
        toast.success(response.message || "Tag deleted successfully");
      } catch {
        toast.error("Failed to delete tag");
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
      await deleteTag(selectedIds).unwrap();
      toast.success(`${selectedIds.length} tags deleted successfully`);
      setSelectedIds([]);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error?.data?.message || error?.data?.message || "Failed to delete tags");
    } finally {
      setBulkConfirmOpen(false);
    }
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

  const onAddClick = () => {
    setEditingTag(null);
    setModalOpen(true);
  };

  const columns: Column<Tag>[] = [
    {
      header: "Tag Name",
      accessorKey: "label",
      sortable: true,
      sortKey: "label",
      cell: (row) => (
        <div className="flex items-center gap-2 font-medium text-gray-900" style={{ color: row.color || "black" }}>
          {row.label}
        </div>
      ),
    },
    {
      header: "ACTIONS",
      className: "text-center w-[100px]",
      cell: (row) => (
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="w-10 h-10 text-slate-400 border-none hover:text-primary hover:bg-emerald-50 rounded-lg dark:hover:bg-primary/20 transition-all"
            onClick={() => {
              setEditingTag(row);
              setModalOpen(true);
            }}
          >
            <Edit2 size={14} />
          </Button>
          <Button variant="outline" size="sm" className="w-10 h-10 border-none text-slate-400 hover:text-red-600 dark:text-red-500 hover:bg-red-50 rounded-lg transition-all dark:hover:bg-red-900/20" onClick={() => setDeleteId(row._id)}>
            <Trash2 size={14} />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="sm:p-8 p-4 space-y-8">
      <CommonHeader
        title="Tags"
        description="Organize your contacts and conversations with custom labels"
        onSearch={handleSearch}
        searchTerm={inputValue}
        featureKey="tags_used"
        searchPlaceholder="Search tags..."
        onRefresh={handleRefresh}
        onAddClick={onAddClick}
        addLabel="Create New Tag"
        isLoading={isLoading}
        columns={visibleColumns}
        onColumnToggle={handleColumnToggle}
        onBulkDelete={handleBulkDelete}
        selectedCount={selectedIds.length}
      />

      <div className="bg-white dark:bg-(--card-color) rounded-lg mt-8 border border-slate-200/60 dark:border-(--card-border-color) shadow-sm overflow-hidden">
        <DataTable data={tags} columns={columns.filter((col) => visibleColumns.find((vc) => vc.id === col.header)?.isVisible !== false)} isLoading={isLoading} isFetching={isFetching || isDeleting} totalCount={totalCount} page={page} limit={limit} onPageChange={handlePageChange} onLimitChange={handleLimitChange} enableSelection={true} selectedIds={selectedIds} onSelectionChange={setSelectedIds} getRowId={(item) => item._id} emptyMessage={searchTerm ? `No tags found matching "${searchTerm}"` : "No tags found. Add your first tag to filter chats."} className="border-none shadow-none rounded-none" onSortChange={handleSortChange} />
      </div>

      <TagModal isOpen={modalOpen} onClose={() => setModalOpen(false)} onSave={handleSave} tag={editingTag} isLoading={isCreating || isUpdating} />

      <ConfirmModal isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} isLoading={isDeleting} title="Delete Tag" subtitle="Are you sure you want to delete this tag? This action cannot be undone." confirmText="Delete" variant="danger" />
      <ConfirmModal isOpen={bulkConfirmOpen} onClose={() => setBulkConfirmOpen(false)} onConfirm={confirmBulkDelete} isLoading={isDeleting} title="Bulk Delete Tags" subtitle={`Are you sure you want to delete ${selectedIds.length} selected tags? This action cannot be undone.`} confirmText="Delete All" variant="danger" />
    </div>
  );
};

export default TagsPage;
