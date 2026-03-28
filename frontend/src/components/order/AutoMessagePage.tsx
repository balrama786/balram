"use client";

import CommonHeader from "@/src/shared/CommonHeader";
import { useGetStatusTemplatesQuery, StatusTemplate } from "@/src/redux/api/orderTemplateApi";
import StatusTemplateCard from "./StatusTemplateCard";
import {
  MessageCircle,
  Clock,
  CheckCircle2,
  Package,
  Truck,
  PackageCheck,
} from "lucide-react";

// All 6 order statuses the user specified
const STATUS_CONFIG = [
  {
    key: "first_message",
    label: "First Message",
    description: "Sent when a customer places their first WhatsApp order",
    icon: <MessageCircle size={18} className="text-primary" />,
    color: "bg-primary/10",
  },
  {
    key: "pending",
    label: "Pending",
    description: "Order is received and awaiting confirmation",
    icon: <Clock size={18} className="text-amber-500" />,
    color: "bg-amber-500/10",
  },
  {
    key: "confirmed",
    label: "Confirmed",
    description: "Order has been confirmed and is being processed",
    icon: <CheckCircle2 size={18} className="text-emerald-500" />,
    color: "bg-emerald-500/10",
  },
  {
    key: "ready_to_ship",
    label: "Ready to Ship",
    description: "Order is packed and ready for pickup/handover",
    icon: <Package size={18} className="text-violet-500" />,
    color: "bg-violet-500/10",
  },
  {
    key: "on_the_way",
    label: "On the Way",
    description: "Parcel has been picked up and is in transit",
    icon: <Truck size={18} className="text-orange-500" />,
    color: "bg-orange-500/10",
  },
  {
    key: "shipped",
    label: "Shipped & Delivered",
    description: "Order successfully delivered to the customer",
    icon: <PackageCheck size={18} className="text-primary" />,
    color: "bg-primary/10",
  },
];

const AutoMessagePage = () => {
  const { data, isLoading } = useGetStatusTemplatesQuery();

  const getTemplateForStatus = (statusKey: string): StatusTemplate | undefined =>
    data?.data?.find((t) => t.status === statusKey);

  return (
    <div className="p-4 sm:p-8">
      <CommonHeader
        backBtn={true}
        title="Auto Message Templates"
        description="Configure automated WhatsApp messages triggered on each order status change"
        isLoading={isLoading}
      />

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-20 rounded-lg bg-slate-100 dark:bg-(--card-color) animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {STATUS_CONFIG.map((config,index) => (
            <StatusTemplateCard
              key={config.key}
              index={index}
              statusKey={config.key}
              label={config.label}
              description={config.description}
              icon={config.icon}
              color={config.color}
              existing={getTemplateForStatus(config.key)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AutoMessagePage;
