"use client";

import { DashboardCounts } from "@/src/redux/api/dashboardApi";
import { useGetUserSubscriptionQuery } from "@/src/redux/api/subscriptionApi";
import { LayoutTemplate, Megaphone, MessageSquare, MessageSquareMore, Send, Users, Webhook, Workflow } from "lucide-react";
import UsageStatCard from "./UsageStatCard";

interface StatCardsProps {
  counts: DashboardCounts & { totalOrders?: number; totalWebhooks?: number };
  isLoading: boolean;
  section: "metrics" | "usage";
}

const StatCards = ({ counts, isLoading, section }: StatCardsProps) => {
  const { data: subData } = useGetUserSubscriptionQuery();
  const subscription = subData?.data;
  const isActive = subscription && ["active", "trial"].includes(subscription.status);

  const getStatData = (featureKey: string, usageKey: string, dashboardCount: number) => {
    let limit;
    let current = dashboardCount;

    if (isActive && typeof subscription?.plan_id === "object") {
      limit = subscription.plan_id.features?.[featureKey];
      current = subscription.usage?.[usageKey] ?? dashboardCount;
    }

    return { current, limit };
  };

  const allStats = [
    {
      label: "Sent",
      ...getStatData("totalMessagesSent", "messages_sent", counts?.totalMessagesSent || 0),
      icon: <Send size={18} />,
      color: "text-amber-500",
      trend: "12%",
      path: "/chat",
      section: "metrics",
    },
    {
      label: "Received",
      ...getStatData("totalMessagesReceived", "messages_received", counts?.totalMessagesReceived || 0),
      icon: <MessageSquareMore size={18} />,
      color: "text-blue-500",
      trend: "8%",
      path: "/chat",
      section: "metrics",
    },
    {
      label: "Contacts",
      ...getStatData("contacts", "contacts_used", counts?.totalContacts || 0),
      icon: <Users size={18} />,
      color: "text-emerald-500",
      trend: "5",
      path: "/contacts",
      section: "metrics",
    },
    {
      label: "Chats",
      ...getStatData("conversations_used", "totalConversations", counts?.totalConversations || 0),
      icon: <MessageSquare size={18} />,
      color: "text-indigo-500",
      trend: "2",
      path: "/chat",
      section: "metrics",
    },
    {
      label: "Tags",
      ...getStatData("tags", "tags_used", counts?.totalTags || 0),
      icon: <Users size={18} />,
      color: "text-orange-500",
      trend: "5",
      path: "/tags",
      section: "metrics",
    },
    {
      label: "Flows",
      ...getStatData("bot_flow", "flows_used", counts?.totalAutomationFlows || 0),
      icon: <Workflow size={18} />,
      color: "text-violet-500",
      trend: "0",
      path: "/automation_flows",
      section: "usage",
    },
    {
      label: "Templates",
      ...getStatData("template_bots", "templates_used", counts?.totalTemplates || 0),
      icon: <LayoutTemplate size={18} />,
      color: "text-orange-500",
      trend: "3",
      path: "/templates",
      section: "usage",
    },
    {
      label: "Campaigns",
      ...getStatData("campaigns", "campaigns_used", counts?.totalCampaigns || 0),
      icon: <Megaphone size={18} />,
      color: "text-blue-500",
      trend: "12%",
      path: "/campaigns",
      section: "usage",
    },
    {
      label: "Agents",
      ...getStatData("staff", "staff_used", counts?.totalAgents || 0),
      icon: <Webhook size={18} />,
      color: "text-amber-500",
      trend: "1",
      path: "/agents",
      section: "usage",
    },
    {
      label: "Webhooks",
      ...getStatData("whatsapp_webhook", "webhooks_used", counts?.totalWebhooks || 0),
      icon: <Webhook size={18} />,
      color: "text-violet-500",
      trend: "1",
      path: "/webhooks",
      section: "usage",
    },
  ];

  const stats = allStats.filter((s) => s.section === section);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
      {stats.map((stat, index) => (
        <UsageStatCard key={index} label={stat.label} current={stat.current} limit={stat.limit} icon={stat.icon} color={stat.color} trend={stat.trend} path={stat.path} isLoading={isLoading} showUsage={isActive && !["Sent", "Received", "Orders", "Webhooks"].includes(stat.label)} />
      ))}
    </div>
  );
};

export default StatCards;
