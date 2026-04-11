"use client";

import CommonHeader from "@/src/shared/CommonHeader";

interface RoleHeaderProps {
  searchTerm: string;
  onSearch: (q: string) => void;
  onAddClick: () => void;
  isLoading: boolean;
  selectedCount: number;
  onBulkDelete: () => void;
  columns: { id: string; label: string; isVisible: boolean }[];
  onColumnToggle: (id: string) => void;
}

const RoleHeader = ({ searchTerm, onSearch, onAddClick, isLoading, selectedCount, onBulkDelete, columns, onColumnToggle }: RoleHeaderProps) => {
  return <CommonHeader title="Roles & Permissions" description="Manage roles and define their access permissions." onSearch={onSearch} searchTerm={searchTerm} searchPlaceholder="Search roles..." onAddClick={onAddClick} addLabel="Add Role" addPermission="create.roles" isLoading={isLoading} selectedCount={selectedCount} onBulkDelete={onBulkDelete} bulkDeletePermission="delete.roles" columns={columns} onColumnToggle={onColumnToggle} />;
};

export default RoleHeader;
