"use client";

import { FaqHeaderProps } from "@/src/types/components";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import CommonHeader from "../../shared/CommonHeader";

const FaqHeader = ({ onSearch, searchTerm, onFilter, isLoading, selectedCount, onBulkDelete }: FaqHeaderProps) => {
  const router = useRouter();
  const { t } = useTranslation();

  const handleAddClick = () => {
    router.push("/manage_faqs/add");
  };

  return <CommonHeader title={t("faq.management_title")} description={t("faq.management_description")} onSearch={onSearch} searchTerm={searchTerm} searchPlaceholder={t("faq.search_placeholder")} onFilter={onFilter} onAddClick={handleAddClick} addLabel={t("faq.add_title")} addPermission="create.faqs" bulkDeletePermission="delete.faqs" isLoading={isLoading} selectedCount={selectedCount} onBulkDelete={onBulkDelete} />;
};

export default FaqHeader;
