"use client";

import PageForm from "@/src/components/pages/PageForm";
import { useGetPageByIdQuery, useUpdatePageMutation } from "@/src/redux/api/pageApi";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

const EditPage = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { id } = useParams();
  const { data, isLoading: isFetching } = useGetPageByIdQuery(id as string);
  const [updatePage, { isLoading: isUpdating }] = useUpdatePageMutation();

  const handleSubmit = async (formData: FormData) => {
    try {
      await updatePage({ id: id as string, data: formData }).unwrap();
      toast.success(t("pages.success_updated", "Page updated successfully"));
      router.push("/manage_pages");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error?.data?.message || t("pages.error_update", "Failed to update page"));
    }
  };

  if (isFetching) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <div className="w-10 h-10 border-4 border-(--text-green-primary)/30 border-t-(--text-green-primary) rounded-full animate-spin" />
      </div>
    );
  }

  return <PageForm initialData={data?.data} onSubmit={handleSubmit} isLoading={isUpdating} isEdit />;
};

export default EditPage;
