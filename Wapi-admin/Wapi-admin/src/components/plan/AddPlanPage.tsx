/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/src/elements/ui/button";
import { useCreatePlanMutation, useGetPlanByIdQuery, useUpdatePlanMutation } from "@/src/redux/api/planApi";
import { ArrowLeft, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import PlanBasicInfo from "./PlanBasicInfo";
import PlanFeatures from "./PlanFeatures";
import PlanPricing from "./PlanPricing";
import PlanStatus from "./PlanStatus";

interface AddPlansPageProps {
  id?: string;
}

const AddPlanPageContent = ({ id }: AddPlansPageProps) => {
  const { t } = useTranslation();
  const planId = id;
  const isEditMode = !!planId;

  const router = useRouter();
  const [createPlan, { isLoading: isCreating }] = useCreatePlanMutation();
  const [updatePlan, { isLoading: isUpdating }] = useUpdatePlanMutation();

  const { data: planData, isLoading: isLoadingPlan, error: planError } = useGetPlanByIdQuery(planId || "", { skip: !planId });

  const isLoading = isCreating || isUpdating || isLoadingPlan;
  const initializedRef = useRef(false);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    price: "",
    original_price: "",
    currency: "",
    billing_cycle: "monthly" as "monthly" | "yearly" | "lifetime" | "free Trial",
    trial_days: "0",
    is_featured: false,
    is_active: true,
    sort_order: "0",
    taxes: [] as string[],
    features: {
      contacts: "",
      template_bots: "",
      message_bots: "",
      campaigns: "",
      ai_prompts: "",
      staff: "1",
      conversations: "",
      bot_flow: "",
      rest_api: true,
      whatsapp_webhook: true,
      auto_replies: false,
      analytics: false,
      priority_support: false,
      custom_fields: "",
      tags: "",
      teams: "",
    },
  });

  useEffect(() => {
    if (isEditMode && !isLoadingPlan && planData?.data && !initializedRef.current) {
      const plan = planData.data;
      initializedRef.current = true;

      setTimeout(() => {
        setFormData({
          name: plan.name || "",
          slug: plan.slug || "",
          description: plan.description || "",
          price: plan.price != null ? plan.price.toString() : "",
          original_price: plan.original_price != null ? plan.original_price.toString() : "",
          currency: typeof plan.currency === "string" ? plan.currency : plan.currency?._id || "",
          billing_cycle: (plan.billing_cycle as any) || "monthly",
          trial_days: plan.trial_days != null ? plan.trial_days.toString() : "0",
          is_featured: plan.is_featured ?? false,
          is_active: plan.is_active ?? true,
          sort_order: plan.sort_order != null ? plan.sort_order.toString() : "0",
          features: {
            contacts: plan.features?.contacts != null ? plan.features.contacts.toString() : "",
            template_bots: plan.features?.template_bots != null ? plan.features.template_bots.toString() : "",
            message_bots: plan.features?.message_bots != null ? plan.features.message_bots.toString() : "",
            campaigns: plan.features?.campaigns != null ? plan.features.campaigns.toString() : "",
            ai_prompts: plan.features?.ai_prompts != null ? plan.features.ai_prompts.toString() : "",
            staff: plan.features?.staff != null ? plan.features.staff.toString() : "1",
            conversations: plan.features?.conversations != null ? plan.features.conversations.toString() : "",
            bot_flow: plan.features?.bot_flow != null ? plan.features.bot_flow.toString() : "",
            rest_api: plan.features?.rest_api ?? true,
            whatsapp_webhook: plan.features?.whatsapp_webhook ?? true,
            auto_replies: plan.features?.auto_replies ?? false,
            analytics: plan.features?.analytics ?? false,
            priority_support: plan.features?.priority_support ?? false,
            custom_fields: plan.features?.custom_fields != null ? plan.features.custom_fields.toString() : "",
            tags: plan.features?.tags != null ? plan.features.tags.toString() : "",
            teams: plan.features?.teams != null ? plan.features.teams.toString() : "",
          },
          taxes: plan.taxes ? plan.taxes.map((t: any) => (typeof t === "string" ? t : t._id)) : [],
        });
      }, 0);
    } else if (isEditMode && !isLoadingPlan && planError) {
      console.error("Error loading plan:", planError);
    }
  }, [planData, isEditMode, isLoadingPlan, planError]);

  const handleBasicInfoChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePricingChange = (field: string, value: any) => {
    setFormData((prev) => {
      const newData = { ...prev, [field]: value };

      // If billing cycle is changed to free trial, set price to 0 and clear taxes
      if (field === "billing_cycle" && value === "free Trial") {
        newData.price = "0";
        newData.taxes = [];
      }

      return newData;
    });
  };

  const handleStatusChange = (field: string, value: boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFeatureChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      features: {
        ...prev.features,
        [field]: value,
      },
    }));
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.price || !formData.currency) {
      if (!formData.currency) {
        toast.error(t("plan.error_select_currency") || "Please select a currency");
      }
      return;
    }

    try {
      const submitData = {
        name: formData.name.trim(),
        slug: formData.slug || formData.name.toLowerCase().replace(/\s+/g, "-"),
        description: formData.description || undefined,
        price: parseFloat(formData.price),
        original_price: formData.original_price ? parseFloat(formData.original_price) : undefined,
        currency: formData.currency,
        billing_cycle: formData.billing_cycle,
        trial_days: parseInt(formData.trial_days) || 0,
        is_featured: formData.is_featured,
        is_active: formData.is_active,
        sort_order: parseInt(formData.sort_order) || 0,
        taxes: formData.billing_cycle === "free Trial" ? [] : formData.taxes,
        features: {
          contacts: formData.features.contacts ? parseInt(formData.features.contacts) : undefined,
          template_bots: formData.features.template_bots ? parseInt(formData.features.template_bots) : undefined,
          message_bots: formData.features.message_bots ? parseInt(formData.features.message_bots) : undefined,
          campaigns: formData.features.campaigns ? parseInt(formData.features.campaigns) : undefined,
          ai_prompts: formData.features.ai_prompts ? parseInt(formData.features.ai_prompts) : undefined,
          staff: parseInt(formData.features.staff) || 1,
          conversations: formData.features.conversations ? parseInt(formData.features.conversations) : undefined,
          bot_flow: formData.features.bot_flow ? parseInt(formData.features.bot_flow) : undefined,
          rest_api: formData.features.rest_api,
          whatsapp_webhook: formData.features.whatsapp_webhook,
          auto_replies: formData.features.auto_replies,
          analytics: formData.features.analytics,
          priority_support: formData.features.priority_support,
          custom_fields: formData.features.custom_fields ? parseInt(formData.features.custom_fields) : undefined,
          tags: formData.features.tags ? parseInt(formData.features.tags) : undefined,
          teams: formData.features.teams ? parseInt(formData.features.teams) : undefined,
        },
      };

      if (isEditMode && planId) {
        await updatePlan({ id: planId, data: submitData }).unwrap();
        toast.success(t("plan.success_updated"));
        setTimeout(() => {
          router.push("/manage_plans");
        }, 1000);
      } else {
        await createPlan(submitData).unwrap();
        toast.success(t("plan.success_created"));
        setTimeout(() => {
          router.push("/manage_plans");
        }, 1000);
      }
    } catch (error: any) {
      console.error(`Failed to ${isEditMode ? "update" : "create"} plan:`, error);

      let errorMessage = t(isEditMode ? "plan.error_update" : "plan.error_create");

      if (error?.data?.message) {
        errorMessage = error.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      } else if (typeof error === "string") {
        errorMessage = error;
      }
      toast.error(errorMessage);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="min-h-screen ">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-lg bg-white dark:bg-(--card-color) shadow-sm border border-slate-200 dark:border-(--card-border-color) hover:bg-slate-50 dark:hover:bg-(--dark-sidebar) transition-all">
            <ArrowLeft size={20} />
          </Button>
          <div>
            <h1 className="text-2xl font-extrabold text-primary tracking-tight">{isEditMode ? t("plan.edit_title") : t("plan.add_title")}</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">{isEditMode ? t("plan.edit_subtitle") : t("plan.add_subtitle")}</p>
          </div>
        </div>

        {/* Form Content */}
        <div className="space-y-6">
          <PlanBasicInfo
            formData={{
              name: formData.name,
              slug: formData.slug,
              description: formData.description,
            }}
            onFieldChange={handleBasicInfoChange}
          />

          <PlanPricing
            formData={{
              price: formData.price,
              original_price: formData.original_price,
              currency: formData.currency,
              billing_cycle: formData.billing_cycle,
              trial_days: formData.trial_days,
              sort_order: formData.sort_order,
              taxes: formData.taxes,
            }}
            onFieldChange={handlePricingChange}
          />

          <PlanStatus
            formData={{
              is_featured: formData.is_featured,
              is_active: formData.is_active,
            }}
            onFieldChange={handleStatusChange}
          />

          <PlanFeatures features={formData.features} onFeatureChange={handleFeatureChange} />

          {/* Bottom Action Footer (Sticky-ish for mobile) */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-100 dark:border-(--card-border-color) mt-4">
            <Button variant="outline" onClick={handleCancel} className="px-6 py-2.5 border-gray-300 dark:border-none text-gray-700 dark:text-gray-300 dark:bg-page-body dark:hover:bg-(--dark-sidebar) font-medium" disabled={isLoading}>
              {t("common.cancel")}
            </Button>
            <Button onClick={handleSubmit} className="px-8 py-2.5 bg-(--text-green-primary) hover:bg-(--text-green-primary)/90 text-white font-semibold shadow-md transition-all active:scale-95 disabled:opacity-50" disabled={isLoading || !formData.name || !formData.price || isLoadingPlan}>
              <Check className="w-4 h-4 mr-2" />
              {isLoading ? (isEditMode ? t("plan.updating") : t("plan.creating")) : isEditMode ? t("plan.update_button") : t("plan.save_button")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddPlanPageContent;
