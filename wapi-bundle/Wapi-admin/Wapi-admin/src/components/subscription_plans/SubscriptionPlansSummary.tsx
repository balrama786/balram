"use client";

import { Card, CardContent } from "@/src/elements/ui/card";
import { SubscriptionPlansSummaryProps } from "@/src/types/components";
import { CheckCircle, Clock, CreditCard, LayoutGrid, XCircle } from "lucide-react";
import CountUp from "react-countup";
import { useTranslation } from "react-i18next";

const SubscriptionPlansSummary = ({ totalSubscriptions, activeSubscriptions, expiredSubscriptions, expiringSoonSubscriptions, monthlyRevenue, isLoading, onCardClick, activeFilter }: SubscriptionPlansSummaryProps) => {
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {[1, 2, 3, 4, 5].map((i) => (
          <Card key={i} className="border border-gray-200 shadow-sm">
            <CardContent className="p-4">
              <div className="h-20 bg-gray-100 dark:bg-(--card-color) animate-pulse rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const cards = [
    {
      id: "total",
      label: t("subscription.total"),
      value: totalSubscriptions,
      icon: <LayoutGrid className="w-5 h-5 text-blue-500" />,
      color: "blue",
    },
    {
      id: "monthly_revenue",
      label: t("subscription.total_revenue"),
      value: monthlyRevenue,
      icon: <CreditCard className="w-5 h-5 text-purple-500" />,
      color: "purple",
      isCurrency: true,
    },
    {
      id: "active",
      label: t("subscription.active"),
      value: activeSubscriptions,
      icon: <CheckCircle className="w-5 h-5 text-emerald-500" />,
      color: "emerald",
    },
    {
      id: "expired",
      label: t("subscription.expired"),
      value: expiredSubscriptions,
      icon: <XCircle className="w-5 h-5 text-rose-500" />,
      color: "rose",
    },
    {
      id: "expiring_soon",
      label: t("subscription.expiring_soon"),
      value: expiringSoonSubscriptions,
      icon: <Clock className="w-5 h-5 text-amber-500" />,
      color: "amber",
    },
  ];

  const colorMap: Record<string, string> = {
    blue: "bg-blue-100/50 dark:bg-blue-900/20",
    purple: "bg-purple-100/50 dark:bg-purple-900/20",
    emerald: "bg-emerald-100/50 dark:bg-emerald-900/20",
    rose: "bg-rose-100/50 dark:bg-rose-900/20",
    amber: "bg-amber-100/50 dark:bg-amber-900/20",
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
      {cards.map((card) => (
        <Card key={card.id} onClick={() => onCardClick?.(card.id)} className={`relative overflow-hidden cursor-pointer transition-all border shadow-sm dark:bg-(--card-color) group hover:shadow-md ${activeFilter === card.id ? "border-(--text-green-primary) ring-1 ring-(--text-green-primary)/2" : "border-gray-200 dark:border-(--card-border-color) hover:border-(--text-green-primary)/50"}`}>
          <CardContent className="p-4 py-5">
            <div className={`absolute -top-6 -right-6 w-24 h-24 rounded-full blur-2xl opacity-10 transition-all duration-500 ${colorMap[card.color] || ""}`} />
            <div className="flex items-center gap-3">
              <div className="">
                <div className={`p-4 rounded-lg ${colorMap[card.color] || ""}`}>{card.icon}</div>
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-3xl font-bold text-gray-900 dark:text-amber-50 leading-none">
                  <CountUp end={card.value} />
                </p>
                <p className="text-[13px] font-bold text-gray-500 dark:text-gray-400 line-clamp-1">{card.label}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default SubscriptionPlansSummary;
