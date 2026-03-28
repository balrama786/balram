"use client";

import { useState } from "react";
import { useGetAllLanguagesQuery, useDeleteLanguageMutation } from "@/src/redux/api/languageApi";
import LanguageHeader from "./LanguageHeader";
import LanguageList from "./LanguageList";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

const LanguageContainer = () => {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const limit = 10;

  const { data, isLoading } = useGetAllLanguagesQuery({
    page,
    limit,
    search: searchTerm,
  });

  const [deleteLanguage, { isLoading: isDeleting }] = useDeleteLanguageMutation();

  const handleDelete = async (ids: string[]) => {
    try {
      await deleteLanguage(ids).unwrap();
      toast.success(t("languages.delete_success"));
    } catch {
      toast.error(t("languages.delete_error"));
    }
  };

  return (
    <div>
      <LanguageHeader onSearch={setSearchTerm} searchTerm={searchTerm} isLoading={isLoading} />

      <LanguageList languages={data?.data?.languages || []} page={page} totalPages={data?.data?.pagination?.totalPages || 1} total={data?.data?.pagination?.total || 0} onPageChange={setPage} onDelete={handleDelete} isLoading={isLoading || isDeleting} />
    </div>
  );
};

export default LanguageContainer;
