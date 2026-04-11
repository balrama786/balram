import AddPlanPageContent from "@/src/components/plan/AddPlanPage";

const EditPlan = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  return <AddPlanPageContent id={id} />;
};

export default EditPlan;