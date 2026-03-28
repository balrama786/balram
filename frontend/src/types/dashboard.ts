// Dashboard types

export interface DashboardCounts {
  totalAgents: number;
  totalMessagesSent: number;
  totalMessagesReceived: number;
  totalConversations: number;
  totalContacts: number;
  totalAutomationFlows: number;
  totalTemplates: number;
  totalCampaigns: number;
  totalTags: number;
}

export interface ContactYearlyEntry {
  _id: string;
  active: number;
  inactive: number;
  lead: number;
  customer: number;
  prospect: number;
  total: number;
}

export interface WeeklyMessageEntry {
  _id: string;
  incoming: number;
  outgoing: number;
  total: number;
}

export interface CampaignStatistics {
  totalCampaignsCreated: number;
  totalSent: number;
  messagesDelivered: number;
  messagesRead: number;
}

export interface CatalogData {
  ordersFromWhatsApp: number;
  revenueFromWhatsApp: number;
  totalProducts: number;
}

export interface MostUsedTemplate {
  _id: string;
  template_name: string;
  status: string;
  usageCount: number;
  sent: string;
  delivered: string;
  read: string;
}

export interface TemplateInsights {
  totalTemplatesApproved: number;
  rejectedTemplates: number;
  mostUsedTemplates: MostUsedTemplate[];
}

export interface DashboardData {
  counts: DashboardCounts;
  contactYearlyChart: ContactYearlyEntry[];
  weeklyMessagesChart: WeeklyMessageEntry[];
  campaignStatistics: CampaignStatistics;
  catalogData: CatalogData;
  templateInsights: TemplateInsights;
}

export interface DashboardStatCardProps {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  gradient: string;
  change?: string;
  changeType?: "up" | "down" | "neutral";
}

export interface StatItem {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color: string;
  badge?: string;
}

export interface StatCardsProps {
  data: DashboardData;
}

export interface ContactYearlyChartProps {
  data: ContactYearlyEntry[];
}

export interface WeeklyMessagesChartProps {
  data: WeeklyMessageEntry[];
}

export interface CampaignStatsSectionProps {
  data: CampaignStatistics;
}

export interface CatalogStatsSectionProps {
  data: CatalogData;
}

export interface TemplateInsightsSectionProps {
  data: TemplateInsights;
}

export interface DashboardDateFilterProps {
  onFilterChange: (params: { dateRange?: string; startDate?: string; endDate?: string }) => void;
}
