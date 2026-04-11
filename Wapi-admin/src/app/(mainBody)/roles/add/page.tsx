/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useCreateRoleMutation } from "@/src/redux/api/roleApi";
import RoleForm from "@/src/components/roles/RoleForm";

const AddRolePage = () => {
  const router = useRouter();
  const [createRole, { isLoading }] = useCreateRoleMutation();

  const handleSubmit = async (values: any) => {
    try {
      const res = await createRole(values).unwrap();
      toast.success(res.message || "Role created successfully");
      router.push("/roles");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to create role");
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <RoleForm mode="create" onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  );
};

export default AddRolePage;
