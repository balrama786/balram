import { ReplyMaterial, ReplyMaterialType } from "@/src/types/reply-material";
import ReplyMaterialCard from "./ReplyMaterialCard";
import ReplyMaterialEmptyState from "./ReplyMaterialEmptyState";
import { Pagination } from "@/src/shared/Pagination";

const SkeletonCard = () => (
  <div className="bg-white dark:bg-(--card-color) rounded-2xl border border-slate-100 dark:border-(--card-border-color) overflow-hidden animate-pulse shadow-sm">
    <div className="h-36 bg-slate-100 dark:bg-slate-800/40" />
    <div className="p-3 flex items-center gap-2">
      <div className="h-4 bg-slate-100 dark:bg-slate-800/40 rounded flex-1" />
      <div className="h-6 w-6 bg-slate-100 dark:bg-slate-800/40 rounded" />
      <div className="h-6 w-6 bg-slate-100 dark:bg-slate-800/40 rounded" />
    </div>
  </div>
);

interface ReplyMaterialGridProps {
  items: ReplyMaterial[];
  type: ReplyMaterialType;
  isLoading: boolean;
  page: number;
  totalPages: number;
  totalItems: number;
  limit: number;
  selectedIds: string[];
  onPageChange: (page: number) => void;
  onToggleSelect: (id: string) => void;
  onEdit: (item: ReplyMaterial) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
}

const ReplyMaterialGrid: React.FC<ReplyMaterialGridProps> = ({ items, type, isLoading, page, totalPages, totalItems, limit, selectedIds, onPageChange, onToggleSelect, onEdit, onDelete, onAdd }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {Array.from({ length: 10 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return <ReplyMaterialEmptyState type={type} onAdd={onAdd} />;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {items.map((item) => (
          <ReplyMaterialCard key={item._id} item={item} isSelected={selectedIds.includes(item._id)} onToggleSelect={onToggleSelect} onEdit={onEdit} onDelete={onDelete} />
        ))}
      </div>

      {totalPages > 1 && <Pagination totalCount={totalItems} page={page} limit={limit} onPageChange={onPageChange} onLimitChange={() => {}} isLoading={isLoading} />}
    </div>
  );
};

export default ReplyMaterialGrid;
