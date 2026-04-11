"use client";
import AddLanguagePage from "@/src/components/languages/AddLanguagePage";
import { useParams } from "next/navigation";

const EditLanguage = () => {
  const params = useParams();
  const id = params?.id as string;

  return <AddLanguagePage id={id} />;
};

export default EditLanguage;
