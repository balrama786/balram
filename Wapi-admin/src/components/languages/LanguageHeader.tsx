"use client";

import { LanguageHeaderProps } from "@/src/types/components";
import CommonHeader from "@/src/shared/CommonHeader";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";

const LanguageHeader = ({ onSearch, searchTerm, isLoading, columns, onColumnToggle, selectedCount, onBulkDelete }: LanguageHeaderProps) => {
  const { t } = useTranslation();
  const router = useRouter();

  return <CommonHeader title={t("nav.language")} description="Manage system languages, translations, and localization settings." onSearch={onSearch} searchTerm={searchTerm} searchPlaceholder={t("common.search") + "..."} onAddClick={() => router.push("/languages/add")} addLabel={t("common.add_new") || "Add New"} addPermission="create.languages" bulkDeletePermission="delete.languages" isLoading={isLoading} columns={columns} onColumnToggle={onColumnToggle} selectedCount={selectedCount} onBulkDelete={onBulkDelete} />;
};

export default LanguageHeader;
