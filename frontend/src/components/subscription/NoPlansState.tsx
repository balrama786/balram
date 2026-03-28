import { Button } from "@/src/elements/ui/button";
import { PackageSearch } from "lucide-react";
import { useTranslation } from "react-i18next";
import React from "react";

interface NoPlansStateProps {
  mode: "upgrade" | "downgrade" | "none";
  onBack: () => void;
}

const NoPlansState: React.FC<NoPlansStateProps> = ({ mode, onBack }) => {
  const { t } = useTranslation();

  const getMessage = () => {
    if (mode === "upgrade") return t("subscription_page.no_plans_state.upgrade_message");
    if (mode === "downgrade") return t("subscription_page.no_plans_state.downgrade_message");
    return t("subscription_page.no_plans_state.default_message");
  };

  const getTitle = () => {
    if (mode === "upgrade") return t("subscription_page.no_plans_state.upgrade_title");
    if (mode === "downgrade") return t("subscription_page.no_plans_state.downgrade_title");
    return t("subscription_page.no_plans_state.default_title");
  };

  return (
    <div className="flex flex-col items-center justify-center sm:p-12 p-4 text-center border border-slate-100 dark:border-(--card-border-color) bg-white dark:bg-(--page-body-bg) rounded-lg shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="w-16 h-16 bg-slate-50 dark:bg-(--dark-body) rounded-lg flex items-center justify-center mb-6 text-slate-500 dark:text-gray-500 border border-slate-100 dark:border-none">
        <PackageSearch className="h-8 w-8 text-primary" />
      </div>
      <h2 className="sm:text-3xl text-xl font-medium text-slate-900 dark:text-white mb-4 tracking-tighter">{getTitle()}</h2>
      <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-8 text-[15px] font-normal px-6">
        {getMessage()}
      </p>
      <Button 
        size="sm" 
        onClick={onBack} 
        className="px-4.5 py-5 h-12 bg-primary text-white font-black rounded-lg shadow-xl text-[15px] tracking-tight"
      >
        {t("subscription_page.no_plans_state.back_to_sub")}
      </Button>
    </div>
  );
};

export default NoPlansState;
