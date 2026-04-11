"use client";

import { Button } from "@/src/elements/ui/button";
import { Switch } from "@/src/elements/ui/switch";
import { usePermissions } from "@/src/hooks/usePermissions";
import DataTable from "@/src/shared/DataTable";
import { Currency } from "@/src/types/store";
import { Edit } from "lucide-react";
import { useRouter } from "next/navigation";
import Can from "../shared/Can";

interface CurrencyListProps {
  currencies: Currency[];
  onDelete: (id: string) => void;
  onBulkDelete: (ids: string[]) => void;
  onToggleStatus: (id: string) => void;
  onToggleDefault: (id: string) => void;
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
  visibleColumns?: string[];
}

const CurrencyList = ({ currencies, onDelete, onBulkDelete, onToggleStatus, onToggleDefault, isLoading, total, page, totalPages, onPageChange, limit, onLimitChange, onSelectionChange, selectedIds, onSortChange, visibleColumns }: CurrencyListProps) => {
  const router = useRouter();
  const { hasPermission } = usePermissions();

  const allColumns = [
    {
      id: "name",
      header: "Name",
      className: "[@media(max-width:1499px)]:min-w-[295px] font-medium",
      accessorKey: "name" as keyof Currency,
      sortable: true,
    },
    {
      id: "code",
      className: "[@media(max-width:1499px)]:min-w-[125px] ",
      header: "Code",
      accessorKey: "code" as keyof Currency,
      sortable: true,
    },
    {
      id: "symbol",
      className: "[@media(max-width:1499px)]:min-w-[130px] ",
      header: "Symbol",
      accessorKey: "symbol" as keyof Currency,
      sortable: true,
    },
    {
      id: "exchange_rate",
      className: "[@media(max-width:1499px)]:min-w-[175px] ",
      header: "Exchange Rate",
      accessorKey: "exchange_rate" as keyof Currency,
      sortable: true,
      cell: (row: Currency) => <span>{row.exchange_rate}</span>,
    },
    {
      id: "decimal_number",
      className: "[@media(max-width:1499px)]:min-w-[125px] ",
      header: "Decimal",
      accessorKey: "decimal_number" as keyof Currency,
      sortable: true,
    },
    {
      id: "default",
      className: "[@media(max-width:1499px)]:min-w-[110px] ",
      header: "Default",
      cell: (row: Currency) => (
        <div className="flex items-center justify-center">
          <Switch checked={row.is_default} onCheckedChange={() => !row.is_default && onToggleDefault(row._id)} disabled={isLoading || !hasPermission("update.currencies")} className="data-[state=checked]:bg-(--text-green-primary)" />
        </div>
      ),
    },
    {
      id: "status",
      className: "[@media(max-width:1499px)]:min-w-[110px] ",
      header: "Status",
      cell: (row: Currency) => <Switch checked={row.is_active} onCheckedChange={() => onToggleStatus(row._id)} disabled={isLoading || !hasPermission("update.currencies")} className="data-[state=checked]:bg-(--text-green-primary)" />,
    },
  ];

  const columns = visibleColumns ? allColumns.filter((col) => visibleColumns.includes(col.id)) : allColumns;

  const renderActions = (row: Currency) => (
    <div className="flex items-center gap-2">
      <Can permission="update.currencies">
        <Button variant="ghost" size="icon" onClick={() => router.push(`/currencies/edit/${row._id}`)} className="w-10 h-10 text-slate-400 hover:text-(--text-green-primary) hover:bg-emerald-50 rounded-lg dark:hover:bg-primary/20 transition-all" title="Edit Currency">
          <Edit size={16} />
        </Button>
      </Can>
    </div>
  );

  return <DataTable data={currencies} columns={columns} page={page} totalPages={totalPages} total={total} onPageChange={onPageChange} onLimitChange={onLimitChange} limit={limit} onDelete={(item: Currency) => onDelete(item._id)} deletePermission="delete.currencies" actionPermissions={["update.currencies"]} onBulkDelete={onBulkDelete} isLoading={isLoading} itemLabel="Currencies" itemLabelSingular="Currency" renderActions={renderActions} onSelectionChange={onSelectionChange} selectedIds={selectedIds} onSortChange={onSortChange} />;
};

export default CurrencyList;
