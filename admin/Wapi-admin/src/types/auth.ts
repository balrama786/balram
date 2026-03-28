export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
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
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  authRedirectField: string;
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
  mobile?: string;
  email?: string;
  otp: string;
  password: string;
  password_confirmation: string; 
}

export interface GenericResponse {
   message: string;
   status?: boolean;
}
