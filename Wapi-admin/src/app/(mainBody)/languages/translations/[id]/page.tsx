import TranslationManagement from "@/src/components/languages/TranslationManagement";

const LanguagesTranslationsPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  return <TranslationManagement id={id} />;
};

export default LanguagesTranslationsPage;
