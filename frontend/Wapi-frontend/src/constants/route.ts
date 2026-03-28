export const ROUTES = {
  Landing: "/landing",
  Dashboard: "/dashboard",
  Login: "/auth/login",
  SignUp: "/auth/register",
  ForgotPassword: "/auth/forgot-password",
  OTPVerification: "/auth/verify-otp",
  ResetPassword: "/auth/reset-password",
  Subscription: "/subscriptions",
  BotFlow: "/automation_flows",
  BuilderBotFlow: "/automation_flows/builder",
  ManageWaba: "/manage_waba",
};

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;

export const ImagePath: string = "/assets/images";
export const ImageBaseUrl = process.env.NEXT_PUBLIC_STORAGE_URL;