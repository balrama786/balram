"use client";

import { useDeletePlanMutation, useGetAllPlansQuery } from "@/src/redux/api/planApi";
import { useState } from "react";
import PlanList from "./PlanList";
import PlanHeader from "./PlanHeader";
import FreeTrialModal from "./FreeTrialModal";

const PlanContainer = () => {
  const { data, isLoading, refetch, isFetching } = useGetAllPlansQuery({
    limit: 100,
  });

  const [deletePlan, { isLoading: isDeleting }] = useDeletePlanMutation();
  const [isFreeTrialModalOpen, setIsFreeTrialModalOpen] = useState(false);

  const handleDeletePlan = async (id: string) => {
    try {
      await deletePlan([id]).unwrap();
      refetch();
    } catch (error) {
      console.error("Failed to delete plan", error);
    }
  };

  return (
    <div>
      <PlanHeader isLoading={isFetching} onFreeTrialClick={() => setIsFreeTrialModalOpen(true)} />

      <PlanList plans={data?.data.plans || []} onDelete={handleDeletePlan} isLoading={isLoading || isDeleting || isFetching} />

      <FreeTrialModal isOpen={isFreeTrialModalOpen} onClose={() => setIsFreeTrialModalOpen(false)} />
    </div>
  );
};

export default PlanContainer;
