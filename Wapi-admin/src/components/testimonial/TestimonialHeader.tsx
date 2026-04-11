"use client";

import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import CommonHeader from "../../shared/CommonHeader";

interface TestimonialHeaderProps {
  onRefresh: () => void;
  onFilter?: () => void;
  onExport?: () => void;
  onSearch?: (value: string) => void;
  searchTerm?: string;
  isLoading: boolean;
  selectedCount?: number;
  onBulkDelete?: () => void | Promise<void>;
}

const TestimonialHeader = ({
  onFilter,
  onExport,
  onSearch,
  searchTerm = "",
  isLoading,
  selectedCount,
  onBulkDelete,
}: TestimonialHeaderProps) => {
  const router = useRouter();
  const { t } = useTranslation();

  const handleAddClick = () => {
    router.push("/manage_testimonials/add");
  };

  return (
    <CommonHeader
      title={t("testimonial.title")}
      description={t("testimonial.description")}
      onSearch={onSearch}
      searchTerm={searchTerm}
      searchPlaceholder={t("common.search_placeholder")}
      onFilter={onFilter}
      onExport={onExport}
      onAddClick={handleAddClick}
      addLabel={t("common.add_new")}
      addPermission="create.testimonials"
      bulkDeletePermission="delete.testimonials"
      isLoading={isLoading}
      selectedCount={selectedCount}
      onBulkDelete={onBulkDelete}
    />
  );
};

export default TestimonialHeader;
