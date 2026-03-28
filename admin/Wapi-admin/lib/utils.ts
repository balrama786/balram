import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export function stripHtml(html: string) {
  if (typeof window === "undefined") return html;
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent || "";
}

export function getObjId(obj: any): string {
  if (!obj) return "";
  if (typeof obj === "string") return obj;
  return obj._id?._id || obj._id || obj;
}
