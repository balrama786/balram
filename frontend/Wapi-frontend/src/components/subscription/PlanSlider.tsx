"use client";

import { Badge } from "@/src/elements/ui/badge";
import { Button } from "@/src/elements/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/elements/ui/card";
import { cn } from "@/src/lib/utils";
import { PlanSliderProps } from "@/src/types/subscription";
import { ArrowLeft, CheckCircle2, Crown, Rocket, ShieldCheck, Target, Zap } from "lucide-react";
import React from "react";
import { useTranslation } from "react-i18next";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

const getPlanTheme = (planName: string) => {
  const name = planName.toLowerCase();

  // Enterprise / Custom - Amber/Gold
  if (name.includes("enterprise") || name.includes("custom") || name.includes("ultimate") || name.includes("unlimited")) {
    return {
      color: "amber",
      border: "border-amber-100 ring-amber-500/20",
      bg: "bg-amber-50/40",
      badge: "bg-amber-500",
      button: "bg-amber-600 hover:bg-amber-700 shadow-amber-500/20",
      text: "text-amber-600",
      icon: <Rocket className="h-5 w-5" />,
    };
  }

  // Premium / Business / Gold - Violet
  if (name.includes("premium") || name.includes("business") || name.includes("gold") || name.includes("diamond")) {
    return {
      color: "violet",
      border: "border-violet-100 ring-violet-500/20",
      bg: "bg-violet-50/40",
      badge: "bg-violet-500",
      button: "bg-violet-600 hover:bg-violet-700 shadow-violet-500/20",
      text: "text-violet-600",
      icon: <Crown className="h-5 w-5" />,
    };
  }

  // Pro / Plus / Silver - Indigo
  if (name.includes("pro") || name.includes("plus") || name.includes("silver") || name.includes("standard")) {
    return {
      color: "indigo",
      border: "border-indigo-100 ring-indigo-500/20",
      bg: "bg-indigo-50/40",
      badge: "bg-indigo-500",
      button: "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/20",
      text: "text-indigo-600",
      icon: <Zap className="h-5 w-5" />,
    };
  }

  // Default / Starter / Basic / Trial - Emerald
  return {
    color: "emerald",
    border: "border-emerald-200 ring-emerald-500/20",
    bg: "bg-emerald-50/40",
    badge: "bg-emerald-500/20",
    button: "bg-primary shadow-emerald-500/20",
    text: "text-primary",
    icon: <Target className="h-5 w-5" />,
  };
};

const PlanSlider: React.FC<PlanSliderProps> = ({ plans, activePlanId, mode = "none", onSubscribe, onBack }) => {
  const { t } = useTranslation();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const swiperRef = React.useRef<any>(null);

  const getButtonText = (isCurrent: boolean) => {
    if (isCurrent) return t("subscription.current_plan_badge") || "Subscripted Plan";
    if (mode === "upgrade") return t("subscription_page.upgrade_plan");
    if (mode === "downgrade") return t("subscription_page.downgrade_plan");
    return t("subscription.select")?.replace(" →", "") || "Select Plan";
  };

  return (
    <div className="w-full min-h-[600px] select-none overflow-visible flex justify-center items-center pt-[50px] relative">
      <Button variant="outline" onClick={onBack} className="absolute right-4 top-0 rounded-lg bg-white dark:bg-(--card-color) shadow-sm border border-slate-200 dark:border-(--card-border-color) hover:bg-slate-50 dark:hover:bg-(--table-hover) transition-all z-50">
        <ShieldCheck className="h-4 w-4" />
        {t("subscription_page.my_subscription")}
      </Button>
      <div className="relative w-full max-w-6xl px-0 md:px-4 ">
        {/* Navigation Buttons - Hidden on very small screens, positioned better on others */}
        <div className="hidden sm:block">
          <button onClick={() => swiperRef.current?.slidePrev()} className="absolute top-1/2 -translate-y-1/2 -left-4 xl:-left-12 z-30 [@media(max-width:1575px)]:-left-6.25 [@media(max-width:768px)]:hidden flex items-center justify-center h-10 w-10 rounded-full border bg-white dark:bg-(--page-body-bg) dark:hover:bg-(--table-hover) shadow-lg hover:bg-slate-100 transition active:scale-95 disabled:opacity-50" aria-label="Previous slide">
            <ArrowLeft size={18} />
            {" "}
          </button>

          <button onClick={() => swiperRef.current?.slideNext()} className="absolute top-1/2 -translate-y-1/2 -right-4 xl:-right-12 [@media(max-width:1575px)]:-right-6.25 [@media(max-width:768px)]:hidden z-30 flex items-center justify-center h-10 w-10 rounded-full border bg-white dark:bg-(--page-body-bg) dark:hover:bg-(--table-hover) shadow-lg hover:bg-slate-100 transition active:scale-95 disabled:opacity-50" aria-label="Next slide">
            <ArrowLeft size={18} className="rotate-180" />
          </button>
        </div>

        <Swiper
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          modules={[Navigation, Pagination]}
          centeredSlides={true}
          grabCursor={true}
          loop={plans.length > 3}
          slideToClickedSlide={true}
          pagination={{ clickable: true, dynamicBullets: true }}
          className="pb-12!"
          observer={true}
          observeParents={true}
          breakpoints={{
            320: { slidesPerView: 1.2, spaceBetween: 15, centeredSlides: true },
            640: { slidesPerView: 2, spaceBetween: 20, centeredSlides: false },
            1024: { slidesPerView: 3, spaceBetween: 30, centeredSlides: true },
          }}
        >
          {plans.map((plan) => (
            <SwiperSlide key={plan._id} className="h-auto! mt-5">
              {({ isActive }) => {
                const theme = getPlanTheme(plan.name);

                const isCurrentPlan = activePlanId === plan._id;

                return (
                  <Card className={cn("relative flex flex-col h-full transition-all duration-500 overflow-hidden rounded-lg border dark:border-(--card-border-color) bg-white dark:bg-(--card-color) shadow-sm cursor-pointer", isActive ? cn("shadow-xl scale-105 z-20", theme.border) : "scale-95 opacity-60")}>
                    {plan.is_featured && (
                      <div className="absolute top-0 right-0 z-10">
                        <Badge className={cn("border border-primary/80 font-bold text-[10px] px-3 py-1 rounded-full text-primary", theme.badge)}>{t("plan.most_popular")}</Badge>
                      </div>
                    )}

                    <CardHeader className="pb-0 pt-5 px-4 flex flex-row items-center gap-4">
                      <div className={cn("w-[45px] h-12 rounded-lg flex items-center justify-center transition-all duration-500", isActive ? cn("bg-white dark:bg-(--dark-body) shadow-lg", theme.text) : "bg-slate-50 dark:bg-(--dark-body) dark:text-primary text-slate-300")}>{theme.icon}</div>
                      <div>
                        <CardTitle className={cn("text-xl font-medium capitalize tracking-tight", isActive ? "text-slate-900 dark:text-white" : "text-slate-400")}>{plan.name}</CardTitle>
                        <CardDescription className="text-xs font-medium text-left text-slate-400 mt-1 line-clamp-1 opacity-80">{plan.description}</CardDescription>
                      </div>
                    </CardHeader>

                    <CardContent className="flex-1 flex flex-col px-4 pb-8">
                      {/* Price Section */}
                      <div className={cn("my-6 py-6 px-4 rounded-lg flex flex-col items-center justify-center text-center transition-colors shadow-xs border dark:bg-(--page-body-bg) dark:border-none", isActive ? cn(theme.bg, theme.border) : "bg-slate-50 dark:bg-(--page-body-bg) border-slate-100")}>
                        <div className="flex items-baseline gap-1 flex-wrap">
                          <span className={cn("text-3xl font-bold tracking-tighter", isActive ? "text-slate-900 dark:text-white" : "text-slate-300")}>
                            {plan.currency} {plan.price}
                          </span>
                          <span className="text-slate-400 text-xs font-semibold italic ml-auto">/{plan.billing_cycle === 'monthly' ? t('subscription.per_month').replace('/', '') : plan.billing_cycle === 'yearly' ? t('subscription.per_year').replace('/', '') : plan.billing_cycle}</span>
                        </div>
                        {plan.trial_days > 0 && <p className={cn("mt-2 text-[12px] font-bold", theme.text)}>{t("plan.free_trial", { days: plan.trial_days })}</p>}
                      </div>

                      {/* Features List */}
                      <div className="space-y-3 mb-8 flex-1">
                        <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-gray-400 ml-2">{t("plan.plan_features")}</p>
                        <ul className="space-y-2.5">
                          {Object.entries(plan.features || {}).map(([key, value]) => {
                            if (["_id", "__v", "id", "whatsapp_webhook", "rest_api", "custom_fields"].includes(key)) return null;

                            return (
                              <li key={key} className="flex items-center text-[11px]">
                                <CheckCircle2 className={cn("mr-2.5 h-3.5 w-3.5 shrink-0 transition-colors", isActive ? theme.text : "text-slate-200")} />
                                <div className="flex flex-1 justify-between gap-3 items-center">
                                  <span className={cn("font-medium capitalize truncate", isActive ? "text-slate-600 dark:text-slate-300" : "text-slate-300")}>{t(`plan.features.${key}`) || key.replace(/_/g, " ")}</span>
                                  <span className={cn("font-bold shrink-0", isActive ? "text-slate-900 dark:text-white" : "text-slate-300")}>{typeof value === "boolean" ? (value ? t("common.yes") || "Yes" : t("common.no") || "No") : value === null ? "—" : value}</span>
                                </div>
                              </li>
                            );
                          })}
                        </ul>
                      </div>

                      <Button disabled={!isActive || isCurrentPlan} className={cn("w-full h-11 rounded-lg font-bold text-[15px] transition-all duration-300", isActive ? (isCurrentPlan ? "bg-slate-100 text-slate-400 shadow-none border border-slate-200 cursor-not-allowed" : cn("text-white", theme.button)) : "bg-slate-100 dark:bg-primary text-slate-300 shadow-none")} onClick={() => onSubscribe(plan)}>
                        {getButtonText(isCurrentPlan)}
                      </Button>
                    </CardContent>
                  </Card>
                );
              }}
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default PlanSlider;
