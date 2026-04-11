"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import CommonHeader from "@/src/shared/CommonHeader";
import DataTable from "@/src/shared/DataTable";
import { useGetShortLinksQuery } from "@/src/redux/api/shortLinkApi";
import { GetShortLinksParams, ShortLink } from "@/src/types/store";
import { format } from "date-fns";
import { ExternalLink, User } from "lucide-react";
import { ColumnDef } from "@/src/types/shared";
import Link from "next/link";

const UsersLinks = () => {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const queryParams: GetShortLinksParams = {
    page,
    limit,
    search: search || undefined,
    sort_by: sortBy,
    sort_order: sortOrder,
  };

  const { data, isLoading, refetch } = useGetShortLinksQuery(queryParams);

  const shortLinks = data?.data?.short_links ?? [];
  const pagination = data?.data?.pagination;
  const totalPages = pagination?.totalPages ?? 1;
  const total = pagination?.totalItems ?? 0;

  const handleSortChange = (key: string, order: "asc" | "desc") => {
    setSortBy(key);
    setSortOrder(order);
    setPage(1);
  };

  const handleRefresh = () => {
    refetch();
    toast.info(t("common.refreshed"));
  };

  const columns: ColumnDef<ShortLink>[] = [
    {
      header: "User",
      className: "[@media(max-width:1428px)]:min-w-[210px]",
      accessorKey: "user",
      copyable: true,
      copyField: "user.email",
      cell: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
            <User size={14} />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">{row.user?.name || "N/A"}</span>
            <span className="text-[11px] text-gray-400 truncate">{row.user?.email || "N/A"}</span>
          </div>
        </div>
      ),
    },
    {
      header: "Short Code",
      className: "[@media(max-width:1428px)]:min-w-[370px]",
      accessorKey: "short_link",
      sortable: true,
      copyable: true,
      cell: (row) => (
        <div className="flex flex-col">
          <span className="font-medium text-gray-900 dark:text-gray-100 uppercase tracking-tight">{row.short_code}</span>
          <Link href={row.short_link} target="_blank" rel="noopener noreferrer" className="text-[10px] text-primary hover:underline flex items-center gap-1 mt-0.5">
            <ExternalLink size={10} />
            {row.short_link}
          </Link>
        </div>
      ),
    },
    {
      header: "Mobile",
      className: "font-medium [@media(max-width:1428px)]:min-w-[230px]",
      accessorKey: "mobile",
      sortable: true,
      copyable: true,
    },
    {
      header: "Clicks",
      accessorKey: "click_count",
      sortable: true,
      className: "text-center",
      cell: (row) => (
        <div className="flex justify-center">
          <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-(--dark-body) text-[11px] font-bold text-slate-600 dark:text-slate-400">{row.click_count}</span>
        </div>
      ),
    },
    {
      header: "Created at",
      className: "[@media(max-width:1428px)]:min-w-[170px]",
      accessorKey: "created_at",
      sortable: true,
      cell: (row) => <span className="text-gray-400 text-sm">{row.created_at ? format(new Date(row.created_at), "MMM dd, yyyy HH:mm") : "N/A"}</span>,
    },
  ];

  return (
    <div className="flex flex-col min-h-full">
      <CommonHeader title={t("nav.link_generator")} description="View and track all user-generated WhatsApp short links across the platform." searchTerm={search} onSearch={setSearch} onRefresh={handleRefresh} isLoading={isLoading} />

      <div className="mt-6">
        <DataTable
          data={shortLinks}
          columns={columns}
          page={page}
          totalPages={totalPages}
          total={total}
          limit={limit}
          isLoading={isLoading}
          onPageChange={setPage}
          onLimitChange={(l) => {
            setLimit(l);
            setPage(1);
          }}
          onSortChange={handleSortChange}
          emptyMessage="No short links found."
          itemLabel="short links"
          getRowId={(row) => row._id}
        />
      </div>
    </div>
  );
};

export default UsersLinks;
