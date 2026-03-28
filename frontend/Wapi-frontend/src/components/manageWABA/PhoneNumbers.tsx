"use client";

import { Badge } from "@/src/elements/ui/badge";
import { useGetWabaPhoneNumbersQuery } from "@/src/redux/api/whatsappApi";
import { useAppSelector } from "@/src/redux/hooks";
import CommonHeader from "@/src/shared/CommonHeader";
import { DataTable } from "@/src/shared/DataTable";
import { Column } from "@/src/types/shared";
import { maskSensitiveData } from "@/src/utils/masking";
import { useState } from "react";
import { toast } from "sonner";

interface WabaPhoneNumber {
  id: string;
  display_phone_number: string;
  verified_name: string;
  quality_rating: string;
  is_primary: string;
  code_verification_status: string;
  phone_number_id: string;
}

interface PhoneNumbersProps {
  wabaId: string;
}

import { useConnectWhatsAppDeleteMutation } from "@/src/redux/api/whatsappApi";
import ConfirmModal from "@/src/shared/ConfirmModal";

const PhoneNumbers = ({ wabaId }: PhoneNumbersProps) => {
  const { is_demo_mode } = useAppSelector((state) => state.setting);
  const [inputValue, setInputValue] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteConnection, { isLoading: isDeleting }] = useConnectWhatsAppDeleteMutation();

  const handleSortChange = (key: string, order: "asc" | "desc") => {
    setSortBy(key);
    setSortOrder(order);
  };

  const handleDisconnect = async () => {  
    try {
      await deleteConnection({ ids: [wabaId] }).unwrap();
      toast.success("WABA disconnected successfully");
      setIsDeleteModalOpen(false);
      window.location.href = "/manage_waba";
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to disconnect WABA");
    }
  };

  const [visibleColumns, setVisibleColumns] = useState([
    { id: "Verified Name", label: "Verified Name", isVisible: true },
    { id: "Phone Number", label: "Phone Number", isVisible: true },
    { id: "Phone Number ID", label: "Phone Number ID", isVisible: true },
    { id: "Quality", label: "Quality", isVisible: true },
    { id: "Status", label: "Status", isVisible: true },
  ]);

  const handleColumnToggle = (columnId: string) => {
    setVisibleColumns((prev) => prev.map((col) => (col.id === columnId ? { ...col, isVisible: !col.isVisible } : col)));
  };

  const {
    data: phoneNumbersResult,
    isLoading,
    isFetching,
    refetch,
  } = useGetWabaPhoneNumbersQuery(wabaId || "", {
    skip: !wabaId,
  });

  const rawPhoneNumbers = phoneNumbersResult?.data || [];
  const phoneNumbers = sortBy
    ? [...rawPhoneNumbers].sort((a, b) => {
        const aVal = String((a as Record<string, string>)[sortBy] ?? "").toLowerCase();
        const bVal = String((b as Record<string, string>)[sortBy] ?? "").toLowerCase();
        return sortOrder === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      })
    : rawPhoneNumbers;
  const totalCount = phoneNumbers.length;

  const columns: Column<WabaPhoneNumber>[] = [
    {
      header: "Verified Name",
      accessorKey: "verified_name",
      sortable: true,
      sortKey: "verified_name",
    },
    {
      header: "Phone Number",
      sortable: true,
      sortKey: "display_phone_number",
      accessorKey: "display_phone_number",
      cell: (row) => <p>{maskSensitiveData(row.display_phone_number, "phone", is_demo_mode)}</p>,

      copyable: true,
    },
    {
      header: "Phone Number ID",
      sortable: true,
      sortKey: "phone_number_id",
      accessorKey: "phone_number_id",
      cell: (row) => <p>{maskSensitiveData(row.phone_number_id, "phone", is_demo_mode)}</p>,

      copyable: true,
    },
    {
      header: "Quality",
      sortable: true,
      sortKey: "quality_rating",
      cell: (row) => (
        <Badge variant="outline" className={`font-medium ${row.quality_rating === "GREEN" ? "bg-emerald-50 text-primary border-emerald-100" : row.quality_rating === "YELLOW" ? "bg-amber-50 text-amber-700 border-amber-100" : "bg-rose-50 dark:bg-(--page-body-bg) dark:border-(--card-border-color) text-rose-700 border-rose-100"}`}>
          {row.quality_rating}
        </Badge>
      ),
    },
    {
      header: "Status",
      cell: (row) => (
        <Badge variant="outline" className={`font-medium ${row.is_primary ? "bg-emerald-50 text-primary border-emerald-100" : "bg-slate-50 dark:bg-(--page-body-bg) dark:border-(--card-border-color) dark:text-amber-50 text-slate-700 border-slate-100"}`}>
          {`${row.is_primary ? "Active" : "Inactive"}`}
        </Badge>
      ),
    },
  ];

  const handleRefresh = () => {
    refetch();
    toast.success("Successfully refreshed phone numbers.");
  };

  const handleSearch = (value: string) => {
    setInputValue(value);
  };

  return (
    <div className="sm:p-8 p-4 space-y-8">
      <CommonHeader backBtn title={"WABA Phone Numbers"} description="Manage your verified WhatsApp phone numbers" searchTerm={inputValue} onSearch={handleSearch} onRefresh={handleRefresh} isLoading={isLoading} columns={visibleColumns} onColumnToggle={handleColumnToggle} />

      <div className="bg-white rounded-lg border border-gray-100 dark:border-(--card-border-color) dark:bg-(--card-color) shadow-sm overflow-hidden mt-8">
        <DataTable data={phoneNumbers} columns={columns.filter((col) => visibleColumns.find((vc) => vc.id === col.header)?.isVisible !== false)} isLoading={isLoading} isFetching={isFetching} totalCount={totalCount} page={page} limit={limit} onPageChange={setPage} onLimitChange={setLimit} enableSelection={false} emptyMessage="No phone numbers found for this WABA." className="border-none shadow-none rounded-none" onSortChange={handleSortChange} />
      </div>

      <ConfirmModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} onConfirm={handleDisconnect} isLoading={isDeleting} title="Disconnect WABA" subtitle="Are you sure you want to disconnect this WABA? This will disable all active campaigns and automations linked to this account." confirmText="Disconnect" variant="danger" />
    </div>
  );
};

export default PhoneNumbers;
