"use client";

import { Input } from "@/src/elements/ui/input";
import { Label } from "@/src/elements/ui/label";
import { PlanPricingProps } from "@/src/types/components";
import { useTranslation } from "react-i18next";

const PlanPricing = ({ formData, onFieldChange }: PlanPricingProps) => {
  const { t } = useTranslation();

  return (
    <div className="dark:bg-(--card-color) dark:border-(--card-border-color) bg-white rounded-xl shadow-sm border border-gray-100 p-6 transition-all hover:shadow-md">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-lg bg-(--text-green-primary)/10 flex items-center justify-center">
          <span className="text-xl font-bold text-(--text-green-primary)">
            $
          </span>
        </div>
        <div>
          <h2 className="text-xl font-medium text-gray-900 dark:text-white leading-none">
            {t("plan.pricing_billing")}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {t("plan.pricing_billing_desc") ||
              "Define the cost and billing structure for this plan"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-2.5 flex flex-col">
          <Label
            htmlFor="price"
            className="text-sm font-semibold text-gray-700 dark:text-gray-300"
          >
            {t("plan.price_label")}{" "}
            <span className="text-red-500 font-bold">*</span>
          </Label>
          <Input
            id="price"
            type="number"
            placeholder="0.00"
            value={formData.price}
            onChange={(e) => onFieldChange("price", e.target.value)}
            className="dark:bg-page-body dark:border-(--card-border-color) h-12 p-3 bg-gray-50/50 border-gray-200 focus:border-(--text-green-primary) focus:ring-1 focus:ring-(--text-green-primary) transition-all rounded-lg"
          />
        </div>

        <div className="space-y-2.5 flex flex-col">
          <Label
            htmlFor="currency"
            className="text-sm font-semibold text-gray-700 dark:text-gray-300"
          >
            {t("plan.currency_label")}
          </Label>
          <select
            id="currency"
            value={formData.currency}
            onChange={(e) => onFieldChange("currency", e.target.value)}
            className="dark:bg-page-body focus-visible:outline-none dark:border-(--card-border-color) h-12 w-full px-3 bg-gray-50/50 border border-gray-200 rounded-lg focus:border-(--text-green-primary) focus:ring-1 focus:ring-(--text-green-primary) transition-all appearance-none cursor-pointer"
          >
            <option value="USD">{t("plan.currency.usd") || "USD - US Dollar"}</option>
            <option value="INR">{t("plan.currency.inr") || "INR - Indian Rupee"}</option>
            <option value="EUR">{t("plan.currency.eur") || "EUR - Euro"}</option>
          </select>
        </div>

        <div className="space-y-2.5 flex flex-col">
          <Label
            htmlFor="billing_cycle"
            className="text-sm font-semibold text-gray-700 dark:text-gray-300"
          >
            {t("plan.billing_cycle_label")}{" "}
            <span className="text-red-500 font-bold">*</span>
          </Label>
          <select
            id="billing_cycle"
            value={formData.billing_cycle}
            onChange={(e) => onFieldChange("billing_cycle", e.target.value)}
            className="dark:bg-page-body focus-visible:outline-none dark:border-(--card-border-color) h-12 w-full px-3 bg-gray-50/50 border border-gray-200 rounded-lg focus:border-(--text-green-primary) focus:ring-1 focus:ring-(--text-green-primary) transition-all appearance-none cursor-pointer"
          >
            <option value="monthly">{t("plan.billing_cycle.monthly") || "Monthly"}</option>
            <option value="yearly">{t("plan.billing_cycle.yearly") || "Yearly"}</option>
            <option value="lifetime">{t("plan.billing_cycle.lifetime") || "Lifetime"}</option>
          </select>
        </div>

        <div className="space-y-2.5 flex flex-col">
          <Label
            htmlFor="sort_order"
            className="text-sm font-semibold text-gray-700 dark:text-gray-300"
          >
            {t("plan.sort_order_label")}
          </Label>
          <Input
            id="sort_order"
            type="number"
            placeholder="0"
            value={formData.sort_order}
            onChange={(e) => onFieldChange("sort_order", e.target.value)}
            className="dark:bg-page-body dark:border-(--card-border-color) p-3 h-12 bg-gray-50/50 border-gray-200 focus:border-(--text-green-primary) focus:ring-1 focus:ring-(--text-green-primary) transition-all rounded-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default PlanPricing;
