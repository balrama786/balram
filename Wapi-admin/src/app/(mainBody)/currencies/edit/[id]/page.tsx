"use client";
import CurrencyForm from "@/src/components/currencies/CurrencyForm";
import { use } from "react";

const EditCurrencyPage = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = use(params);
  return <CurrencyForm id={id} />;
};

export default EditCurrencyPage;
