import KeywordActionForm from "@/src/components/keyword-action/KeywordActionForm";

export const metadata = {
  title: "Create Keyword Action | WAPI",
  description: "Create a new keyword-triggered reply action",
};

export default function CreateKeywordActionPage() {
  return <KeywordActionForm />;
}
