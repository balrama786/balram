/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/src/elements/ui/button";
import { Card, CardContent } from "@/src/elements/ui/card";
import { cn } from "@/src/lib/utils";
import { useGetAllPlansQuery } from "@/src/redux/api/planApi";
import { useCancelSubscriptionMutation, useGetUserSubscriptionQuery } from "@/src/redux/api/subscriptionApi";
import CommonHeader from "@/src/shared/CommonHeader";
import ConfirmModal from "@/src/shared/ConfirmModal";
import { Plan } from "@/src/types/subscription";
import { LayoutGrid, Loader2, Settings2, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import ActivePlanCard from "./ActivePlanCard";
import BillingInfo from "./BillingInfo";
import EmptyState from "./EmptyState";
import ManagePlanModal from "./ManagePlanModal";
import NoPlansState from "./NoPlansState";
import PlanSlider from "./PlanSlider";
import SubscriptionModal from "./SubscriptionModal";
import UsageStatsGrid from "./UsageStatsGrid";

const Subscription = () => {
  const { t } = useTranslation();
  const { data: subscriptionResponse, isLoading: isSubLoading } = useGetUserSubscriptionQuery();
  const { data: plansResponse, isLoading: isPlansLoading } = useGetAllPlansQuery({});
  const [cancelSubscription, { isLoading: isCancelling }] = useCancelSubscriptionMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [showAllPlans, setShowAllPlans] = useState(false);
  const [filterMode, setFilterMode] = useState<"upgrade" | "downgrade" | "none">("none");
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);

  const currentSubscription = subscriptionResponse?.data && (!Array.isArray(subscriptionResponse?.data) || subscriptionResponse?.data.length > 0) ? subscriptionResponse.data : null;
  const plans = plansResponse?.data?.plans || [];

  const handleSubscribe = (plan: Plan) => {
    setSelectedPlan(plan);
    setIsModalOpen(true);
  };

  const handleShowUpgrade = () => {
    setFilterMode("upgrade");
    setShowAllPlans(true);
  };

  const handleShowDowngrade = () => {
    setFilterMode("downgrade");
    setShowAllPlans(true);
  };

  const currentPlanPrice = (currentSubscription?.plan_id as any)?.price || 0;

  const filteredPlans = showAllPlans ? (filterMode === "upgrade" ? plans.filter((p: Plan) => p.price > currentPlanPrice) : filterMode === "downgrade" ? plans.filter((p: Plan) => p.price < currentPlanPrice) : plans) : [];

  const handleCancelSubscription = async () => {
    try {
      const res = await cancelSubscription({
        id: currentSubscription?._id,
        cancel_at_period_end: true,
      }).unwrap();
      toast.success(res?.message || t("subscription_page.cancel_success"));
      setIsConfirmOpen(false);
    } catch (error: any) {
      toast.error(error?.data?.message || t("subscription_page.cancel_error"));
    }
  };

  if (isSubLoading || isPlansLoading) {
    return (
      <div className="flex h-100 w-full items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-emerald-500" />
          <p className="text-slate-500 font-medium animate-pulse">{t("subscription_page.loading")}</p>
        </div>
      </div>
    );
  }

  const activePlanFeatures = (currentSubscription?.plan_id as any)?.features || {};
  const currentUsage = currentSubscription?.usage || {};

  const isCancelled = currentSubscription?.cancelled_at && !currentSubscription?.auto_renew;

  return (
    <div className="min-h-full sm:p-8 p-5 bg-(--light-background) dark:bg-(--dark-body) overflow-x-hidden">
      {!showAllPlans && (
        <CommonHeader
          title={t("subscription_page.title")}
          description={t("subscription_page.description")}
          isLoading={isSubLoading}
          rightContent={
            currentSubscription ? (
              <div className="flex items-center gap-4 flex-wrap">
                {!isCancelled && (
                  <Button onClick={() => setIsManageModalOpen(true)} className="px-6 py-5 h-12 rounded-lg font-bold bg-primary text-white shadow-lg shadow-primary/20 transition-all active:scale-95 flex items-center gap-2">
                    <Settings2 className="h-4 w-4" />
                    {t("subscription_page.manage_plan")}
                  </Button>
                )}
              </div>
            ) : (
              <Button variant="outline" onClick={() => setShowAllPlans(!showAllPlans)} className={cn("flex items-center gap-2.5 px-6! py-5 h-12 rounded-lg font-bold transition-all active:scale-95 group ml-auto sm:ml-0 shadow-sm", showAllPlans ? "bg-white dark:bg-(--card-color) border-slate-200 dark:border-(--card-border-color) text-slate-700 dark:text-slate-200 hover:bg-slate-50" : "bg-primary border-none text-white")}>
                {showAllPlans ? (
                  <>
                    <ShieldCheck className="h-4 w-4" />
                    <span>{t("subscription_page.my_subscription")}</span>
                  </>
                ) : (
                  <>
                    <LayoutGrid className="h-4 w-4" />
                    <span>{t("subscription_page.compare_plans")}</span>
                  </>
                )}
              </Button>
            )
          }
        />
      )}

      <div className="mx-auto">
        {showAllPlans ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">{filteredPlans.length > 0 ? <PlanSlider plans={filteredPlans} activePlanId={(currentSubscription?.plan_id as any)?._id} mode={filterMode} onSubscribe={handleSubscribe} onBack={() => setShowAllPlans(!showAllPlans)} /> : <NoPlansState mode={filterMode} onBack={() => setShowAllPlans(false)} />}</div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {currentSubscription ? (
              <div className="space-y-6 mx-auto">
                <Card className="border border-slate-100 dark:border-(--card-border-color) shadow-sm dark:shadow-none bg-white dark:bg-(--page-body-bg) rounded-lg overflow-hidden">
                  <ActivePlanCard currentSubscription={currentSubscription} />

                  <CardContent className="sm:p-6 p-4">
                    <div className="space-y-12">
                      <div>
                        <div className="flex items-center gap-3 mb-4">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{t("subscription_page.usage_analytics")}</p>
                        </div>
                        <UsageStatsGrid currentUsage={currentUsage} activePlanFeatures={activePlanFeatures} />
                      </div>

                      <BillingInfo currentSubscription={currentSubscription} />
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <EmptyState onShowPlans={() => setShowAllPlans(true)} />
            )}
          </div>
        )}
      </div>

      <SubscriptionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} selectedPlan={selectedPlan} mode={filterMode} currentSubscriptionId={currentSubscription?._id} currentPaymentGateway={currentSubscription?.payment_gateway} />

      <ManagePlanModal isOpen={isManageModalOpen} onOpenChange={setIsManageModalOpen} onUpgrade={handleShowUpgrade} onDowngrade={handleShowDowngrade} onCancel={() => setIsConfirmOpen(true)} />

      <ConfirmModal isOpen={isConfirmOpen} onClose={() => setIsConfirmOpen(false)} onConfirm={handleCancelSubscription} isLoading={isCancelling} title={t("subscription_page.cancel_confirm_title")} subtitle={t("subscription_page.cancel_confirm_subtitle")} confirmText={t("subscription_page.cancel_confirm_btn")} cancelText={t("subscription_page.keep_plan_btn")} variant="danger" />
    </div>
  );
};

export default Subscription;
