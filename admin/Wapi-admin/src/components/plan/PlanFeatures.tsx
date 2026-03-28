"use client";

import { Check } from "lucide-react";
import { PlanFeaturesProps } from "@/src/types/components";
import FeatureNumericInput from "./FeatureNumericInput";
import FeatureToggle from "./FeatureToggle";
import { booleanFeatures, numericFeatures } from "@/src/data/Plans";
import { useTranslation } from "react-i18next";

const PlanFeatures = ({ features, onFeatureChange }: PlanFeaturesProps) => {
  const { t } = useTranslation();

  return (
    <div className="dark:bg-(--card-color) dark:border-(--card-border-color) bg-white rounded-xl shadow-sm border border-gray-100 p-6 transition-all hover:shadow-md">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-lg bg-(--text-green-primary)/10 flex items-center justify-center">
          <Check className="w-5 h-5 text-(--text-green-primary)" />
        </div>
        <div>
          <h2 className="text-xl font-medium text-gray-900 dark:text-white leading-none">{t("plan.plan_features")}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t("plan.plan_features_desc") || "Configure the limits and capabilities of this plan"}</p>
        </div>
      </div>

      <div className="space-y-10">
        {/* Numeric Features */}
        <div>
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-6">{t("plan.usage_limits") || "Usage Limits"}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
            {numericFeatures.map((feature) => {
              const value = features[feature.id as keyof typeof features] as string;
              return <FeatureNumericInput key={feature.id} id={feature.id} label={t(`plan.features.${feature.id}`) || feature.label} placeholder={t(`plan.features.${feature.id}_placeholder`) || feature.placeholder} value={value || ""} onChange={(value) => onFeatureChange(feature.id, value)} />;
            })}
          </div>
        </div>

        {/* Boolean Features with Toggle Switches */}
        <div className="border-t border-gray-100 pt-10 dark:border-(--card-border-color)">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-6">{t("plan.capabilities") || "Capabilities"}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {booleanFeatures.map((feature) => {
              const checked = features[feature.id as keyof typeof features] as boolean;
              return <FeatureToggle key={feature.id} id={feature.id} label={t(`plan.features.${feature.id}`) || feature.label} description={t(`plan.features.${feature.id}_desc`) || feature.description} icon={feature.icon} checked={checked ?? false} onCheckedChange={(checked) => onFeatureChange(feature.id, checked)} />;
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanFeatures;
