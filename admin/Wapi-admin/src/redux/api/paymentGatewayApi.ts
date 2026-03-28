import { baseApi } from "./baseApi";
import type { StripeSettings, RazorpaySettings } from "@/src/types/paymentGateway";

// Re-export for backward compatibility
export type { StripeSettings, RazorpaySettings };

export const paymentGatewayApi = baseApi.enhanceEndpoints({ addTagTypes: ["PaymentGateway", "Stripe", "Razorpay"] }).injectEndpoints({
  endpoints: (builder) => ({
    getStripeSettings: builder.query<{ success: boolean; data: StripeSettings }, void>({
      query: () => "/payment_gateway/stripe",
      providesTags: ["Stripe"],
    }),
    updateStripeSettings: builder.mutation<{ success: boolean; data: StripeSettings }, StripeSettings>({
      query: (body) => ({
        url: "/payment_gateway/stripe",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Stripe"],
    }),
    getRazorpaySettings: builder.query<{ success: boolean; data: RazorpaySettings }, void>({
      query: () => "/payment_gateway/razorpay",
      providesTags: ["Razorpay"],
    }),
    updateRazorpaySettings: builder.mutation<{ success: boolean; data: RazorpaySettings }, RazorpaySettings>({
      query: (body) => ({
        url: "/payment_gateway/razorpay",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Razorpay"],
    }),
  }),
});

export const { useGetStripeSettingsQuery, useUpdateStripeSettingsMutation, useGetRazorpaySettingsQuery, useUpdateRazorpaySettingsMutation } = paymentGatewayApi;
