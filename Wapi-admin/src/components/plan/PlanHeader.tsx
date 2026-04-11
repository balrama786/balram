"use client";

import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { PlanHeaderProps } from "@/src/types/components";
import { Gift } from "lucide-react";
import { Button } from "@/src/elements/ui/button";
import CommonHeader from "../../shared/CommonHeader";
import Can from "../shared/Can";

const PlanHeader = ({ isLoading, onFreeTrialClick }: PlanHeaderProps) => {
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
      addPermission="create.plans"
      isLoading={isLoading || false}
      extraActions={
        <Can permission="update.plans">
          <Button variant="outline" onClick={onFreeTrialClick} className="flex items-center gap-2 px-6 py-5 rounded-lg border-[#e2e8f0] text-[#475569] hover:bg-[#f8fafc] font-medium transition-all dark:bg-page-body dark:border-none dark:text-amber-50 dark:hover:bg-(--dark-sidebar)" disabled={isLoading}>
            <Gift className="w-5 h-5" />
            Free Trial
          </Button>
        </Can>
      }
    />
  );
};

export default PlanHeader;
