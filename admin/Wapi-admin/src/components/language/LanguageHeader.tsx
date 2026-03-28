"use client";

import CommonHeader from "@/src/shared/CommonHeader";
import { LanguageHeaderProps } from "@/src/types/components";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

const LanguageHeader = ({ onSearch, searchTerm, onFilter, isLoading }: LanguageHeaderProps) => {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <CommonHeader
      title={t("languages.title")}
      description={t("languages.description")}
      onAddClick={() => router.push("/languages/add")}
      addLabel={t("languages.add_language")}
      isLoading={isLoading}
      onSearch={onSearch}
      searchTerm={searchTerm}
      searchPlaceholder={t("languages.search_placeholder")}
      onFilter={onFilter}
    />
  );
};

export default LanguageHeader;
