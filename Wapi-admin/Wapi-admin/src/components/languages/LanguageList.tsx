"use client";

import { ImageBaseUrl } from "@/src/constants";
import { Button } from "@/src/elements/ui/button";
import { Switch } from "@/src/elements/ui/switch";
import { usePermissions } from "@/src/hooks/usePermissions";
import DataTable from "@/src/shared/DataTable";
import { Language } from "@/src/types/store";
import { BookOpen, Edit, Globe } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Can from "../shared/Can";

interface LanguageListProps {
  languages: Language[];
  onDelete: (id: string) => void;
  onBulkDelete: (ids: string[]) => void;
  onToggleStatus: (id: string) => void;
  isLoading: boolean;
  total: number;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  limit: number;
  onLimitChange: (limit: number) => void;
  onSelectionChange: (ids: string[]) => void;
  selectedIds: string[];
  onSortChange: (sortBy: string, sortOrder: "asc" | "desc") => void;
}

const LanguageList = ({ languages, onDelete, onBulkDelete, onToggleStatus, isLoading, total, page, totalPages, onPageChange, limit, onLimitChange, onSelectionChange, selectedIds, onSortChange }: LanguageListProps) => {
  const router = useRouter();
  const { hasPermission } = usePermissions();

  const columns = [
    {
      header: "Flag",
      className: "[@media(max-width:768px)]:min-w-[125px]",
      cell: (row: Language) => <div className="w-10 h-10 rounded-lg overflow-hidden border border-gray-100 dark:border-slate-800 bg-gray-50 flex items-center justify-center">{row.flag ? <Image src={ImageBaseUrl + "/" + row.flag} alt={row.name} width={100} height={100} className="w-full h-full object-cover" unoptimized /> : <Globe className="w-5 h-5 text-gray-400" />}</div>,
    },
    {
      header: "Name",
      accessorKey: "name" as keyof Language,
      sortable: true,
      className: "font-medium [@media(max-width:768px)]:min-w-[120px]",
    },
    {
      header: "Locale",
      className: " [@media(max-width:768px)]:min-w-[115px]",
      accessorKey: "locale" as keyof Language,
      sortable: true,
    },
    {
      header: "RTL",
      className: " [@media(max-width:768px)]:min-w-[100px]",
      cell: (row: Language) => <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${row.is_rtl ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"}`}>{row.is_rtl ? "Yes" : "No"}</span>,
    },
    {
      header: "Status",
      className: " [@media(max-width:768px)]:min-w-[100px]",
      cell: (row: Language) => <Switch checked={row.is_active} onCheckedChange={() => onToggleStatus(row._id)} disabled={isLoading || !hasPermission("update.languages")} className="data-[state=checked]:bg-(--text-green-primary)" />,
    },
  ];

  const renderActions = (row: Language) => (
    <div className="flex items-center gap-2">
      <Can permission="update.languages">
        <Button variant="ghost" size="icon" onClick={() => router.push(`/languages/translations/${row._id}`)} className="w-10 h-10 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg dark:hover:bg-blue-900/20 transition-all" title="Manage Translations">
          <BookOpen size={16} />
        </Button>
      </Can>

      <Can permission="update.languages">
        <Button variant="ghost" size="icon" onClick={() => router.push(`/languages/edit/${row._id}`)} className="w-10 h-10 text-slate-400 hover:text-(--text-green-primary) hover:bg-emerald-50 rounded-lg dark:hover:bg-primary/20 transition-all" title="Edit Language">
          <Edit size={16} />
        </Button>
      </Can>
    </div>
  );

  return <DataTable data={languages} columns={columns} page={page} totalPages={totalPages} total={total} onPageChange={onPageChange} onLimitChange={onLimitChange} limit={limit} onDelete={(item: Language) => onDelete(item._id)} deletePermission="delete.languages" actionPermissions={["update.languages"]} onBulkDelete={onBulkDelete} isLoading={isLoading} itemLabel="Languages" itemLabelSingular="Language" renderActions={renderActions} onSelectionChange={onSelectionChange} selectedIds={selectedIds} onSortChange={onSortChange} />;
};

export default LanguageList;
