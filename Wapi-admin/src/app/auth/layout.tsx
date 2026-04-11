import ForceLightTheme from "@/src/components/auth/ForceLightTheme";
import { ReactNode } from "react";

/**
 * Auth layout — wraps all auth pages (login, forgot-password, verify-otp, reset-password)
 * ForceLightTheme ensures the <html> element always has the 'light' class on auth pages,
 * regardless of the user's saved theme preference.
 */
export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <ForceLightTheme />
      {children}
    </>
  );
}
