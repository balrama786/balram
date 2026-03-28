"use client";

import { Button } from "@/src/elements/ui/button";
import ConfirmModal from "@/src/shared/ConfirmModal";
import { PlanCardProps } from "@/src/types/components";
import { Check, Pencil, Trash2, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const PlanCard = ({
  plan,
  onDelete,
  isLoading,
  isHighlighted,
}: PlanCardProps) => {
  const router = useRouter();
  const { t } = useTranslation();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleDeleteClick = () => {
    setDeleteId(plan._id);
  };

  const handleEditClick = () => {
    router.push(`/manage_plans/edit/${plan._id}`);
  };

  const handleConfirmDelete = () => {
    if (deleteId) {
      onDelete(deleteId);
      setDeleteId(null);
    }
  };

  const formatPrice = (price: number, currency: string = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getBillingCycleDays = (cycle: string, trialDays: number) => {
    if (trialDays > 0) {
      return t("plan.billing_trial", { days: trialDays });
    }
    switch (cycle) {
      case "monthly":
        return t("plan.billing_per_month");
      case "yearly":
        return t("plan.billing_per_year");
      case "lifetime":
        return t("plan.billing_lifetime");
      default:
        return "";
    }
  };

  const getFeaturesList = () => {
    const features = [];
    if (plan.features.contacts) features.push(t("plan.chat_tags"));
    if (plan.features.bot_flow) features.push(t("plan.auto_chatbot"));
    if (plan.features.rest_api) features.push(t("plan.cloud_api"));
    return features;
  };

  const getQrFeatures = () => {
    const qrFeatures = [];
    if (plan.features.contacts) {
      qrFeatures.push(t("plan.allowed_qr", { count: plan.features.contacts }));
    }
    if (plan.features.rest_api) {
      qrFeatures.push(t("plan.rest_api_qr"));
    }
    if (plan.features.whatsapp_webhook) {
      qrFeatures.push(t("plan.wa_warmer"));
    }
    return qrFeatures;
  };

  const features = getFeaturesList();
  const qrFeatures = getQrFeatures();

  return (
    <>
      <div
        className={`
        relative bg-white dark:bg-(--card-color) rounded-lg border p-6 transition-all duration-500 flex flex-col h-full w-full ring-1 ring-(--text-green-primary)
        ${isHighlighted ? "" : "border-slate-200 dark:border-(--card-border-color)"}
        ${plan.is_featured && !isHighlighted ? "border-(--text-green-primary) shadow-sm" : ""}
      `}
      >
        {plan.is_featured && (
          <div className="absolute -top-3 sm:-top-4 left-1/2 -translate-x-1/2 z-10">
            <span className="flex items-center gap-1 px-3 sm:px-4 py-1 sm:py-1.5 bg-(--text-green-primary) text-white text-xs sm:text-sm font-semibold rounded-full shadow-lg whitespace-nowrap">
              <Zap className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden xs:inline sm:inline">
                {t("plan.most_popular")}
              </span>
              <span className="xs:hidden sm:hidden">{t("plan.popular")}</span>
            </span>
          </div>
        )}

        {/* Plan Header */}
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            {plan.name}
          </h3>
          <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">
            {plan.description || t("plan.perfect_plan")}
          </p>
          <div className="flex items-baseline justify-center gap-1">
            <span className="text-5xl font-bold text-slate-900 dark:text-white">
              {formatPrice(plan.price, plan.currency).replace(/[^0-9.,]/g, "")}
            </span>
            <span className="text-slate-600 dark:text-slate-400">
              {getBillingCycleDays(plan.billing_cycle, plan.trial_days)}
            </span>
          </div>
          {plan.original_price && plan.original_price > plan.price && (
            <p className="text-sm text-slate-400 dark:text-slate-500 mt-1 line-through">
              {formatPrice(plan.original_price, plan.currency)}
            </p>
          )}
        </div>

        {/* What's Included Section */}
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">
            {t("plan.whats_included")}
          </h4>
          <ul className="space-y-3">
            {features.map((feature, index) => (
              <li key={index} className="flex items-start gap-3">
                <div
                  className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center ${plan.is_featured ? "bg-emerald-100 dark:bg-emerald-900/20" : "bg-emerald-100 dark:bg-emerald-900/20"}`}
                >
                  <Check
                    className={`w-3.5 h-3.5 ${plan.is_featured ? "text-(--text-green-primary) dark:text-(--text-green-primary)" : "text-(--text-green-primary) dark:text-(--text-green-primary)"}`}
                  />
                </div>
                <span className="text-sm text-slate-700 dark:text-slate-300">
                  {feature}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* QR Features Section */}
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">
            {t("plan.qr_features")}
          </h4>
          <ul className="space-y-3">
            {qrFeatures.map((feature, index) => (
              <li key={index} className="flex items-start gap-3">
                <div
                  className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center ${plan.is_featured ? "bg-emerald-100 dark:bg-emerald-900/20" : "bg-emerald-100 dark:bg-emerald-900/20"}`}
                >
                  <Check
                    className={`w-3.5 h-3.5 ${plan.is_featured ? "text-(--text-green-primary) dark:text-(--text-green-primary)" : "text-(--text-green-primary) dark:text-(--text-green-primary)"}`}
                  />
                </div>
                <span className="text-sm text-slate-700 dark:text-slate-300">
                  {feature}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-auto flex-wrap">
          <Button
            onClick={handleEditClick}
            disabled={isLoading}
            className={`shadow-none bg-transparent flex-1 px-4.5 py-5 rounded-lg font-semibold transition-all flex items-center justify-center ${plan.is_featured ? "bg-(--text-green-primary) text-white shadow-md hover:shadow-lg" : "bg-primary text-white"}`}
          >
            <Pencil className="w-4 h-4 mr-2" />
            {t("plan.update_button")}
          </Button>
          <Button
            onClick={handleDeleteClick}
            disabled={isLoading}
            className="shadow-none bg-red-100 flex-1 px-4.5 py-5 rounded-lg font-semibold dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-800/30 transition-colors flex items-center justify-center"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            {t("common.delete")}
          </Button>
        </div>
      </div>

      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleConfirmDelete}
        isLoading={isLoading}
        title={t("plan.delete")}
        subtitle={t("common.delete_confirmation", {
          item: t("nav.manage_plan"),
        })}
        confirmText={t("common.delete")}
        cancelText={t("common.cancel")}
        variant="danger"
        loadingText={t("common.deleting")}
      />
    </>
  );
};

export default PlanCard;
