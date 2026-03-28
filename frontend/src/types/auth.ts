/* eslint-disable @typescript-eslint/no-explicit-any */
export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  phone?: string;
  country?: string;
  country_code?: string;
  note?: string;
  is_phoneno_hide?: boolean;
}

export interface LoginRequest {
  identifier: string;
  password: string;
  agenda?: string;
  role?: string;
}

export interface LoginResponse {
  message: string;
  token: string;
  user: User;
}

export interface AuthState {
  authRedirectField: string;
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface ForgotPasswordRequest {
  mobile?: string;
  email?: string;
}

export interface VerifyOtpRequest {
  mobile?: string;
  email?: string;
  otp: string;
}

export interface ResetPasswordRequest {
  email: string;
  otp?: string;
  new_password: string;
}

export interface GenericResponse {
  message: string;
  status?: boolean;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  data: {
    redirect: string;
  };
}

export interface RegisterPayload {
  name: string;
  email: string;
  phone: string;
  country: string;
  countryCode: string;
  password: string;
}

export interface ResendOtpRequest {
  email: string;
}

export interface ConnectionPayload {
  code: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  signupData: any;
  workspace_id?: string;
}

export interface ConnectWhatsAppPayload {
  name?: string;
  provider?: string;
  phone_number_id?: string;
  access_token?: string;
  whatsapp_business_account_id?: string;
  registred_phone_number?: string;
  business_id?: string;
  app_id?: string;
  workspace_id?: string;
}

export interface ConnectWhatsAppResponse {
  success: boolean;
  message?: string;
  data?: {
    waba_id: string;
    waba_name?: string;
    instance_name?: string;
    status?: string;
    provider?: string;
    phone_id?: string;
    phone_number_id?: string;
    display_phone_number?: string;
    verified_name?: string;
    is_new_waba?: boolean;
    is_new_phone?: boolean;
  };
}

export interface UpdateProfilePayload {
  name: string;
  email: string;
  phone: string;
  country: string;
  country_code: string;
  note: string;
}

export interface ChangePasswordPayload {
  current_password: string;
  new_password: string;
}
