"use client";

import { AdminTemplateForm } from "@/src/components/templates/AdminTemplateForm";
import { use } from "react";

interface EditTemplatePageProps {
  params: Promise<{ id: string }>;
}

const EditTemplatePage = ({ params }: EditTemplatePageProps) => {
  const { id } = use(params);
  return <AdminTemplateForm templateId={id} />;
};

export default EditTemplatePage;
