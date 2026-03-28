"use client";

import { Card, CardContent } from "@/src/elements/ui/card";
import { SubscriptionPlansSummaryProps } from "@/src/types/components";
import { ArrowDown, Users, CreditCard } from "lucide-react";
import { useTranslation } from "react-i18next";
import CountUp from "react-countup";

const SubscriptionPlansSummary = ({
  totalSubscriptions,
  activeSubscriptions,
  monthlyRevenue,
  isLoading,
}: SubscriptionPlansSummaryProps) => {
  const { t } = useTranslation();
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="border border-gray-200 shadow-sm">
            <CardContent className="p-6">
              <div className="h-20 bg-gray-100 dark:bg-(--card-color) animate-pulse rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* Total Subscriptions Card */}
      <Card className="border border-gray-200 dark:bg-(--card-color) dark:border-(--card-border-color) shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="">
              <p className="text-sm font-bold text-gray-600 mb-1 flex items-center gap-2 dark:text-gray-300">
                <ArrowDown className="w-4 h-4 text-blue-500" />
                {t("subscription.total")}
              </p>
              <p className="text-4xl font-bold text-gray-900 dark:text-amber-50 mt-5">
                <CountUp end={totalSubscriptions} />
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active Subscriptions Card */}
      <Card className="border border-gray-200 shadow-sm dark:bg-(--card-color) dark:border-(--card-border-color)">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-gray-600 mb-1 flex items-center gap-2 dark:text-gray-300 truncate">
                <Users className="w-4 h-4 text-(--text-green-primary)" />
                {t("subscription.active")}
              </p>
              <p className="text-4xl font-bold text-gray-900 dark:text-amber-50 mt-5">
                <CountUp end={activeSubscriptions} />
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Total Revenue Card */}
      <Card className="border border-gray-200 shadow-sm dark:bg-(--card-color) dark:border-(--card-border-color)">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-gray-600 mb-1 flex items-center gap-2 dark:text-gray-300">
                <CreditCard className="w-4 h-4 text-purple-500" />
                {t("subscription.total_revenue")}
              </p>
              <p className="text-4xl font-bold text-gray-900 dark:text-amber-50 mt-5">
                <CountUp end={monthlyRevenue} />
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubscriptionPlansSummary;
