"use client";

import { useTranslation } from "react-i18next";
import CommonHeader from "../../shared/CommonHeader";

const SubscriptionPlansHeader = ({ isLoading }: { isLoading: boolean }) => {
  const { t } = useTranslation();
  return <CommonHeader title={t("subscription.title")} description={t("subscription.description")} isLoading={isLoading} />;
};

export default SubscriptionPlansHeader;
