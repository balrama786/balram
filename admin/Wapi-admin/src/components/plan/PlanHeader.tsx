"use client";

import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { PlanHeaderProps } from "@/src/types/components";
import CommonHeader from "../../shared/CommonHeader";

const PlanHeader = ({ isLoading }: PlanHeaderProps) => {
  const router = useRouter();
  const { t } = useTranslation();

  const handleAddClick = () => {
    router.push("/manage_plans/add");
  };

  return (
    <CommonHeader
      title={t("plan.title")}
      description={t("plan.description")}
      onAddClick={handleAddClick}
      addLabel={t("common.add_new")}
      isLoading={isLoading || false}
    />
  );
};

export default PlanHeader;
