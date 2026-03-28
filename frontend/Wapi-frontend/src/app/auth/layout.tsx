import ForceLightTheme from "@/src/components/auth/ForceLightTheme";
import { ReactNode } from "react";

/**
 * Auth layout — wraps all auth pages (login, register, forgot-password, etc.)
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
