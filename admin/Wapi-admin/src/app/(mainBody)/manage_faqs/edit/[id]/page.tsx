import AddFaqPage from "@/src/components/faq/AddFaqPage";

const EditFaq = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  return <AddFaqPage id={id} />;
};

export default EditFaq;
