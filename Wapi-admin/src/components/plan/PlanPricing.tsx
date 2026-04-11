"use client";

import { Input } from "@/src/elements/ui/input";
import { Label } from "@/src/elements/ui/label";
import { PlanPricingProps } from "@/src/types/components";
import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "@/src/redux/hooks";
import { useGetAllCurrenciesQuery } from "@/src/redux/api/currencyApi";
import { useGetAllTaxesQuery } from "@/src/redux/api/taxApi";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/src/elements/ui/dropdown-menu";
import { Button } from "@/src/elements/ui/button";
import { ChevronDown, Percent } from "lucide-react";
import { Badge } from "@/src/elements/ui/badge";

const PlanPricing = ({ formData, onFieldChange }: PlanPricingProps) => {
  const { t } = useTranslation();
  const settings = useAppSelector((state) => state.settings.data);
  const defaultSymbol = settings?.default_currency?.symbol || "$";

  const { data: currenciesData, isLoading: isLoadingCurrencies } = useGetAllCurrenciesQuery({
    is_active: true,
  });

  const { data: taxesData, isLoading: isLoadingTaxes } = useGetAllTaxesQuery({
    is_active: true,
  });

  const taxes = useMemo(() => taxesData?.data?.taxes || [], [taxesData]);
  const currencies = useMemo(() => currenciesData?.data?.currencies || [], [currenciesData]);

  const isFreeTrial = formData.billing_cycle === "free Trial";

  const handleTaxToggle = (taxId: string) => {
    const currentTaxes = formData.taxes || [];
    const newTaxes = currentTaxes.includes(taxId) ? currentTaxes.filter((id) => id !== taxId) : [...currentTaxes, taxId];
    onFieldChange("taxes", newTaxes);
  };

  const selectedTaxesNames = useMemo(() => {
    return taxes.filter((t) => formData.taxes?.includes(t._id)).map((t) => t.name);
  }, [taxes, formData.taxes]);

  useEffect(() => {
    if (!isLoadingCurrencies && currencies.length > 0 && !formData.currency) {
      onFieldChange("currency", currencies[0]._id);
    }
  }, [isLoadingCurrencies, currencies, formData.currency, onFieldChange]);

  return (
    <div className="dark:bg-(--card-color) dark:border-(--card-border-color) bg-white rounded-xl shadow-sm border border-gray-100 p-6 transition-all hover:shadow-md">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-lg bg-(--text-green-primary)/10 flex items-center justify-center">
          <span className="text-xl font-bold text-(--text-green-primary)">{defaultSymbol}</span>
        </div>
        <div>
          <h2 className="text-xl font-medium text-gray-900 dark:text-white leading-none">{t("plan.pricing_billing")}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t("plan.pricing_billing_desc") || "Define the cost and billing structure for this plan"}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-2.5 flex flex-col">
          <Label htmlFor="price" className={`text-sm font-semibold ${isFreeTrial ? "text-gray-400" : "text-gray-700 dark:text-gray-300"}`}>
            {t("plan.price_label")} <span className="text-red-500 font-bold">*</span>
          </Label>
          <Input id="price" type="number" placeholder="0.00" value={formData.price} onChange={(e) => onFieldChange("price", e.target.value)} disabled={isFreeTrial} className={`dark:bg-page-body dark:border-(--card-border-color) h-12 p-3 bg-gray-50/50 border-gray-200 focus:border-(--text-green-primary) focus:ring-1 focus:ring-(--text-green-primary) transition-all rounded-lg ${isFreeTrial ? "opacity-50 cursor-not-allowed" : ""}`} />
        </div>

        <div className="space-y-2.5 flex flex-col">
          <Label htmlFor="currency" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            {t("plan.currency_label")}
          </Label>
          <select id="currency" value={formData.currency} onChange={(e) => onFieldChange("currency", e.target.value)} className="dark:bg-page-body focus-visible:outline-none dark:border-(--card-border-color) h-12 w-full px-3 bg-gray-50/50 border border-gray-200 rounded-lg focus:border-(--text-green-primary) focus:ring-1 focus:ring-(--text-green-primary) transition-all appearance-none cursor-pointer" disabled={isLoadingCurrencies}>
            {isLoadingCurrencies ? (
              <option value="">{t("common.loading")}</option>
            ) : (
              <>
                <option value="" disabled>
                  {t("plan.select_currency") || "Select Currency"}
                </option>
                {currencies.map((currency) => (
                  <option key={currency._id} value={currency._id}>
                    {currency.name} ({currency.code})
                  </option>
                ))}
              </>
            )}
          </select>
        </div>

        <div className="space-y-2.5 flex flex-col">
          <Label htmlFor="billing_cycle" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            {t("plan.billing_cycle_label")} <span className="text-red-500 font-bold">*</span>
          </Label>
          <select id="billing_cycle" value={formData.billing_cycle} onChange={(e) => onFieldChange("billing_cycle", e.target.value)} className="dark:bg-page-body focus-visible:outline-none dark:border-(--card-border-color) h-12 w-full px-3 bg-gray-50/50 border border-gray-200 rounded-lg focus:border-(--text-green-primary) focus:ring-1 focus:ring-(--text-green-primary) transition-all appearance-none cursor-pointer">
            <option value="monthly">{t("plan.billing_cycle.monthly") || "Monthly"}</option>
            <option value="yearly">{t("plan.billing_cycle.yearly") || "Yearly"}</option>
            <option value="lifetime">{t("plan.billing_cycle.lifetime") || "Lifetime"}</option>
            <option value="free Trial">{t("plan.billing_cycle.trial") || "Free Plan"}</option>
          </select>
        </div>

        <div className="space-y-2.5 flex flex-col">
          <Label htmlFor="taxes" className={`text-sm font-semibold ${isFreeTrial ? "text-gray-400" : "text-gray-700 dark:text-gray-300"}`}>
            {t("plan.taxes_label")}
          </Label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild disabled={isFreeTrial || isLoadingTaxes}>
              <Button variant="outline" className={`flex justify-between items-center dark:bg-page-body dark:border-(--card-border-color) h-12 p-3 bg-gray-50/50 border-gray-200 focus:border-(--text-green-primary) focus:ring-1 focus:ring-(--text-green-primary) transition-all rounded-lg w-full font-normal ${isFreeTrial ? "opacity-50 cursor-not-allowed" : ""}`}>
                <div className="flex items-center gap-2 overflow-hidden mr-2">
                  <Percent className="w-4 h-4 text-gray-400" />
                  {selectedTaxesNames.length > 0 ? (
                    <div className="flex gap-1 overflow-hidden">
                      {selectedTaxesNames.map((name, index) => (
                        <Badge key={index} variant="secondary" className="whitespace-nowrap bg-(--text-green-primary)/10 text-(--text-green-primary) border-none">
                          {name}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <span className="text-gray-500">{t("plan.select_taxes")}</span>
                  )}
                </div>
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-(--radix-dropdown-menu-trigger-width) dark:bg-(--card-color) dark:border-(--card-border-color)">
              {taxes.length > 0 ? (
                taxes.map((tax) => (
                  <DropdownMenuCheckboxItem key={tax._id} checked={formData.taxes?.includes(tax._id)} onCheckedChange={() => handleTaxToggle(tax._id)} className="cursor-pointer">
                    <div className="flex flex-col">
                      <span>{tax.name}</span>
                      <span className="text-xs text-gray-500">
                        {tax.rate}
                        {tax.type === "percentage" ? "%" : ""}
                      </span>
                    </div>
                  </DropdownMenuCheckboxItem>
                ))
              ) : (
                <div className="p-2 text-sm text-gray-500">{t("plan.no_taxes_available")}</div>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default PlanPricing;
