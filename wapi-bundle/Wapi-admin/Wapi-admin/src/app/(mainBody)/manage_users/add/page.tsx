"use client";
import AddUserPage from "@/src/components/manage_user/AddUserPage";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

const AddUserPageWrapper = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id") ?? undefined;
  return <AddUserPage id={id} />;
};

const AddUserRoute = () => (
  <Suspense>
    <AddUserPageWrapper />
  </Suspense>
);

export default AddUserRoute;
