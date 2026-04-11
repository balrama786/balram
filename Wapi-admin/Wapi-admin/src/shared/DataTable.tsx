/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/src/elements/ui/button";
import { Checkbox } from "@/src/elements/ui/checkbox";
import ConfirmModal from "@/src/shared/ConfirmModal";
import { ChevronDown, ChevronUp, ChevronsUpDown, Copy, Trash2 } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import { Pagination } from "./Pagination";
import { useAppSelector } from "../redux/hooks";
import { usePermissions } from "../hooks/usePermissions";
import { toast } from "sonner";
import Can from "../components/shared/Can";
import { DataTableProps } from "../types/shared";

const DataTable = <T,>({ data, columns, page = 1, total = 0, onPageChange, onLimitChange, tableClassName, pagination = true, limit, onDelete, onBulkDelete, isLoading = false, emptyMessage = "No items found.", itemLabel = "items", itemLabelSingular, itemsPerPage, getRowId = (row: T) => (row as any)?._id, renderActions, onSelectionChange, selectionClassName = "", actionClassName = "", columnClassNames = [], selectedIds: controlledSelectedIds, onSortChange, deletePermission, actionPermissions = [], canDelete }: DataTableProps<T>) => {
  const { hasPermission, hasAnyPermission } = usePermissions();
  const { data: appSettings } = useAppSelector((state) => state.settings);
  const is_demo_mode = appSettings.is_demo_mode || false;
  const singularLabel = itemLabelSingular || itemLabel.slice(0, -1);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [bulkDeleteIds, setBulkDeleteIds] = useState<string[] | null>(null);
  const [internalSelectedIds, setInternalSelectedIds] = useState<string[]>([]);
  const headerCheckboxRef = useRef<HTMLInputElement>(null);

  const selectedIds = controlledSelectedIds !== undefined ? controlledSelectedIds : internalSelectedIds;
  const setSelectedIds = controlledSelectedIds !== undefined && onSelectionChange ? onSelectionChange : setInternalSelectedIds;

  const currentPage = page || 1;
  const totalCount = total || 0;

  const [activeSortKey, setActiveSortKey] = React.useState<string | null>(null);
  const [sortOrder, setSortOrderState] = React.useState<"asc" | "desc">("asc");

  const handleSort = (key: string) => {
    if (!onSortChange) return;
    const newOrder = activeSortKey === key && sortOrder === "asc" ? "desc" : "asc";
    setActiveSortKey(key);
    setSortOrderState(newOrder);
    onSortChange(key, newOrder);
  };

  const getSortIcon = (column: (typeof columns)[0]) => {
    if (!column.sortable) return null;
    const key = column.sortKey || column.header;
    if (activeSortKey !== key) return <ChevronsUpDown size={13} className="text-gray-400 shrink-0" />;
    return sortOrder === "asc" ? <ChevronUp size={13} className="text-primary shrink-0" /> : <ChevronDown size={13} className="text-primary shrink-0" />;
  };

  const handleCopy = (e: React.MouseEvent, value: string) => {
    e.stopPropagation();
    if (is_demo_mode) return;
    navigator.clipboard.writeText(value);
    toast.success("Copied to clipboard");
  };

  const handleDeleteClick = (id: string) => {
    if (onDelete) {
      setDeleteId(id);
    }
  };

  const handleConfirmDelete = () => {
    if (deleteId && onDelete) {
      // Find the item by ID and pass it to onDelete
      const item = data.find((row) => getRowId(row) === deleteId);
      if (item) {
        onDelete(item);
      }
      setDeleteId(null);
    }
  };

  const handleConfirmBulkDelete = () => {
    if (bulkDeleteIds && bulkDeleteIds.length > 0) {
      if (onBulkDelete) {
        onBulkDelete(bulkDeleteIds);
      } else if (onDelete) {
        // Find items by IDs and pass them to onDelete
        bulkDeleteIds.forEach((id) => {
          const item = data.find((row) => getRowId(row) === id);
          if (item) {
            onDelete(item);
          }
        });
      }
      setBulkDeleteIds(null);
      setSelectedIds([]);
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(data.map((row) => getRowId(row)));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds([...selectedIds, id]);
    } else {
      setSelectedIds(selectedIds.filter((selectedId) => selectedId !== id));
    }
  };

  const handlePageChange = (newPage: number) => {
    if (onPageChange) {
      onPageChange(newPage);
    }
    setSelectedIds([]);
  };

  useEffect(() => {
    if (onSelectionChange && controlledSelectedIds === undefined) {
      onSelectionChange(internalSelectedIds);
    }
  }, [internalSelectedIds, onSelectionChange, controlledSelectedIds]);

  const currentSelections = data.filter((item) => selectedIds.includes(getRowId(item)));
  const allSelected = currentSelections.length === data.length && data.length > 0;
  const isIndeterminate = currentSelections.length > 0 && currentSelections.length < data.length;

  useEffect(() => {
    if (headerCheckboxRef.current) {
      headerCheckboxRef.current.indeterminate = isIndeterminate;
    }
  }, [isIndeterminate]);

  if (data.length === 0) {
    return (
      <div className="bg-white dark:bg-(--card-color) dark:border-(--card-border-color) p-11.25 sm:p-20 text-center rounded-lg">
        <p className="text-gray-400">{isLoading ? "Loading data " : emptyMessage}</p>
      </div>
    );
  }

  const hasDeleteActions = onDelete || onBulkDelete || !!onSelectionChange;

  const showActionsColumn = !!((onDelete && hasPermission(deletePermission)) || (renderActions && (actionPermissions.length === 0 || hasAnyPermission(actionPermissions))));

  return (
    <div className={`bg-white dark:border-(--card-border-color) dark:bg-(--card-color) rounded-lg border border-gray-200 shadow-sm overflow-hidden ${tableClassName}`}>
      {/* Removed internal bulk delete bar - handled by CommonHeader */}

      <div className={`bg-white dark:border-slate-800 dark:bg-(--card-color) rounded-lg border border-gray-200 shadow-sm overflow-hidden transition-all ${tableClassName}`}>
        {/* Table */}
        <div className="overflow-x-auto table-custom-scrollbar">
          <table className="w-full dark:bg-slate-900">
            <thead className="dark:bg-(--card-color) bg-gray-50 border-b border-gray-200 dark:border-(--card-border-color)">
              <tr>
                {hasDeleteActions && (
                  <th className={`w-12 px-6 py-3 ${selectionClassName}`}>
                    <input type="checkbox" className="relative w-4 h-4 rounded appearance-none checked:bg-(--text-green-primary) checked:before:content-['✓'] checked:before:absolute checked:before:-top-1.25 checked:before:text-white checked:before:right-0 border indeterminate:before:content-[''] indeterminate:before:absolute indeterminate:before:top-1/2 indeterminate:before:left-1/2 indeterminate:before:w-2 indeterminate:before:h-0.5 indeterminate:before:-translate-x-1/2 indeterminate:before:-translate-y-1/2 indeterminate:before:bg-white border-gray-300 text-green-500 focus:ring-green-500 dark:border-(--card-border-color) indeterminate:bg-(--text-green-primary)" checked={allSelected} onChange={(e) => handleSelectAll(e.target.checked)} ref={headerCheckboxRef} />
                  </th>
                )}
                {columns.map((column, index) => {
                  const key = column.sortKey || column.header;
                  const isActive = activeSortKey === key;
                  return (
                    <th key={index} className={`px-6 py-3 text-left rtl:text-right text-xs font-semibold text-gray-600 dark:text-gray-400 ${column.className || ""} ${columnClassNames[index] || ""} ${column.sortable ? "cursor-pointer select-none hover:text-gray-900 dark:hover:text-white" : ""}`} onClick={() => column.sortable && handleSort(key)}>
                      <div className="flex items-center gap-1 ">
                        <span className={`${isActive ? "text-primary" : ""}`}>{column.header}</span>
                        {getSortIcon(column)}
                      </div>
                    </th>
                  );
                })}
                {showActionsColumn && <th className={`px-6 py-3 text-left rtl:text-right text-xs font-semibold text-gray-600  dark:text-gray-400 ${actionClassName}`}>ACTIONS</th>}
              </tr>
            </thead>
            <tbody className="dark:bg-(--card-color) bg-white divide-y divide-gray-200">
              {data.map((row, index) => {
                const rowId = getRowId(row);
                return (
                  <tr key={index} className={`hover:bg-gray-50 dark:hover:bg-(--table-hover) dark:bg-(--card-color) transition-colors dark:border-(--card-border-color) ${selectedIds.includes(rowId) ? "bg-(--input-color) dark:bg-(--table-hover)" : ""}`}>
                    {hasDeleteActions && (
                      <td className={`px-6 py-4 ${selectionClassName}`}>
                        <Checkbox checked={selectedIds.includes(rowId)} onCheckedChange={(checked) => handleSelectOne(rowId, checked === true)} />
                      </td>
                    )}
                    {columns.map((column, colIndex) => {
                      const getNestedValue = (obj: T, path: string) => {
                        return path.split(".").reduce((acc, part) => (acc as any)?.[part], obj as any);
                      };

                      const valueToCopy = column.copyField ? String(getNestedValue(row, column.copyField as string) ?? "") : column.accessorKey ? String((row as any)[column.accessorKey] ?? "") : "";

                      return (
                        <td key={colIndex} className={`px-6 py-4 group/row ${column.className || ""} ${columnClassNames[colIndex] || ""}`}>
                          <div className="flex items-center gap-2 max-w-xs sm:max-w-md">
                            <div className="whitespace-normal overflow-hidden break-all">{column.cell ? column.cell(row) : column.accessor ? column.accessor(row) : column.accessorKey ? String((row as any)[column.accessorKey] ?? "") : null}</div>
                            {column.copyable && (
                              <button onClick={(e) => !is_demo_mode && handleCopy(e, valueToCopy)} disabled={is_demo_mode} className={`p-1.5 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-md transition-all text-gray-400 hover:text-primary opacity-0 group-hover/row:opacity-100 shrink-0 ${is_demo_mode ? "cursor-not-allowed" : ""}`} title={is_demo_mode ? "Copying restricted in demo mode" : "Copy to clipboard"}>
                                <Copy size={13} />
                              </button>
                            )}
                          </div>
                        </td>
                      );
                    })}
                    {showActionsColumn && (
                      <td className={`px-6 py-4 ${actionClassName}`}>
                        <div className="flex items-center gap-2">
                          {renderActions && renderActions(row)}
                          {onDelete && (!canDelete || canDelete(row)) && (
                            <Can permission={deletePermission}>
                              <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(rowId)} className="w-10 h-10 text-slate-400 hover:text-red-600 dark:text-red-500 hover:bg-red-50 rounded-lg transition-all dark:hover:bg-red-900/20" disabled={isLoading} title="Delete">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </Can>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination && (
          <div className="bg-white border-t border-gray-200 dark:bg-(--card-color) dark:border-(--card-border-color)">
            <Pagination totalCount={totalCount} page={currentPage} limit={limit || itemsPerPage || 10} onPageChange={handlePageChange} onLimitChange={onLimitChange || (() => {})} isLoading={isLoading} />
          </div>
        )}
      </div>

      {/* Delete Modals */}
      {onDelete && <ConfirmModal isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleConfirmDelete} isLoading={isLoading} title={`Delete ${singularLabel}`} subtitle={`Are you sure you want to delete this ${singularLabel.toLowerCase()}? This action cannot be undone.`} confirmText="Delete" cancelText="Cancel" variant="danger" loadingText="Deleting..." />}

      {hasDeleteActions && <ConfirmModal isOpen={!!bulkDeleteIds} onClose={() => setBulkDeleteIds(null)} onConfirm={handleConfirmBulkDelete} isLoading={isLoading} title={`Delete Selected ${itemLabel}`} subtitle={`Are you sure you want to delete ${bulkDeleteIds?.length || 0} selected ${singularLabel.toLowerCase()}(s)? This action cannot be undone.`} confirmText="Delete" cancelText="Cancel" variant="danger" loadingText="Deleting..." />}
    </div>
  );
};

export default DataTable;
