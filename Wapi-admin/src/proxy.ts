import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const token = request.cookies.get("authToken")?.value;
  const isLoginPage = request.nextUrl.pathname === "/auth/login";
  const isApiRoute = request.nextUrl.pathname.startsWith("/api/");
  
  // Allow access to forgot password flow pages without authentication
  const isForgotPasswordFlow = [
    "/auth/forgot-password",
    "/auth/verify-otp",
    "/auth/reset-password"
  ].includes(request.nextUrl.pathname);

  if (isApiRoute) {
    return NextResponse.next();
  }

  if (!token && !isLoginPage && !isForgotPasswordFlow) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  if (token && isLoginPage) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
