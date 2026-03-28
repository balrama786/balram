"use client";

import { useDeletePlanMutation, useGetAllPlansQuery } from "@/src/redux/api/planApi";
import PlanList from "./PlanList";
import PlanHeader from "./PlanHeader";

const PlanContainer = () => {
  const { data, isLoading, refetch, isFetching } = useGetAllPlansQuery({
    limit: 100,
  });

  const [deletePlan, { isLoading: isDeleting }] = useDeletePlanMutation();

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
      <PlanHeader isLoading={isFetching} />

      <PlanList plans={data?.data.plans || []} onDelete={handleDeletePlan} isLoading={isLoading || isDeleting || isFetching} />
    </div>
  );
};

export default PlanContainer;
