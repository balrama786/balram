/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/src/elements/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/src/elements/ui/dialog";
import { useBulkDeleteShortLinksMutation, useGetShortLinksQuery } from "@/src/redux/api/shortLinkApi";
import { useAppSelector } from "@/src/redux/hooks";
import CommonHeader from "@/src/shared/CommonHeader";
import ConfirmModal from "@/src/shared/ConfirmModal";
import { DataTable } from "@/src/shared/DataTable";
import { Column } from "@/src/types/shared";
import { ShortLinkData } from "@/src/types/short-link";
import { maskSensitiveData } from "@/src/utils/masking";
import { Copy, Edit, ExternalLink, Link2, QrCode, Trash2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useMemo, useState } from "react";
import { toast } from "sonner";

const ShortLinkTable: React.FC = () => {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{ key: string; order: "asc" | "desc" }>({ key: "created_at", order: "desc" });
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
  const [qrCodeItem, setQrCodeItem] = useState<ShortLinkData | null>(null);
  const { is_demo_mode } = useAppSelector((state) => state.setting);

  const {
    data: response,
    isLoading,
    isFetching,
    refetch,
  } = useGetShortLinksQuery({
    page,
    limit,
    search: searchTerm,
    sort_by: sortConfig.key,
    sort_order: sortConfig.order,
  });

  const [bulkDelete, { isLoading: isBulkDeleting }] = useBulkDeleteShortLinksMutation();

  const handlePageChange = (newPage: number) => setPage(newPage);
  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
  };

  const handleSortChange = (key: string, order: "asc" | "desc") => {
    setSortConfig({ key, order });
  };

  const handleSingleDelete = async () => {
    if (!deleteId) return;
    try {
      await bulkDelete({ ids: [deleteId] }).unwrap();
      toast.success("Short link deleted successfully");
      setDeleteId(null);
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete short link");
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    try {
      await bulkDelete({ ids: selectedIds }).unwrap();
      toast.success(`${selectedIds.length} short links deleted successfully`);
      setSelectedIds([]);
      setIsBulkDeleteModalOpen(false);
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete short links");
    }
  };

  const downloadQRCode = (dataUrl: string, code: string) => {
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = `qrcode-${code}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const initialColumns = [
    { id: "Mobile", label: "Mobile", isVisible: true },
    { id: "First Message", label: "First Message", isVisible: true },
    { id: "Short Link", label: "Short Link", isVisible: true },
    { id: "Clicks", label: "Clicks", isVisible: true },
    { id: "Actions", label: "Actions", isVisible: true },
  ];

  const [visibleColumns, setVisibleColumns] = useState(initialColumns);

  const handleColumnToggle = (columnId: string) => {
    setVisibleColumns((prev) => prev.map((col) => (col.id === columnId ? { ...col, isVisible: !col.isVisible } : col)));
  };

  const columns = useMemo<Column<ShortLinkData>[]>(
    () => [
      {
        header: "Mobile",
        className: "[@media(max-width:1636px)]:min-w-[230px]",
        accessorKey: "mobile",
        copyable: true,
        cell: (item) => <div>{maskSensitiveData(item.mobile, "phone", is_demo_mode)}</div>,
      },
      {
        header: "First Message",
        className: "[@media(max-width:1636px)]:min-w-[240px]",
        cell: (item) => <div className="max-w-xs truncate">{item.first_message}</div>,
      },
      {
        header: "Short Link",
        className: "[@media(max-width:1636px)]:min-w-[460px]",
        accessorKey: "short_link",
        copyable: true,
      },
      {
        header: "Clicks",
        className: "[@media(max-width:1636px)]:min-w-[150px]",
        accessorKey: "click_count",
      },
      {
        header: "Actions",
        className: "[@media(max-width:1636px)]:min-w-[250px] text-right",
        cell: (item) => (
          <div className="flex items-center justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                navigator.clipboard.writeText(item.short_link);
                toast.success("Link copied!");
              }}
              className="w-10 h-10 border-none text-slate-400 hover:text-primary hover:bg-emerald-50 rounded-lg dark:hover:bg-primary/20 transition-all"
              title="Copy Link"
            >
              <Link2 size={14} />
            </Button>
            <Button variant="outline" size="sm" onClick={() => setQrCodeItem(item)} className="w-10 h-10 p-0 text-slate-400 border-none" title="QR Code">
              <QrCode size={14} />
            </Button>
            <Button variant="outline" size="sm" onClick={() => router.push(`/tools/links/config/${item._id}`)} className="w-10 h-10 border-none text-slate-400 hover:text-primary hover:bg-emerald-50 rounded-lg dark:hover:bg-primary/20 transition-all" title="Edit">
              <Edit size={14} />
            </Button>
            <Button variant="outline" size="sm" onClick={() => setDeleteId(item._id)} className="w-10 h-10 border-none text-slate-400 hover:text-red-600 dark:text-red-500 hover:bg-red-50 rounded-lg transition-all dark:hover:bg-red-900/20" title="Delete">
              <Trash2 size={14} />
            </Button>
          </div>
        ),
      },
    ],
    [router, is_demo_mode]
  );

  return (
    <div className="space-y-6">
      <CommonHeader
        title="WhatsApp Link Generator"
        description="Generate and manage direct chat links for your WhatsApp numbers."
        onSearch={(val) => {
          setSearchTerm(val);
          setPage(1);
        }}
        searchTerm={searchTerm}
        searchPlaceholder="Search by mobile or code..."
        onRefresh={() => {
          refetch();
          toast.success("Refreshed");
        }}
        columns={visibleColumns}
        onColumnToggle={handleColumnToggle}
        onBulkDelete={() => setIsBulkDeleteModalOpen(true)}
        selectedCount={selectedIds.length}
        rightContent={
          <div className="flex items-center gap-2">
            <Button onClick={() => router.push("/tools/link-generator")} className="gap-2 h-11 px-4 dark:text-white">
              <ExternalLink size={16} />
              <span className="dark:text-white">Create Link</span>
            </Button>
          </div>
        }
      />

      <div className="bg-white dark:bg-(--card-color) rounded-lg border border-slate-200/60 dark:border-(--card-border-color) shadow-sm overflow-hidden">
        <DataTable<ShortLinkData> data={response?.data?.short_links || []} columns={columns.filter((col) => visibleColumns.find((vc) => vc.label === col.header)?.isVisible !== false)} isLoading={isLoading} isFetching={isFetching} totalCount={response?.data?.pagination?.totalItems || 0} page={page} limit={limit} onPageChange={handlePageChange} onLimitChange={handleLimitChange} onSortChange={handleSortChange} enableSelection selectedIds={selectedIds} onSelectionChange={setSelectedIds} getRowId={(item) => item._id} emptyMessage={searchTerm ? `No links found for "${searchTerm}"` : "No WhatsApp links generated yet."} />
      </div>

      <ConfirmModal isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleSingleDelete} isLoading={isBulkDeleting} title="Delete Short Link" subtitle="Are you sure you want to delete this short link? This action cannot be undone." variant="danger" />

      <ConfirmModal isOpen={isBulkDeleteModalOpen} onClose={() => setIsBulkDeleteModalOpen(false)} onConfirm={handleBulkDelete} isLoading={isBulkDeleting} title="Bulk Delete" subtitle={`Are you sure you want to delete ${selectedIds.length} short links? This action cannot be undone.`} variant="danger" />

      <Dialog open={!!qrCodeItem} onOpenChange={(open) => !open && setQrCodeItem(null)}>
        <DialogContent className="sm:max-w-md dark:bg-(--card-color) dark:border-(--card-border-color)">
          <DialogHeader>
            <DialogTitle>QR Code & Link</DialogTitle>
          </DialogHeader>
          {qrCodeItem && (
            <div className="flex flex-col items-center gap-6 py-4">
              <div className="p-4 bg-white rounded-xl shadow-inner border border-slate-100">
                <Image src={qrCodeItem.qr_code} alt="QR Code" width={200} height={200} className="rounded-lg" />
              </div>
              <div className="w-full space-y-4">
                <div className="p-3 bg-slate-50 dark:bg-(--page-body-bg) rounded-lg border border-slate-200 dark:border-(--card-border-color) break-all text-sm font-mono text-center">{qrCodeItem.short_link}</div>
                <div className="flex gap-2 flex-wrap">
                  <Button
                    className="flex-1 gap-2 dark:text-white"
                    onClick={() => {
                      navigator.clipboard.writeText(qrCodeItem.short_link);
                      toast.success("Link copied!");
                    }}
                  >
                    <Copy size={16} />
                    Copy Link
                  </Button>
                  <Button variant="outline" className="flex-1 gap-2 dark:hover:bg-(--table-hover)" onClick={() => downloadQRCode(qrCodeItem.qr_code, qrCodeItem.short_code)}>
                    <QrCode size={16} />
                    Download QR
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ShortLinkTable;
