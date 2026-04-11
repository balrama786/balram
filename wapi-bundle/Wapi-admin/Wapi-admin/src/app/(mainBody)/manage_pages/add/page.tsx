"use client";

import PageForm from "@/src/components/pages/PageForm";
import { useCreatePageMutation } from "@/src/redux/api/pageApi";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

const AddPage = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [createPage, { isLoading }] = useCreatePageMutation();

  const handleSubmit = async (formData: FormData) => {
    try {
      await createPage(formData).unwrap();
      toast.success(t("pages.success_created", "Page created successfully"));
      router.push("/manage_pages");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error?.data?.message || t("pages.error_create", "Failed to create page"));
    }
  };

  return <PageForm onSubmit={handleSubmit} isLoading={isLoading} />;
};

export default AddPage;
