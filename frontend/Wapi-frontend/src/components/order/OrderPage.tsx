/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Badge } from "@/src/elements/ui/badge";
import { Button } from "@/src/elements/ui/button";
import { Order, OrderItem, useBulkDeleteOrdersMutation, useGetOrdersQuery } from "@/src/redux/api/orderApi";
import CommonHeader from "@/src/shared/CommonHeader";
import ConfirmModal from "@/src/shared/ConfirmModal";
import { DataTable } from "@/src/shared/DataTable";
import { Column } from "@/src/types/shared";
import { format } from "date-fns";
import { Eye, MessageSquareCode } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import OrderItemsModal from "./OrderItemsModal";
import { maskSensitiveData } from "@/src/utils/masking";
import { useAppSelector } from "@/src/redux/hooks";

const OrderPage = () => {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const { is_demo_mode } = useAppSelector((state) => state.setting);
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const handleSortChange = (key: string, order: "asc" | "desc") => {
    setSortBy(key);
    setSortOrder(order);
    setPage(1);
  };

  // Items modal state
  const [selectedOrderItems, setSelectedOrderItems] = useState<OrderItem[]>([]);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [isItemsModalOpen, setIsItemsModalOpen] = useState(false);

  const { data, isLoading, isFetching, refetch } = useGetOrdersQuery({ page, limit, search, sort_by: sortBy, sort_order: sortOrder });
  const [bulkDelete, { isLoading: isDeleting }] = useBulkDeleteOrdersMutation();

  const handleSearch = useCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, []);

  const handleDelete = async () => {
    try {
      const res = await bulkDelete({ ids: selectedIds }).unwrap();
      if (res.success) {
        toast.success(res.message || "Orders deleted successfully");
        setSelectedIds([]);
        setIsDeleteModalOpen(false);
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete orders");
    }
  };

  const handleViewItems = (order: Order) => {
    setSelectedOrderItems(order.items);
    setSelectedOrderId(order.wa_order_id || order._id);
    setIsItemsModalOpen(true);
  };

  const getStatusVariant = (status: string) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
      case "shipped":
        return "success";
      case "pending":
        return "warning";
      case "ready_to_ship":
      case "on_the_way":
        return "info";
      default:
        return "secondary";
    }
  };

  const columns: Column<Order>[] = [
    {
      header: "Order ID",
      sortable: true,
      sortKey: "wa_order_id",
      accessorKey: "wa_order_id",
      copyable: true,
      cell: (row) => row.wa_order_id || "N/A",
    },
    {
      header: "Customer",
      cell: (row) => (
        <div className="flex flex-col">
          <span className="font-bold text-slate-700 dark:text-slate-200">{maskSensitiveData(row.contact_id?.name, "phone", is_demo_mode)}</span>
          <span className="text-xs text-slate-400">{maskSensitiveData(row.contact_id?.email, "email", is_demo_mode) || "No email"}</span>
        </div>
      ),
    },
    {
      header: "Contact",
      sortable: true,
      sortKey: "phone_number",
      cell: (row) => maskSensitiveData(row.contact_id?.phone_number, "phone", is_demo_mode),
    },
    {
      header: "Amount",
      sortable: true,
      sortKey: "total_price",
      cell: (row) => (
        <span className="font-black text-primary">
          {row?.total_price?.toFixed(2)} {row.currency || "INR"}
        </span>
      ),
    },
    {
      header: "Status",
      sortable: true,
      sortKey: "status",
      cell: (row) => (
        <Badge variant={getStatusVariant(row?.status)} className="capitalize font-black px-3 py-1">
          {row?.status?.replace(/_/g, " ")}
        </Badge>
      ),
    },
    {
      header: "Date",
      sortable: true,
      sortKey: "created_at",
      cell: (row) => <span className="text-xs font-medium text-slate-500">{row?.created_at ? format(new Date(row.created_at), "MMM dd, yyyy HH:mm") : "—"}</span>,
    },
    {
      header: "Items",
      cell: (row) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleViewItems(row);
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/8 dark:bg-primary/15 hover:bg-primary/15 dark:hover:bg-primary/25 text-primary transition-all group"
          title={`View ${row.items?.length || 0} item(s)`}
        >
          <Eye size={14} className="group-hover:scale-110 transition-transform" />
          <span className="text-xs font-bold">{row.items?.length || 0}</span>
        </button>
      ),
    },
  ];

  return (
    <div className="p-4 sm:p-8">
      <CommonHeader
        title="Manage Orders"
        description="View and manage orders received through WhatsApp"
        onSearch={handleSearch}
        searchTerm={search}
        onRefresh={refetch}
        selectedCount={selectedIds.length}
        onBulkDelete={() => setIsDeleteModalOpen(true)}
        isLoading={isLoading || isFetching}
        rightContent={
          <Button onClick={() => router.push("/orders/auto-message")} className="flex items-center gap-2 px-6 bg-primary text-white h-12 rounded-lg font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all active:scale-95">
            <MessageSquareCode size={20} />
            Auto Message
          </Button>
        }
      />

      <DataTable data={data?.data?.orders || []} columns={columns as any} isLoading={isLoading} isFetching={isFetching} totalCount={data?.data?.pagination?.totalItems} page={page} limit={limit} onPageChange={setPage} onLimitChange={setLimit} enableSelection={true} selectedIds={selectedIds} onSelectionChange={setSelectedIds} getRowId={(row: Order) => row._id} emptyMessage="No orders found" onSortChange={handleSortChange} />

      {/* Items Preview Modal */}
      <OrderItemsModal isOpen={isItemsModalOpen} onClose={() => setIsItemsModalOpen(false)} items={selectedOrderItems} orderId={selectedOrderId} />

      {/* Bulk Delete Confirm */}
      <ConfirmModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} onConfirm={handleDelete} title="Delete Orders" subtitle={`Are you sure you want to delete ${selectedIds.length} order(s)? This action cannot be undone.`} confirmText="Delete" isLoading={isDeleting} variant="danger" />
    </div>
  );
};

export default OrderPage;
