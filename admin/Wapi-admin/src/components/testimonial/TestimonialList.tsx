import { stripHtml } from "@/lib/utils";
import { ImageBaseUrl } from "@/src/constants";
import { Button } from "@/src/elements/ui/button";
import { Switch } from "@/src/elements/ui/switch";
import { TestimonialListProps } from "@/src/types/components";
import { ColumnDef } from "@/src/types/shared";
import { Testimonial } from "@/src/types/store";
import { format } from "date-fns";
import { Edit, User } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import DataTable from "../../shared/DataTable";

const TestimonialList = ({
  testimonials,
  onDelete,
  onBulkDelete,
  onUpdateStatus,
  isLoading,
  totalCount = 0,
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  limit,
  onLimitChange,
  onSelectionChange,
  selectedIds,
  onSortChange,
}: TestimonialListProps) => {
  const router = useRouter();

  const handleEditClick = (testimonial: Testimonial) => {
    router.push(`/manage_testimonials/edit/${testimonial._id}`);
  };

  const handleStatusToggle = (testimonial: Testimonial, checked: boolean) => {
    if (onUpdateStatus) {
      onUpdateStatus(testimonial._id, checked);
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-4 h-4 ${star <= rating ? "text-green-500 fill-(--warning-color)" : "text-gray-300 fill-gray-300"}`}
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  const columns: ColumnDef<Testimonial>[] = [
    {
      header: "USER",
      sortable: true,
      sortKey: "user_name",
      accessor: (testimonial) => (
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleEditClick(testimonial)}>
          {testimonial.user_image ? (
            <Image src={ImageBaseUrl + "/uploads/user_profiles/" + testimonial.user_image} alt={testimonial.user_name} className="w-10 h-10 rounded-lg object-cover" width={100} height={100} unoptimized />
          ) : (
            <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-(--dark-body) flex items-center justify-center">
              <User className="w-5 h-5 text-gray-400 dark:text-primary" />
            </div>
          )}
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-amber-50">{testimonial.user_name}</p>
            <p className="text-xs text-gray-500">{testimonial.user_post}</p>
          </div>
        </div>
      ),
    },
    {
      header: "TESTIMONIAL",
      accessor: (testimonial) => <p className="text-sm text-gray-900 break-all dark:text-amber-50 [@media(max-width:1826px)]:line-clamp-2">{stripHtml(testimonial.description)}</p>,
    },
    {
      header: "RATING",
      sortable: true,
      sortKey: "rating",
      accessor: (testimonial) => renderStars(testimonial.rating || 5),
    },
    {
      header: "STATUS",
      sortable: true,
      sortKey: "status",
      accessor: (testimonial) => <Switch checked={testimonial.status} onCheckedChange={(checked) => handleStatusToggle(testimonial, checked)} disabled={isLoading} className="data-[state=checked]:bg-green-500" />,
    },
    {
      header: "CREATED AT",
      className: "[@media(max-width:1478px)]:min-w-[165px]",
      sortable: true,
      sortKey: "created_at",
      accessor: (testimonial) => <span className="text-gray-500 dark:text-gray-400 text-sm">{testimonial.created_at ? format(new Date(testimonial.created_at), "MMM d, yyyy") : "N/A"}</span>,
    },
  ];

  const handleDelete = (testimonial: Testimonial) => {
    onDelete(testimonial._id);
  };

  const handleBulkDelete = (ids: string[]) => {
    if (onBulkDelete) {
      onBulkDelete(ids);
    }
  };

  return (
    <DataTable
      data={testimonials}
      columns={columns}
      page={currentPage}
      totalPages={totalPages}
      total={totalCount}
      onPageChange={onPageChange}
      onLimitChange={onLimitChange}
      limit={limit}
      onDelete={handleDelete}
      onBulkDelete={handleBulkDelete}
      isLoading={isLoading}
      onSelectionChange={onSelectionChange}
      selectedIds={selectedIds}
      emptyMessage="No testimonials found."
      itemLabel="testimonials"
      itemLabelSingular="Testimonial"
      columnClassNames={[
        "[@media(max-width:1478px)]:min-w-[250px] font-semibold", // Column index 0
        "max-w-xs", // Column index 1
        " text-blue-500", // Column index 2
        "hidden md:table-cell", // Column index 3
      ]}
      renderActions={(testimonial) => (
        <>
          <Button variant="ghost" size="icon" onClick={() => handleEditClick(testimonial)} className="w-10 h-10 text-slate-400 hover:text-(--text-green-primary) hover:bg-emerald-50 rounded-lg dark:hover:bg-primary/20 transition-all" disabled={isLoading} title="Edit">
            <Edit className="w-4 h-4" />
          </Button>
        </>
      )}
      onSortChange={onSortChange}
    />
  );
};

export default TestimonialList;
