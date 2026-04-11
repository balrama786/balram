// Admin Dashboard types

export interface AdminDashboardData {
  counts: {
    totalUsers: number;
    activeSubscriptions: number;
    totalPlans: number;
    revenue: {
      today: number;
      month: number;
      total: number;
    };
    activeAIModels: number;
    totalContactInquiries: number;
  };
  charts: {
    planRevenueBreakdown: Array<{
      _id: string;
      totalRevenue: number;
      count: number;
    }>;
    revenueGraph: Array<{
      _id: string;
      totalRevenue: number;
      transactionCount: number;
    }>;
  };
  tables: {
    newUsers: Array<{
      _id: string;
      name: string;
      email: string;
      country: string | null;
      phone: string;
      created_at: string;
      planName: string;
      subscriptionStatus: string;
    }>;
    newSubscriptions: Array<{
      _id: string;
      status: string;
      current_period_end: string;
      payment_status: string;
      amount_paid: number;
      created_at: string;
      userId: string;
      userName: string;
      userEmail: string;
      planName: string;
      planPrice: number;
    }>;
    cancelledSubscriptions: Array<{
      _id: string;
      cancelled_at: string;
      notes: string | null;
      userId: string;
      userName: string;
      userEmail: string;
      planName: string;
    }>;
    recentInquiries: Array<{
      _id: string;
      name: string;
      email: string;
      subject: string;
      message: string;
      created_at: string;
    }>;
  };
}

export interface AdminDashboardResponse {
  success: boolean;
  data: AdminDashboardData;
}

export type DashboardTableData = AdminDashboardData["tables"];

export interface AdminStatCardsProps {
  data: AdminDashboardData;
}

export interface AdminChartsProps {
  data: AdminDashboardData;
}

export interface DashboardDateFilterProps {
  onFilterChange: (params: {
    dateRange?: string;
    startDate?: string;
    endDate?: string;
  }) => void;
}
