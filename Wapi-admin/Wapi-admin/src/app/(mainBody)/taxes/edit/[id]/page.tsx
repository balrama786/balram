import TaxForm from "@/src/components/tax/TaxForm";

interface EditTaxPageProps {
  params: Promise<{
    id: string;
  }>;
}

const EditTaxPage = async ({ params }: EditTaxPageProps) => {
  const { id } = await params;
  return <TaxForm id={id} />;
};

export default EditTaxPage;
