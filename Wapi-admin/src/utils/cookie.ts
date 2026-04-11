import Cookies from "js-cookie";

export interface CookieOptions {
  expires?: Date | number;
  maxAge?: number;
  path?: string;
  domain?: string;
  secure?: boolean;
  sameSite?: "Strict" | "Lax" | "None";
  httpOnly?: boolean;
}

const DEFAULT_OPTIONS: CookieOptions = {
  path: "/",
  sameSite: "Strict",
  secure: process.env.NODE_ENV === "production",
  maxAge: 7 * 24 * 60 * 60,
};

export const setCookie = (name: string, value: string, options: CookieOptions = {}): void => {
  if (typeof window === "undefined") {
    console.warn("setCookie called on server-side. Cookies should be set via API routes.");
    return;
  }

  const mergedOptions = { ...DEFAULT_OPTIONS, ...options };

  let expires: Date | number | undefined = mergedOptions.expires;
  if (mergedOptions.maxAge !== undefined && !expires) {
    expires = mergedOptions.maxAge / (24 * 60 * 60);
  }

  const cookieOptions: Cookies.CookieAttributes = {
    expires: expires,
    path: mergedOptions.path,
    domain: mergedOptions.domain,
    secure: mergedOptions.secure,
    sameSite: mergedOptions.sameSite,
  };

  Cookies.set(name, value, cookieOptions);
};

/**
 * Gets a cookie value by name
 */
export const getCookie = (name: string): string | null => {
  if (typeof window === "undefined") {
    return null;
  }

  return Cookies.get(name) || null;
};

/**
 * Removes a cookie
 */
export const removeCookie = (name: string, options: CookieOptions = {}): void => {
  if (typeof window === "undefined") {
    return;
  }

  const mergedOptions = { ...DEFAULT_OPTIONS, ...options };

  const cookieOptions: Cookies.CookieAttributes = {
    path: mergedOptions.path,
    domain: mergedOptions.domain,
  };

  Cookies.remove(name, cookieOptions);
};

/**
 * Checks if a cookie exists
 */
export const hasCookie = (name: string): boolean => {
  return getCookie(name) !== null;
};

/**
 * Gets all cookies as an object
 */
export const getAllCookies = (): Record<string, string> => {
  if (typeof window === "undefined") {
    return {};
  }

  return Cookies.get();
};
