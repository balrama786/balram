/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Badge } from "@/src/elements/ui/badge";
import { Button } from "@/src/elements/ui/button";
import { useCreateContactMutation, useDeleteContactMutation, useGetContactQuery, useImportContactsMutation, useUpdateContactMutation } from "@/src/redux/api/contactApi";
import CommonHeader from "@/src/shared/CommonHeader";
import ConfirmModal from "@/src/shared/ConfirmModal";
import { DataTable } from "@/src/shared/DataTable";
import { Contact, CustomField } from "@/src/types/components";
import { Column } from "@/src/types/shared";
import { formatDate } from "@/src/utils";
import { Edit2, LayoutTemplate, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import ContactImportModal from "./ContactImportModal";
import ContactModal from "./ContactModal";
import ContactExportModal from "./ContactExportModal";
import { useGetCustomFieldsQuery } from "@/src/redux/api/customFieldApi";
import { maskSensitiveData } from "@/src/utils/masking";
import { useAppSelector } from "@/src/redux/hooks";
import { useContactImportSocket } from "@/src/hooks/useContactImportSocket";
import QuickChatSheet from "../chat/QuickChatSheet";
import WabaRequiredModal from "@/src/shared/WabaRequiredModal";
import { useGetWabaPhoneNumbersQuery } from "@/src/redux/api/whatsappApi";

const ContactPage = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkConfirmOpen, setBulkConfirmOpen] = useState(false);
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const { selectedWorkspace } = useAppSelector((state) => state.workspace);
  const selectedWabaId = selectedWorkspace?.waba_id;
  const { is_demo_mode } = useAppSelector((state) => state.setting);
  const importStatus = useAppSelector((state) => state.importProgress.status);

  const handleSortChange = (key: string, order: "asc" | "desc") => {
    setSortBy(key);
    setSortOrder(order);
    setPage(1);
  };

  const {
    data: contactsResult,
    isLoading,
    refetch,
    isFetching,
  } = useGetContactQuery({
    page,
    limit,
    search: searchTerm,
    sort_by: sortBy,
    sort_order: sortOrder,
  });

  // Handle real-time import updates via socket
  useContactImportSocket(refetch);

  const { data: customFieldsResult, isLoading: isFieldsLoading } = useGetCustomFieldsQuery({ page: 1, limit: 100 });
  const customFields: CustomField[] = customFieldsResult?.data?.fields || [];

  const [createContact, { isLoading: isCreating }] = useCreateContactMutation();
  const [updateContact, { isLoading: isUpdating }] = useUpdateContactMutation();
  const [deleteContact, { isLoading: isDeleting }] = useDeleteContactMutation();
  const [importContacts, { isLoading: isImporting }] = useImportContactsMutation();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [quickChatContact, setQuickChatContact] = useState<Contact | null>(null);
  const [quickChatOpen, setQuickChatOpen] = useState(false);
  const [noWabaModalOpen, setNoWabaModalOpen] = useState(false);

  // Fetch phone numbers for chat area
  const { data: phoneNumbersData } = useGetWabaPhoneNumbersQuery(selectedWabaId || "", { skip: !selectedWabaId });
  const phoneNumberId = useMemo(() => {
    const list = (phoneNumbersData as any)?.data || [];
    return list.length > 0 ? String(list[0].id) : undefined;
  }, [phoneNumbersData]);

  const contacts: Contact[] = contactsResult?.data?.contacts || [];
  const totalCount = contactsResult?.data?.pagination?.totalItems || 0;

  const initialColumns = [
    { id: "Name", label: "Name", isVisible: true },
    { id: "Phone", label: "Phone", isVisible: true },
    { id: "Source", label: "Source", isVisible: true },
    { id: "Tag", label: "Tag", isVisible: true },
    { id: "Email", label: "Email", isVisible: true },
    { id: "Status", label: "Status", isVisible: true },
    { id: "Assigned To", label: "Assigned To", isVisible: true },
    { id: "Created At", label: "Created At", isVisible: true },
    { id: "Actions", label: "Actions", isVisible: true },
  ];

  const [visibleColumns, setVisibleColumns] = useState(initialColumns);

  useEffect(() => {
    if (customFields.length > 0) {
      const dynamicColumns = customFields.map((field) => ({
        id: field.label,
        label: field.label,
        isVisible: true,
      }));

      const uniqueDynamicColumns = dynamicColumns.filter((dCol) => !initialColumns.some((iCol) => iCol.id === dCol.id));

      setVisibleColumns([...initialColumns, ...uniqueDynamicColumns]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customFieldsResult]);

  const handleColumnToggle = (columnId: string) => {
    setVisibleColumns((prev) => prev.map((col) => (col.id === columnId ? { ...col, isVisible: !col.isVisible } : col)));
  };

  const handleSave = async (data: Partial<Contact>) => {
    try {
      if (editingContact) {
        await updateContact({ id: editingContact._id, ...data }).unwrap();
        toast.success("Contact updated successfully");
      } else {
        await createContact(data).unwrap();
        toast.success("Contact created successfully");
      }
      setModalOpen(false);
    } catch (error: any) {
      toast.error(error?.data?.message || error?.data?.message || "Failed to save contact");
    }
  };

  const handleDelete = async () => {
    if (deleteId) {
      try {
        await deleteContact([deleteId]).unwrap();
        toast.success("Contact deleted successfully");
        setDeleteId(null);
      } catch (error: any) {
        toast.error(error?.data?.message || error?.data?.message || "Failed to delete contacts");
      }
    }
  };

  const handleBulkDelete = () => {
    if (selectedIds.length === 0) return;
    setBulkConfirmOpen(true);
  };

  const confirmBulkDelete = async () => {
    try {
      await deleteContact(selectedIds).unwrap();
      toast.success(`${selectedIds.length} contacts deleted successfully`);
      setSelectedIds([]);
    } catch (error: any) {
      toast.error(error?.data?.message || error?.data?.message || "Failed to delete contacts");
    } finally {
      setBulkConfirmOpen(false);
    }
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setPage(1);
  };

  const handleRefresh = () => {
    refetch();
    toast.success("Successfully refresh table.");
  };

  const handleExport = (type: "csv" | "excel" | "print") => {
    const selectedContacts = contacts.filter((c) => selectedIds.includes(c._id));
    if (selectedContacts.length === 0) {
      toast.error("Please select contacts to export");
      return;
    }

    const headers = visibleColumns.filter((col) => col.id !== "Actions").map((col) => col.label);

    const getRowData = (contact: Contact) => {
      return visibleColumns
        .filter((col) => col.id !== "Actions")
        .map((col) => {
          if (col.id === "Name") return contact.name;
          if (col.id === "Phone") return contact.phone_number;
          if (col.id === "Source") return contact.source;
          if (col.id === "Tag") return contact.tags?.map((t: any) => (t as any).label).join(", ") || "";
          if (col.id === "Email") return contact.email || "";
          if (col.id === "Status") return contact.status || "";
          if (col.id === "Assigned To") return contact.assigned_to || "";
          if (col.id === "Created At") return formatDate(contact.created_at);

          // Dynamic columns
          const field = customFields.find((f) => f.label === col.id);
          if (field) {
            const val = contact.custom_fields?.[field.name];
            if (field.type === "boolean") return val ? "Yes" : "No";
            return val || "";
          }
          return "";
        });
    };

    if (type === "csv") {
      const csvContent = [
        headers.join(","),
        ...selectedContacts.map((c) =>
          getRowData(c)
            .map((d) => `"${d}"`)
            .join(",")
        ),
      ].join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `contacts_export_${new Date().getTime()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("CSV exported successfully");
    } else if (type === "excel") {
      // Basic Excel export using HTML table format
      const tableHtml = `
        <html>
          <head>
            <meta charset="UTF-8">
            <style>
              table { border-collapse: collapse; width: 100%; }
              th, td { border: 1px solid #000; padding: 8px; text-align: left; }
              th { background-color: #f2f2f2; }
            </style>
          </head>
          <body>
            <h2>Contacts Export</h2>
            <table>
              <thead>
                <tr>${headers.map((h) => `<th>${h}</th>`).join("")}</tr>
              </thead>
              <tbody>
                ${selectedContacts
                  .map(
                    (c) => `
                  <tr>${getRowData(c)
                    .map((d) => `<td>${d}</td>`)
                    .join("")}</tr>
                `
                  )
                  .join("")}
              </tbody>
            </table>
          </body>
        </html>
      `;
      const blob = new Blob([tableHtml], { type: "application/vnd.ms-excel" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `contacts_export_${new Date().getTime()}.xls`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Excel exported successfully");
    } else if (type === "print") {
      const printWindow = window.open("", "_blank");
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Print Contacts</title>
              <style>
                body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; color: #333; padding: 20px; }
                h1 { color: #111; margin-bottom: 5px; }
                .meta { color: #666; font-size: 14px; margin-bottom: 25px; border-bottom: 2px solid #eee; padding-bottom: 10px; }
                table { width: 100%; border-collapse: collapse; margin-top: 10px; }
                th, td { border: 1px solid #e2e8f0; padding: 12px 10px; text-align: left; font-size: 13px; }
                th { background-color: #f8fafc; font-weight: 600; text-transform: uppercase; letter-spacing: 0.025em; color: #475569; }
                tr:nth-child(even) { background-color: #fbfcfe; }
                @media print {
                  @page { margin: 1cm; }
                  body { padding: 0; }
                }
              </style>
            </head>
            <body>
              <h1>Contacts Export</h1>
              <div class="meta">Exported ${selectedContacts.length} contacts on ${new Date().toLocaleString()}</div>
              <table>
                <thead>
                  <tr>${headers.map((h) => `<th>${h}</th>`).join("")}</tr>
                </thead>
                <tbody>
                  ${selectedContacts
                    .map(
                      (c) => `
                    <tr>${getRowData(c)
                      .map((d) => `<td>${d}</td>`)
                      .join("")}</tr>
                  `
                    )
                    .join("")}
                </tbody>
              </table>
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
          printWindow.print();
          printWindow.close();
        }, 250);
      }
    }
    setExportModalOpen(false);
  };

  const handleImport = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const result = await importContacts(formData).unwrap();
      toast.info(result?.message || "Import started. You can track progress in the background.");
      setImportModalOpen(false);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to import contacts");
    }
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
  };

  const onAddClick = () => {
    setEditingContact(null);
    setModalOpen(true);
  };

  const dynamicColumnDefs: Column<Contact>[] = customFields.map((field) => {
    return {
      header: field.label,
      cell: (row) => {
        return <span className="text-gray-600 dark:text-gray-400">{field.type !== "boolean" ? row.custom_fields?.[field.name] || "-" : Boolean(row.custom_fields?.[field.name]) ? "Yes" : "No"}</span>;
      },
    };
  });

  const isBaileys = selectedWorkspace?.waba_type === "baileys";

  const staticColumns: Column<Contact>[] = [
    {
      header: "Name",
      accessorKey: "name",
      sortable: true,
      sortKey: "name",
      cell: (row) => (
        <button
          onClick={() => {
            if (!phoneNumberId) {
              setNoWabaModalOpen(true);
              return;
            }
            setQuickChatContact(row);
            setQuickChatOpen(true);
          }}
          className="font-medium text-gray-900 dark:text-gray-400 hover:text-primary transition-colors text-left"
        >
          {row.name}
        </button>
      ),
    },
    {
      header: "Phone",
      sortable: true,
      sortKey: "phone_number",
      accessorKey: "phone_number",
      cell: (row) => <span className="text-gray-600 dark:text-gray-400">{maskSensitiveData(row.phone_number, "phone", is_demo_mode)}</span>,
    },
    {
      header: "Source",
      accessorKey: "source",
      cell: (row) => (
        <Badge variant="outline" className="bg-slate-50 dark:bg-(--card-color) text-slate-600 dark:text-gray-400 border-slate-200 dark:border-(--card-border-color)">
          {row.source}
        </Badge>
      ),
    },
    {
      header: "Tag",
      accessorKey: "tags",
      cell: (row) => {
        return (
          <div className="space-x-1">
            {row?.tags && row?.tags.length > 0
              ? row.tags?.map((item: any) => {
                  return (
                    <Badge key={item.label} style={{ backgroundColor: item.color }}>
                      {item.label}
                    </Badge>
                  );
                })
              : "-"}
          </div>
        );
      },
    },
    {
      header: "Email",
      sortable: true,
      sortKey: "email",
      accessorKey: "email",
      cell: (row) => <span className="text-gray-600 dark:text-gray-400">{maskSensitiveData(row.email, "email", is_demo_mode) || "-"}</span>,
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (row) => <span className="text-gray-600 dark:text-gray-400">{row.status || "-"}</span>,
    },
    {
      header: "Assigned To",
      accessorKey: "assigned_to",
      cell: (row) => <span className="text-gray-600 dark:text-gray-400">{row.assigned_to || "-"}</span>,
    },
    {
      header: "Created At",
      sortable: true,
      sortKey: "created_at",
      cell: (row) => <span className="text-gray-500 text-sm dark:text-gray-400">{formatDate(row.created_at)}</span>,
    },
    {
      header: "Actions",
      className: "text-right",
      cell: (row) => (
        <div className="flex justify-end gap-2">
          {!isBaileys && (
            <Button variant="outline" size="sm" className="h-10 w-10 p-0 rounded-lg bg-white border-none text-slate-500 hover:text-primary hover:border-emerald-200 hover:bg-emerald-50 dark:hover:bg-(--card-color) dark:bg-transparent dark:hover:text-amber-50 shadow-xs transition-all" onClick={() => router.push(`/campaigns/create?contact_id=${row._id}&redirect_to=/contacts`)} title="Send Template">
              <LayoutTemplate size={14} />
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            className="w-10 h-10 text-slate-400 hover:text-primary hover:bg-emerald-50 rounded-lg dark:hover:bg-primary/20 transition-all border-none"
            onClick={() => {
              setEditingContact(row);
              setModalOpen(true);
            }}
            disabled={is_demo_mode}
          >
            <Edit2 size={14} />
          </Button>
          <Button variant="outline" size="sm" className="w-10 h-10 text-slate-400 hover:text-red-600 dark:text-red-500 hover:bg-red-50 rounded-lg transition-all dark:hover:bg-red-900/20 border-none" onClick={() => setDeleteId(row._id)}>
            <Trash2 size={14} />
          </Button>
        </div>
      ),
    },
  ];

  const allColumns = [...staticColumns.slice(0, 7), ...dynamicColumnDefs, ...staticColumns.slice(7)];

  return (
    <div className="sm:p-8 p-4 space-y-8">
      <CommonHeader
        title="Contacts"
        description="Manage your contacts"
        onSearch={handleSearch}
        searchTerm={searchTerm}
        featureKey="contacts_used"
        searchPlaceholder="Search contacts..."
        onRefresh={handleRefresh}
        onExport={() => setExportModalOpen(true)}
        isExportDisabled={selectedIds.length === 0}
        onAddClick={onAddClick}
        addLabel="Add Contact"
        isLoading={isLoading}
        columns={visibleColumns}
        onColumnToggle={handleColumnToggle}
        onBulkDelete={handleBulkDelete}
        selectedCount={selectedIds.length}
      >
        <Button
          variant="outline"
          onClick={() => {
            const isImportRunning = importStatus === "started" || importStatus === "progress";
            if (isImportRunning) {
              toast.warning("Import already running. Please wait for it to complete.");
              return;
            }
            setImportModalOpen(true);
          }}
          className="h-11 px-4 gap-2 bg-white dark:bg-(--page-body-bg) border-slate-200 dark:border-none text-slate-600 dark:text-gray-400 rounded-lg font-semibold transition-all shadow-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
          <span className="inline text-sm">Import</span>
        </Button>
      </CommonHeader>

      <div className="bg-white dark:bg-(--card-color) rounded-lg border border-slate-200/60 mt-8 dark:border-(--card-border-color) shadow-sm overflow-hidden">
        <DataTable data={contacts} columns={allColumns.filter((col) => visibleColumns.find((vc) => vc.id === col.header)?.isVisible !== false)} isLoading={isLoading || isFieldsLoading} isFetching={isFetching || isDeleting} totalCount={totalCount} page={page} limit={limit} onPageChange={handlePageChange} onLimitChange={handleLimitChange} enableSelection={true} selectedIds={selectedIds} onSelectionChange={setSelectedIds} getRowId={(item) => item._id} emptyMessage={searchTerm ? `No contacts found matching "${searchTerm}"` : "No contacts found. Add your first contact."} className="border-none shadow-none rounded-none" onSortChange={handleSortChange} />
      </div>

      <ContactModal isOpen={modalOpen} onClose={() => setModalOpen(false)} onSave={handleSave} contact={editingContact} isLoading={isCreating || isUpdating} />

      <ContactImportModal isOpen={importModalOpen} onClose={() => setImportModalOpen(false)} onImport={handleImport} isLoading={isImporting} />

      <ContactExportModal isOpen={exportModalOpen} onClose={() => setExportModalOpen(false)} onExport={handleExport} selectedCount={selectedIds.length} />

      <ConfirmModal isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} isLoading={isDeleting} title="Delete Contact" subtitle="Are you sure you want to delete this contact? This action cannot be undone." confirmText="Delete" variant="danger" />
      <ConfirmModal isOpen={bulkConfirmOpen} onClose={() => setBulkConfirmOpen(false)} onConfirm={confirmBulkDelete} isLoading={isDeleting} title="Bulk Delete Contacts" subtitle={`Are you sure you want to delete ${selectedIds.length} selected contacts? This action cannot be undone.`} confirmText="Delete All" variant="danger" />

      <QuickChatSheet isOpen={quickChatOpen} onClose={() => setQuickChatOpen(false)} contact={quickChatContact} initialPhoneNumberId={phoneNumberId} />

      <WabaRequiredModal isOpen={noWabaModalOpen} onClose={() => setNoWabaModalOpen(false)} description="You haven't connected any WhatsApp Business Accounts to this workspace. Connect one now to start sending messages to your contacts." />
    </div>
  );
};

export default ContactPage;
