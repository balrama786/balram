import { baseApi } from "./baseApi";
import { 
  LoginRequest, 
  LoginResponse, 
  ForgotPasswordRequest, 
  VerifyOtpRequest, 
  ResetPasswordRequest, 
  GenericResponse 
} from "@/src/types/auth";

export const authApi = baseApi.enhanceEndpoints({ addTagTypes: ["User"] }).injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
    }),
    logout: builder.mutation<{ message: string }, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
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
    resetPassword: builder.mutation<GenericResponse, ResetPasswordRequest>({
      query: (data) => ({
        url: "/auth/reset-password",
        method: "POST",
        body: data,
      }),
    }),
    getIsDemoMode: builder.query<{ 
      success: boolean; 
      is_demo_mode: boolean;
      logo_light_url?: string;
      logo_dark_url?: string;
      favicon_url?: string;
      demo_user_email?: string;
      demo_user_password?: string;
      demo_agent_email?: string;
      demo_agent_password?: string;
    }, void>({
      query: () => "/is-demo-mode",
    }),
  }),
});

export const { 
  useLoginMutation, 
  useLogoutMutation, 
  useForgotPasswordMutation, 
  useVerifyOtpMutation, 
  useResetPasswordMutation,
  useGetIsDemoModeQuery
} = authApi;
