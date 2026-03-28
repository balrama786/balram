"use client";

import { useGetUserSubscriptionQuery } from "@/src/redux/api/subscriptionApi";
import { useGetUserSettingsQuery } from "@/src/redux/api/settingsApi";
import { ArrowRight, Crown, Sparkles, Timer } from "lucide-react";
import { useRouter } from "next/navigation";
import { format, differenceInDays } from "date-fns";
import { Button } from "@/src/elements/ui/button";
import { cn } from "@/src/lib/utils";
import { useAppSelector } from "@/src/redux/hooks";

const SubscriptionCard = () => {
  const router = useRouter();
  const { user } = useAppSelector((state) => state.auth);

  const { data: subData, isLoading: isSubLoading } = useGetUserSubscriptionQuery();
  const { data: userData, isLoading: isUserLoading } = useGetUserSettingsQuery();

  const subscription = subData?.data;
  const userSettings = userData?.data;

  const isActive = subscription && ["active", "trial"].includes(subscription.status);
  const isFreeTrial = userSettings?.is_free_trial;
  const trialDaysRemaining = userSettings?.free_trial_days_remaining || 0;

  const planName = typeof subscription?.plan_id === "object" ? subscription.plan_id.name : "Professional Plan";

  if (isSubLoading || isUserLoading) {
    return <div className="h-full bg-white dark:bg-(--card-color) rounded-2xl p-7 border border-slate-100 dark:border-(--card-border-color) animate-pulse shadow-sm" />;
  }

  // Helper to format renewal info
  const getRenewalInfo = () => {
    if (!subscription?.current_period_end) return null;
    const endDate = new Date(subscription.current_period_end);
    const daysLeft = differenceInDays(endDate, new Date());
    const formattedDate = format(endDate, "yyyy-MM-dd");

    let color = "text-slate-500 dark:text-slate-400";
    if (daysLeft <= 10) {
      color = "text-red-500 font-bold";
    } else if (daysLeft <= 30) {
      color = "text-amber-500 font-bold";
    }

    return {
      text: `Next Renewal: ${formattedDate} (${Math.max(0, daysLeft)} Days)`,
      color,
    };
  };

  const renewalInfo = getRenewalInfo();

  if (isActive) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const plan = typeof subscription?.plan_id === "object" ? (subscription.plan_id as any) : null;

    return (
      <div className="h-full flex flex-col bg-white dark:bg-(--card-color) rounded-lg sm:p-6 p-4 border border-slate-100 dark:border-(--card-border-color) shadow-sm relative overflow-hidden group transition-all duration-500 hover:shadow-xl">
        <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-amber-400/5 to-transparent rounded-full -mr-16 -mt-16 blur-3xl opacity-30" />

        <div className="relative z-10 flex flex-col h-full">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 min-w-14 rounded-lg bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center border border-amber-100 dark:border-amber-500/20">
              <Crown className="h-7 w-7 text-amber-500" />
            </div>
            <div className="space-y-0.5">
              <h4 className="text-xl font-bold text-slate-800 dark:text-white tracking-tight mb-2 leading-none">{planName}</h4>
              {renewalInfo && (
                <p className="text-sm font-medium">
                  Next Renewal: {format(new Date(subscription.current_period_end), "yyyy-MM-dd")} ({Math.max(0, differenceInDays(new Date(subscription.current_period_end), new Date()))} Days)
                </p>
              )}
            </div>
          </div>

          <div className="mt-8 mb-6">
            <div className="flex items-baseline gap-1">
              <span className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">
                {plan?.currency === "INR" ? "₹" : plan?.currency} {plan?.price || "0"}
              </span>
              <span className="text-sm font-bold text-slate-400">/{plan?.billing_cycle || "month"}</span>
            </div>
            <p className="text-[13px] font-semibold text-slate-400 mt-2 tracking-wide">
              Billed {plan?.billing_cycle === "year" ? "Annually" : "Monthly"} • {user?.email || "Account Owner"}
            </p>
          </div>

          <div className="mt-auto border-t border-slate-50 dark:border-slate-800/50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Renewal in</span>
              {renewalInfo && <span className={cn("text-sm font-semibold", renewalInfo.color.includes("red") ? "text-red-500" : "text-primary")}>{Math.max(0, differenceInDays(new Date(subscription.current_period_end), new Date()))} days</span>}
            </div>

            <div className="w-full h-1.5 bg-slate-100 dark:bg-(--table-hover) rounded-full overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-full transition-all duration-500",
                  (() => {
                    const daysLeft = differenceInDays(new Date(subscription.current_period_end), new Date());
                    if (daysLeft <= 10) return "bg-red-400";
                    if (daysLeft <= 30) return "bg-amber-500";
                    return "bg-emerald-500";
                  })()
                )}
                style={{
                  width: `${(() => {
                    if (!subscription?.current_period_start || !subscription?.current_period_end) return 10;
                    const start = new Date(subscription.current_period_start);
                    const end = new Date(subscription.current_period_end);
                    const total = differenceInDays(end, start);
                    const remaining = differenceInDays(end, new Date());
                    const elapsed = Math.max(0, total - remaining);
                    return Math.min(100, Math.max(10, (elapsed / (total || 1)) * 100));
                  })()}%`,
                }}
              />
            </div>

            <Button onClick={() => router.push("/subscriptions")} className="w-full mt-5 h-11 bg-primary  text-white  rounded-lg font-medium text-[12px] transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-black/5">
              Manage Subscription Plan
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (isFreeTrial) {
    return (
      <div className="h-full flex flex-col bg-linear-to-br from-primary/5 to-emerald-500/5 dark:from-primary/10 dark:to-emerald-500/10 rounded-lg sm:p-6 p-4 border border-primary/20 dark:border-primary/20 shadow-sm relative overflow-hidden group transition-all duration-300 min-h-full">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-all duration-700" />

        <div className="relative z-10 flex flex-col h-full">
          <div className="flex items-center gap-4">
            <div className="sm:p-3.5 p-2 bg-white dark:bg-white/5 rounded-2xl shadow-sm border border-primary/20 group-hover:scale-110 transition-transform">
              <Timer size={28} className="text-primary" />
            </div>
            <div className="space-y-1">
              <h4 className="text-xl font-bold text-slate-800 dark:text-white uppercase tracking-tight">{trialDaysRemaining} Days Trial</h4>
              <p className="text-[10px] font-bold text-primary uppercase tracking-widest">Premium Activation Pending</p>
            </div>
          </div>

          <div className="my-4 p-4 bg-white/50 dark:bg-black/20 rounded-lg border border-primary/10  flex-1 h-full">
            <ul className="space-y-2">
              {["Unlimited Contacts", "Priority Support", "AI Automation"].map((feat, i) => (
                <li key={i} className="flex items-center gap-2 text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wide">
                  <div className="h-1 w-1 rounded-full bg-primary" />
                  {feat}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-auto">
            <button onClick={() => router.push("/subscriptions")} className="w-full flex items-center justify-center gap-3 px-6 py-3.5 bg-primary text-white rounded-lg text-sm font-bold  transition-all shadow-xl shadow-primary/20 active:scale-95 hover:-translate-y-0.5">
              <Sparkles size={16} />
              Upgrade to Premium
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white dark:bg-(--card-color) rounded-2xl p-6 dark:border-white/5 shadow-sm relative overflow-hidden group transition-all duration-300 min-h-full hover:shadow-xl">
      <div className="relative z-10 flex flex-col h-full">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-slate-50 dark:bg-white/5 rounded-2xl transition-colors">
            <Crown size={28} className="text-slate-300 dark:text-slate-700 transition-colors" />
          </div>
          <div className="space-y-1">
            <h4 className="text-xl font-bold text-slate-400 dark:text-slate-600 uppercase tracking-tight">No Active Plan</h4>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-500 italic">Limited functionality enabled</p>
          </div>
        </div>

        <div className="my-4 flex-1 flex flex-col justify-center">
          <p className="text-center text-[13px] font-medium text-slate-400 dark:text-slate-500 px-4">Unlock the full potential of your workspace with our premium plans.</p>
        </div>

        <div className="">
          <button onClick={() => router.push("/subscriptions")} className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 rounded-xl text-[12px] font-medium tracking-widest group-hover:bg-primary group-hover:text-white dark:hover:bg-primary dark:hover:text-white active:scale-95 transition-all duration-500 hover:shadow-xl">
            <Sparkles size={16} />
            View Subscription Plans
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionCard;
