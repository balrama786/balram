"use client";

import { InquiryHeaderProps } from "@/src/types/components";
import { useTranslation } from "react-i18next";
import CommonHeader from "../../shared/CommonHeader";

const InquiryHeader = ({ onRefresh, onSearch, searchTerm, isLoading, selectedCount, onBulkDelete }: InquiryHeaderProps) => {
  const { t } = useTranslation();

  return <CommonHeader title={t("inquiry.title")} description={t("inquiry.description")} onRefresh={onRefresh} onSearch={onSearch} searchTerm={searchTerm} searchPlaceholder={t("common.search_placeholder")} isLoading={isLoading} selectedCount={selectedCount} onBulkDelete={onBulkDelete} bulkDeletePermission="delete.contact_inquiries" />;
};

export default InquiryHeader;
