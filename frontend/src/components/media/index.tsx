/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import MediaDetailModal from "@/src/components/media/MediaDetailModal";
import MediaGrid from "@/src/components/media/MediaGrid";
import MediaUploadModal from "@/src/components/media/MediaUploadModal";
import { Button } from "@/src/elements/ui/button";
import { Checkbox } from "@/src/elements/ui/checkbox";
import { useBulkDeleteAttachmentsMutation, useGetAttachmentsQuery } from "@/src/redux/api/mediaApi";
import CommonHeader from "@/src/shared/CommonHeader";
import ConfirmModal from "@/src/shared/ConfirmModal";
import { DataTable } from "@/src/shared/DataTable";
import { Pagination } from "@/src/shared/Pagination";
import { Attachment } from "@/src/types/components";
import { formatDate } from "@/src/utils";
import { Edit2, Grid, LayoutList, Loader2, SquareCheckBig, Trash2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";

const MediaPage = () => {
  const [viewMode, setViewMode] = useState<"grid" | "table">("table");
  const [isSelectionEnabled, setIsSelectionEnabled] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedAttachment, setSelectedAttachment] = useState<Attachment | null>(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [itemsToDelete, setItemsToDelete] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const handleSortChange = (key: string, order: "asc" | "desc") => {
    setSortBy(key);
    setSortOrder(order);
    setPage(1);
  };

  const {
    data: attachmentsData,
    isLoading,
    refetch,
    isFetching,
  } = useGetAttachmentsQuery({
    page,
    limit,
    search,
    sort_by: sortBy,
    sort_order: sortOrder,
  });

  const [bulkDeleteAttachments, { isLoading: isDeleting }] = useBulkDeleteAttachmentsMutation();

  const attachments: Attachment[] = attachmentsData?.data || [];

  const handleSelectionChange = (ids: string[]) => {
    setSelectedItems(ids);
  };

  const handleGridSelect = (id: string) => {
    setSelectedItems((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const handleSelectAll = (checked: boolean) => {
    const currentPageIds = attachments.map((a) => a._id);
    if (checked) {
      const uniqueIds = Array.from(new Set([...selectedItems, ...currentPageIds]));
      setSelectedItems(uniqueIds);
    } else {
      setSelectedItems(selectedItems.filter((id) => !currentPageIds.includes(id)));
    }
  };

  const handleBulkDelete = () => {
    if (selectedItems.length === 0) return;
    setItemsToDelete(selectedItems);
    setIsConfirmModalOpen(true);
  };

  const handleSingleDelete = (id: string) => {
    setItemsToDelete([id]);
    setIsConfirmModalOpen(true);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
  };

  const confirmDelete = async () => {
    try {
      await bulkDeleteAttachments(itemsToDelete).unwrap();
      toast.success(itemsToDelete.length > 1 ? "Items deleted successfully" : "Item deleted successfully");

      // Update selection: remove deleted items from selectedItems
      setSelectedItems((prev) => prev.filter((id) => !itemsToDelete.includes(id)));

      if (itemsToDelete.includes(selectedAttachment?._id || "")) {
        setSelectedAttachment(null);
      }
      setIsConfirmModalOpen(false);
      setItemsToDelete([]);
    } catch (error) {
      toast.error("Failed to delete items");
      console.error(error);
    }
  };

  const columns: any[] = [
    {
      header: "Preview",
      className: "w-25",
      cell: (item: Attachment) => <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden flex items-center justify-center">{item?.mimeType?.startsWith("image/") ? <Image src={item.fileUrl} alt={item.fileName} className="w-full h-full object-cover" width={100} height={100} unoptimized /> : <span>📄</span>}</div>,
    },
    {
      header: "Name",
      accessorKey: "fileName",
      sortable: true,
      sortKey: "fileName",
      cell: (item: Attachment) => (
        <div
          className="cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            setSelectedAttachment(item);
          }}
        >
          {item.fileName}
        </div>
      ),
    },
    {
      header: "Type",
      accessorKey: "mimeType",
    },
    {
      header: "Size (KB)",
      sortable: true,
      sortKey: "fileSize",
      cell: (item: Attachment) => (item.fileSize / 1024).toFixed(2),
    },
    {
      header: "Created At",
      sortable: true,
      sortKey: "createdAt",
      cell: (item: Attachment) => formatDate(item.createdAt),
    },
    {
      header: "Action",
      className: "text-right",
      cell: (item: Attachment) => (
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            size="icon"
            className="w-10 h-10 border-none text-slate-400 hover:text-primary hover:bg-emerald-50 rounded-lg dark:hover:bg-primary/20 transition-all"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedAttachment(item);
            }}
          >
            <Edit2 size={13} />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="w-10 h-10 text-slate-400 hover:text-red-600 dark:text-red-500 hover:bg-red-50 rounded-lg transition-all dark:hover:bg-red-900/20 border-none"
            onClick={(e) => {
              e.stopPropagation();
              handleSingleDelete(item._id);
            }}
          >
            <Trash2 size={13} />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="sm:p-8 p-4 space-y-8">
      <CommonHeader
        title="Media Library"
        description="Manage and organize your media files"
        onSearch={(value) => {
          setSearch(value);
          setPage(1);
        }}
        searchTerm={search}
        searchPlaceholder="Search media"
        onRefresh={refetch}
        onAddClick={() => setIsUploadModalOpen(true)}
        addLabel="Add New"
        isLoading={isLoading}
        onBulkDelete={handleBulkDelete}
        selectedCount={selectedItems.length}
      >
        <div className="flex items-center gap-2 border-gray-200 dark:border-(--card-border-color) flex-wrap">
          <Button variant={"outline"} size="icon" onClick={() => setViewMode("table")} className={`h-11 w-11 rounded-lg ${viewMode === "table" ? "text-primary hover:text-primary border-(--light-primary) hover:bg-green-50 bg-green-50  dark:bg-(--page-body-bg) dark:border-none" : "bg-white text-gray-500 border-gray-200"}`}>
            <LayoutList className="h-5 w-5 text-primary" />
          </Button>
          <Button
            variant={"outline"}
            size="icon"
            onClick={() => {
              setViewMode("grid");
              if (selectedItems.length > 0) setIsSelectionEnabled(true);
            }}
            className={`h-11 w-11 rounded-lg ${viewMode === "grid" ? "text-primary border-green-200 dark:bg-(--dark-sidebar) bg-green-50" : "bg-white text-gray-500 border-gray-200"}`}
          >
            <Grid className="h-5 w-5" />
          </Button>
          {viewMode === "grid" && (
            <>
              <Button
                variant={"outline"}
                size="icon"
                onClick={() => {
                  if (isSelectionEnabled || selectedItems.length > 0) {
                    setSelectedItems([]);
                    setIsSelectionEnabled(false);
                  } else {
                    setIsSelectionEnabled(true);
                  }
                }}
                className={`h-11 w-11 rounded-lg transition-all ${isSelectionEnabled ? "text-green-600 border-green-200 bg-green-50" : "bg-white text-gray-500 border-gray-200"}`}
                title="Select Media"
              >
                <SquareCheckBig className="h-5 w-5 text-primary" />
              </Button>
              {isSelectionEnabled && (
                <div className="flex items-center gap-2 px-3 h-11 bg-white dark:bg-(--dark-sidebar) border border-slate-200 dark:border-(--card-border-color) rounded-lg animate-in fade-in slide-in-from-left-2 duration-200">
                  <Checkbox id="select-all-media" checked={attachments.length > 0 && attachments.every((a) => selectedItems.includes(a._id))} onCheckedChange={(checked) => handleSelectAll(checked === true)} />
                  <label htmlFor="select-all-media" className="text-sm font-medium text-slate-600 dark:text-gray-500 cursor-pointer select-none">
                    Select All
                  </label>
                </div>
              )}
            </>
          )}
        </div>
      </CommonHeader>

      {isLoading ? (
        <div className="flex justify-center p-12">
          <div className="flex flex-col items-center justify-center gap-3 text-slate-400">
            <div className="p-3 bg-emerald-50 dark:bg-emerald-500/10 rounded-full">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
            <span className="text-sm font-medium animate-pulse">Fetching records...</span>
          </div>
        </div>
      ) : (
        <>
          {viewMode === "grid" ? (
            <div className="space-y-4">
              <MediaGrid attachments={attachments} selectedItems={selectedItems} onSelect={handleGridSelect} onItemClick={setSelectedAttachment} isSelectionEnabled={isSelectionEnabled} />
              <Pagination totalCount={attachmentsData?.pagination?.totalItems || attachments.length} page={page} limit={limit} onPageChange={handlePageChange} onLimitChange={handleLimitChange} isLoading={isLoading || isFetching} />
            </div>
          ) : (
            <DataTable data={attachments} columns={columns} enableSelection={true} selectedIds={selectedItems} onSelectionChange={handleSelectionChange} getRowId={(item) => item._id} totalCount={attachmentsData?.pagination?.totalItems || attachments.length} page={page} limit={limit} onPageChange={handlePageChange} onLimitChange={handleLimitChange} isFetching={isFetching} onSortChange={handleSortChange} />
          )}
        </>
      )}

      <MediaUploadModal isOpen={isUploadModalOpen} onClose={() => setIsUploadModalOpen(false)} onUploadSuccess={refetch} />

      {selectedAttachment && <MediaDetailModal key={selectedAttachment._id} isOpen={true} onClose={() => setSelectedAttachment(null)} attachment={selectedAttachment} />}

      <ConfirmModal isOpen={isConfirmModalOpen} onClose={() => setIsConfirmModalOpen(false)} onConfirm={confirmDelete} isLoading={isDeleting} title={itemsToDelete.length > 1 ? "Delete Items" : "Delete Item"} subtitle={itemsToDelete.length > 1 ? `Are you sure you want to delete ${itemsToDelete.length} items? This action cannot be undone.` : "Are you sure you want to delete this item? This action cannot be undone."} confirmText="Delete" />
    </div>
  );
};

export default MediaPage;
