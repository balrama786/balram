"use client";

import { Button } from "@/src/elements/ui/button";
import { useBulkDeleteWidgetsMutation, useDeleteWidgetMutation, useGetAllWidgetsQuery } from "@/src/redux/api/widgetApi";
import { useAppSelector } from "@/src/redux/hooks";
import CommonHeader from "@/src/shared/CommonHeader";
import ConfirmModal from "@/src/shared/ConfirmModal";
import { DataTable } from "@/src/shared/DataTable";
import { Column } from "@/src/types/shared";
import { WidgetData } from "@/src/types/widget";
import { maskSensitiveData } from "@/src/utils/masking";
import { Edit, MessageSquare, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useMemo, useState } from "react";
import { toast } from "sonner";

const WidgetTable: React.FC = () => {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
  const { is_demo_mode } = useAppSelector((state) => state.setting);

  const {
    data: widgetsResponse,
    isLoading,
    isFetching,
    refetch,
  } = useGetAllWidgetsQuery({
    page,
    limit,
    search: searchTerm,
  });

  const [deleteWidget, { isLoading: isDeleting }] = useDeleteWidgetMutation();
  const [bulkDeleteWidgets, { isLoading: isBulkDeleting }] = useBulkDeleteWidgetsMutation();

  const initialColumns = [
    { id: "Logo", label: "Logo", isVisible: true },
    { id: "Header Text", label: "Header Text", isVisible: true },
    { id: "Welcome Text", label: "Welcome Text", isVisible: true },
    { id: "Phone Number ID", label: "Phone Number ID", isVisible: true },
    { id: "Embed Code", label: "Embed Code", isVisible: true },
    { id: "Position", label: "Position", isVisible: true },
    { id: "Actions", label: "Actions", isVisible: true },
  ];

  const [visibleColumns, setVisibleColumns] = useState(initialColumns);

  const handleColumnToggle = (columnId: string) => {
    setVisibleColumns((prev) => prev.map((col) => (col.id === columnId ? { ...col, isVisible: !col.isVisible } : col)));
  };

  const handleSingleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteWidget(deleteId).unwrap();
      toast.success("Widget deleted successfully");
      setDeleteId(null);
      refetch();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete widget");
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    try {
      await bulkDeleteWidgets({ ids: selectedIds }).unwrap();
      toast.success(`${selectedIds.length} widgets deleted successfully`);
      setSelectedIds([]);
      setIsBulkDeleteModalOpen(false);
      refetch();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete widgets");
    }
  };

  const widgets = useMemo(() => widgetsResponse?.data?.widgets || [], [widgetsResponse]);

  const columns = useMemo<Column<WidgetData>[]>(
    () => [
      {
        header: "Logo",
        cell: (item) => (
          <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center overflow-hidden">
            {item.widget_image_url || (typeof item.widget_image === "string" && item.widget_image) ? (
              <div className="relative w-full h-full">
                <Image src={(item.widget_image_url || item.widget_image) as string} alt="logo" fill className="object-cover" unoptimized />
              </div>
            ) : (
              <div className="p-2 text-slate-400 group-hover:text-primary transition-colors">
                <MessageSquare size={16} />
              </div>
            )}
          </div>
        ),
      },
      {
        header: "Header Text",
        className: "[@media(max-width:1870px)]:min-w-[165px]",
        accessorKey: "header_text",
      },
      {
        header: "Welcome Text",
        className: "[@media(max-width:1870px)]:min-w-[210px]",
        cell: (item) => (
          <div className="break-all">
            <div className="whitespace-normal">{item.welcome_text}</div>
          </div>
        ),
      },
      {
        header: "Phone Number ID",
        className: "[@media(max-width:1870px)]:min-w-[195px]",
        accessorKey: "whatsapp_phone_number",
        copyable: true,
        cell: (item) => <div>{maskSensitiveData(item.whatsapp_phone_number, "phone", is_demo_mode)}</div>,
      },
      {
        header: "Embed Code",
        className: "[@media(max-width:1870px)]:min-w-[405px]",
        accessorKey: "embed_code",
        cell: (item) => (
          <div className="break-all">
            <div className="whitespace-normal">{item.embed_code}</div>
          </div>
        ),
        copyable: true,
      },
      {
        header: "Position",
        className: "[@media(max-width:1870px)]:min-w-[145px]",
        accessorKey: "widget_position",
      },
      {
        header: "Actions",
        className: "[@media(max-width:1870px)]:min-w-[145px] text-right",
        cell: (item) => (
          <div className="flex items-center justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => router.push(`/tools/widgets/config/${item._id}`)} className="w-10 h-10 text-slate-400 hover:text-primary border-none hover:bg-emerald-50 rounded-lg dark:hover:bg-primary/20 transition-all" title="Edit Widget">
              <Edit size={14} />
            </Button>
            <Button variant="outline" size="sm" onClick={() => setDeleteId(item._id || null)} className="w-10 h-10 text-slate-400 hover:text-red-600 dark:text-red-500 hover:bg-red-50 rounded-lg transition-all border-none dark:hover:bg-red-900/20" title="Delete Widget">
              <Trash2 size={14} />
            </Button>
          </div>
        ),
      },
    ],
    [is_demo_mode, router]
  );

  return (
    <div className="space-y-6">
      <CommonHeader
        title="Chatbot Widgets"
        description="Manage your WhatsApp chatbot widgets."
        onSearch={(val) => {
          setSearchTerm(val);
          setPage(1);
        }}
        searchTerm={searchTerm}
        searchPlaceholder="Search widgets..."
        onRefresh={() => {
          refetch();
          toast.success("Widgets refreshed");
        }}
        columns={visibleColumns}
        onColumnToggle={handleColumnToggle}
        selectedCount={selectedIds.length}
        onBulkDelete={() => setIsBulkDeleteModalOpen(true)}
        rightContent={
          <Button onClick={() => router.push("/tools/widget")} className="gap-2 h-11 px-4 dark:text-white">
            <Plus size={16} />
            <span className="dark:text-white">Create New Widget</span>
          </Button>
        }
      />

      <div className="bg-white dark:bg-(--card-color) rounded-lg border border-slate-200/60 dark:border-(--card-border-color) shadow-sm overflow-hidden">
        <DataTable<WidgetData>
          data={widgets}
          columns={columns.filter((col) => visibleColumns.find((vc) => vc.label === col.header)?.isVisible !== false)}
          isLoading={isLoading}
          isFetching={isFetching}
          totalCount={widgetsResponse?.data?.pagination?.totalItems || 0}
          page={page}
          limit={limit}
          onPageChange={setPage}
          onLimitChange={(newLimit) => {
            setLimit(newLimit);
            setPage(1);
          }}
          enableSelection
          selectedIds={selectedIds}
          onSelectionChange={setSelectedIds}
          getRowId={(item) => item._id || ""}
          emptyMessage={searchTerm ? `No widgets found matching "${searchTerm}"` : "No widgets found. Go ahead and create one!"}
          className="border-none shadow-none rounded-none"
        />
      </div>

      <ConfirmModal isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleSingleDelete} isLoading={isDeleting} title="Delete Widget" subtitle="Are you sure you want to delete this widget? This action cannot be undone." variant="danger" confirmText="Delete" />

      <ConfirmModal isOpen={isBulkDeleteModalOpen} onClose={() => setIsBulkDeleteModalOpen(false)} onConfirm={handleBulkDelete} isLoading={isBulkDeleting} title="Bulk Delete Widgets" subtitle={`Are you sure you want to delete ${selectedIds.length} widgets? This action cannot be undone.`} variant="danger" confirmText="Delete Selection" />
    </div>
  );
};

export default WidgetTable;
