/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useGetRoleByIdQuery, useUpdateRoleMutation } from "@/src/redux/api/roleApi";
import RoleForm from "@/src/components/roles/RoleForm";
import { Loader2 } from "lucide-react";

interface EditRolePageProps {
  params: Promise<{ id: string }>;
}

const EditRolePage = ({ params }: EditRolePageProps) => {
  const { id } = use(params);
  const router = useRouter();
  const { data, isLoading: isFetching } = useGetRoleByIdQuery(id);
  const [updateRole, { isLoading }] = useUpdateRoleMutation();

  const handleSubmit = async (values: any) => {
    try {
      const res = await updateRole({ id, data: values }).unwrap();
      toast.success(res.message || "Role updated successfully");
      router.push("/roles");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update role");
    }
  };

  if (isFetching) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <RoleForm mode="edit" initialValues={data?.data} onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  );
};

export default EditRolePage;
