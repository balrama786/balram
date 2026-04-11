import { baseApi } from "./baseApi";
import type { AdminDashboardData, AdminDashboardResponse } from "@/src/types/dashboard";

// Re-export for backward compatibility
export type { AdminDashboardData, AdminDashboardResponse };

export const adminDashboardApi = baseApi.enhanceEndpoints({ addTagTypes: ["AdminDashboard"] }).injectEndpoints({
  endpoints: (builder) => ({
    getAdminDashboard: builder.query<AdminDashboardResponse, { dateRange?: string; startDate?: string; endDate?: string } | void>({
      query: (params) => ({
        url: "/dashboard",
        params: params || {},
      }),
      providesTags: ["AdminDashboard"],
    }),
  }),
});

export const { useGetAdminDashboardQuery } = adminDashboardApi;
