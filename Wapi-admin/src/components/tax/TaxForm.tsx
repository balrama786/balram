"use client";

import { ArrowLeft, Loader2, Save } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { Button } from "@/src/elements/ui/button";
import { Switch } from "@/src/elements/ui/switch";
import { useCreateTaxMutation, useGetTaxByIdQuery, useUpdateTaxMutation } from "@/src/redux/api/taxApi";

interface TaxFormProps {
  id?: string;
}

interface TaxFormData {
  name: string;
  type: "percentage" | "fixed";
  rate: string;
  description: string;
  is_active: boolean;
}

const TaxForm = ({ id }: TaxFormProps) => {
  const { t } = useTranslation();
  const router = useRouter();
  const isEdit = !!id;
  const initializedRef = useRef(false);

  const { data: taxData, isLoading: isFetching } = useGetTaxByIdQuery(id!, { skip: !id });
  const [createTax, { isLoading: isCreating }] = useCreateTaxMutation();
  const [updateTax, { isLoading: isUpdating }] = useUpdateTaxMutation();

  const [formData, setFormData] = useState<TaxFormData>({
    name: "",
    type: "percentage",
    rate: "",
    description: "",
    is_active: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (taxData?.success && taxData.data && !initializedRef.current) {
      initializedRef.current = true;
      const tax = taxData.data;
      setTimeout(() => {
        setFormData({
          name: tax.name || "",
          type: tax.type || "percentage",
          rate: tax.rate?.toString() || "",
          description: tax.description || "",
          is_active: tax.is_active ?? true,
        });
      }, 0);
    }
  }, [taxData]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name?.trim()) newErrors.name = t("common.required_field") || "Name is required";

    if (formData.rate === "" || formData.rate === undefined || formData.rate === null) {
      newErrors.rate = t("common.required_field") || "Rate is required";
    } else {
      const rateNum = parseFloat(formData.rate);
      if (isNaN(rateNum)) {
        newErrors.rate = "Invalid rate";
      } else if (rateNum < 0) {
        newErrors.rate = "Rate must be non-negative";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => {
        const newErrs = { ...prev };
        delete newErrs[name];
        return newErrs;
      });
    }
  };

  const handleStatusChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, is_active: checked }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const submitData = {
        ...formData,
        rate: parseFloat(formData.rate),
      };

      if (isEdit) {
        await updateTax({ id: id as string, body: submitData }).unwrap();
        toast.success(t("tax.update_success") || "Tax updated successfully");
      } else {
        await createTax(submitData).unwrap();
        toast.success(t("tax.create_success") || "Tax created successfully");
      }
      router.push("/taxes");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.data?.message || (isEdit ? t("tax.update_error") : t("tax.create_error")) || "Operation failed");
    }
  };

  if (isFetching) {
    return (
      <div className="h-100 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-(--text-green-primary)" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="mb-8 flex  items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-lg bg-white dark:bg-(--card-color) shadow-sm border border-slate-200 dark:border-(--card-border-color) hover:bg-slate-50 dark:hover:bg-(--dark-sidebar) transition-all">
          <ArrowLeft size={20} />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-(--text-green-primary) tracking-tight">{isEdit ? t("tax.edit_title") || "Edit Tax" : t("tax.create_title") || "Create New Tax"}</h1>
          <p className="text-sm text-gray-400 mt-0.5">{isEdit ? t("tax.edit_subtitle") || "Update tax details and configuration." : t("tax.create_subtitle") || "Define a new tax rate and type."}</p>
        </div>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        <div className="bg-white dark:bg-(--card-color) rounded-lg border border-[#f1f5f9] dark:border-(--card-border-color) shadow-sm p-4 sm:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            {/* Name */}
            <div className="space-y-2 md:col-span-2 flex flex-col">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {t("tax.name_label") || "Tax Name"} <span className="text-red-500">*</span>
              </label>
              <input name="name" value={formData.name || ""} onChange={handleInputChange} placeholder="e.g. VAT, GST" className={`w-full px-4 h-12 bg-(--input-color) dark:bg-page-body border rounded-lg text-sm text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-(--text-green-primary)/20 transition-all outline-none ${errors.name ? "border-red-500" : "border-(--input-border-color) dark:border-(--card-border-color) focus:border-(--text-green-primary)"}`} />
              {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
            </div>

            {/* Type */}
            <div className="space-y-2 flex flex-col">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {t("tax.type_label") || "Tax Type"} <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select name="type" value={formData.type || "percentage"} onChange={handleInputChange} className="w-full px-4 h-12 bg-(--input-color) dark:bg-page-body border border-(--input-border-color) dark:border-(--card-border-color) rounded-lg text-sm text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-(--text-green-primary)/20 transition-all outline-none appearance-none">
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed Amount</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                  <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Rate */}
            <div className="space-y-2 flex flex-col">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {formData.type === "percentage" ? t("tax.rate_percentage_label") || "Tax Percentage" : t("tax.rate_fixed_label") || "Tax Amount"} <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input name="rate" type="text" value={formData.rate ?? ""} onChange={handleInputChange} placeholder="0" className={`w-full px-4 h-12 bg-(--input-color) dark:bg-page-body border rounded-lg text-sm text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-(--text-green-primary)/20 transition-all outline-none ${errors.rate ? "border-red-500" : "border-(--input-border-color) dark:border-(--card-border-color) focus:border-(--text-green-primary)"}`} />
                {formData.type === "percentage" && <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">%</span>}
              </div>
              {errors.rate && <p className="text-xs text-red-500">{errors.rate}</p>}
            </div>

            {/* Description */}
            <div className="space-y-2 md:col-span-2 flex flex-col">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t("tax.description_label") || "Description"}</label>
              <textarea name="description" value={formData.description || ""} onChange={handleInputChange} rows={4} className="w-full px-4 py-3 bg-(--input-color) dark:bg-page-body border border-(--input-border-color) dark:border-(--card-border-color) rounded-lg text-sm text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-(--text-green-primary)/20 transition-all outline-none resize-none" placeholder={t("tax.description_placeholder") || "A brief description of this tax..."} />
            </div>

            {/* Status Switch */}
            <div className="md:col-span-2 flex items-center justify-between p-4 bg-gray-50/30 dark:bg-page-body dark:border-none rounded-lg border border-dashed border-gray-200 dark:border-(--card-border-color)">
              <div className="space-y-0.5">
                <p className="text-sm font-bold text-gray-900 dark:text-gray-100">{t("tax.status_label") || "Active Status"}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500">{t("tax.status_description") || "Enable or disable this tax across the platform."}</p>
              </div>
              <Switch checked={!!formData.is_active} onCheckedChange={handleStatusChange} className="data-[state=checked]:bg-(--text-green-primary)" />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-6 border-t border-gray-100 dark:border-(--card-border-color) mt-4">
          <Link href="/taxes" className="w-full sm:w-auto">
            <Button variant="outline" type="button" className="w-full h-11 px-4.5 py-5 rounded-lg border-gray-300 dark:border-none text-gray-700 dark:text-gray-300 dark:bg-page-body dark:hover:bg-(--dark-sidebar) font-medium">
              {t("common.cancel")}
            </Button>
          </Link>
          <Button disabled={isCreating || isUpdating} className="w-full sm:w-auto h-11 px-4.5 py-5 rounded-lg bg-(--text-green-primary) hover:bg-(--text-green-primary)/90 text-white font-semibold shadow-md transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2">
            {isCreating || isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {isEdit ? (isUpdating ? t("common.updating") : t("tax.update_button") || "Update Tax") : isCreating ? t("common.creating") : t("tax.save_button") || "Create Tax"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default TaxForm;
