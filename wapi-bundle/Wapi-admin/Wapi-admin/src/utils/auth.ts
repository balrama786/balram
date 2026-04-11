import { User } from "../types/auth";
import { setCookie, getCookie, removeCookie, hasCookie } from "./cookie";

const TOKEN_KEY = "authToken";
const USER_KEY = "userData";

// Cookie options for authentication token
const getCookieOptions = () => ({
  path: "/",
  maxAge: 7 * 24 * 60 * 60, // 7 days
  secure: process.env.NODE_ENV === "production",
  sameSite: "Strict" as const,
});

export const authUtils = {
  // Token Management - Stores in both cookie and localStorage for reliability
  setToken: (token: string): void => {
    if (typeof window !== "undefined") {
      // Store in cookie (primary storage for server-side access)
      setCookie(TOKEN_KEY, token, getCookieOptions());
      // Store in localStorage (fallback for client-side access)
      localStorage.setItem(TOKEN_KEY, token);
    }
  },

  getToken: (): string | null => {
    if (typeof window !== "undefined") {
      // Try cookie first (preferred for SSR compatibility)
      const cookieToken = getCookie(TOKEN_KEY);
      if (cookieToken) {
        return cookieToken;
      }
      // Fallback to localStorage
      return localStorage.getItem(TOKEN_KEY);
    }
    return null;
  },

  removeToken: (): void => {
    if (typeof window !== "undefined") {
      removeCookie(TOKEN_KEY, getCookieOptions());
      localStorage.removeItem(TOKEN_KEY);
    }
  },

  // User Data Management - Stores in localStorage (cookies have size limits)
  setUser: (user: User): void => {
    if (typeof window !== "undefined") {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    }
  },

  getUser: (): User | null => {
    if (typeof window !== "undefined") {
      const userData = localStorage.getItem(USER_KEY);
      return userData ? JSON.parse(userData) : null;
    }
    return null;
  },

  removeUser: (): void => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(USER_KEY);
    }
  },

  // Clear All Auth Data
  clearAuth: (): void => {
    authUtils.removeToken();
    authUtils.removeUser();
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return !!authUtils.getToken();
  },

  // Check if token exists in cookie
  hasTokenCookie: (): boolean => {
    if (typeof window !== "undefined") {
      return hasCookie(TOKEN_KEY);
    }
    return false;
  },

  // Verify token validity (optional - can add JWT decode logic)
  isTokenValid: (): boolean => {
    const token = authUtils.getToken();
    if (!token) return false;

    // Add your token validation logic here
    // For example, decode JWT and check expiration
    return true;
  },
};
