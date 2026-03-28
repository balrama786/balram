import { ChangePasswordPayload, ForgotPasswordRequest, GenericResponse, RegisterPayload, RegisterResponse, ResendOtpRequest, ResetPasswordRequest, UpdateProfilePayload, VerifyOtpRequest, User } from "@/src/types/auth";
import { baseApi } from "./baseApi";

export const authApi = baseApi.enhanceEndpoints({ addTagTypes: ["User"] }).injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation<RegisterResponse, RegisterPayload>({
      query: (data) => ({
        url: "/auth/register",
        method: "POST",
        body: data,
      }),
    }),
    forgotPassword: builder.mutation<GenericResponse, ForgotPasswordRequest>({
      query: (data) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body: data,
      }),
    }),
    verifyOtp: builder.mutation<GenericResponse, VerifyOtpRequest>({
      query: (data) => ({
        url: "/auth/verify-otp",
        method: "POST",
        body: data,
      }),
    }),
    resendOTP: builder.mutation<GenericResponse, ResendOtpRequest>({
      query: (data) => ({
        url: "/auth/resend-otp",
        method: "POST",
        body: data,
      }),
    }),
    resetPassword: builder.mutation<GenericResponse, ResetPasswordRequest>({
      query: (data) => ({
        url: "/auth/reset-password",
        method: "POST",
        body: data,
      }),
    }),
    getProfile: builder.query<{ user: User }, void>({
      query: () => ({
        url: "/auth/profile",
        method: "GET",
      }),
      providesTags: ["User"],
    }),
    updateProfile: builder.mutation<GenericResponse, UpdateProfilePayload>({
      query: (data) => ({
        url: "/auth/profile",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    changePassword: builder.mutation<GenericResponse, ChangePasswordPayload>({
      query: (data) => ({
        url: "/auth/change-password",
        method: "POST",
        body: data,
      }),
    }),
    getIsDemoMode: builder.query<
      {
        success: boolean;
        is_demo_mode: boolean;
        logo_light_url?: string;
        logo_dark_url?: string;
        favicon_url?: string;
        demo_user_email?: string;
        demo_user_password?: string;
        demo_agent_email?: string;
        demo_agent_password?: string;
      },
      void
    >({
      query: () => "/is-demo-mode",
    }),
  }),
});

export const { useRegisterMutation, useForgotPasswordMutation, useVerifyOtpMutation, useResetPasswordMutation, useResendOTPMutation, useUpdateProfileMutation, useChangePasswordMutation, useGetProfileQuery, useGetIsDemoModeQuery } = authApi;
