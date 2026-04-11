/* eslint-disable @typescript-eslint/no-explicit-any */
import { ImageBaseUrl, ImagePath } from "@/src/constants";

/**
 * Utility to check if a URL is absolute (starts with http, https, data, etc.)
 */
export const isAbsoluteUrl = (url: string): boolean => {
    return /^(https?:|data:|\/\/|blob:)/i.test(url);
};

/**
 * Resolves an image source to a full URL based on project rules:
 * - If it's an absolute URL, return it as is.
 * - If it starts with "/uploads", prepend NEXT_PUBLIC_STORAGE_URL (ImageBaseUrl).
 * - If it starts with "/assets", return as is (local public assets).
 * - For other cases, use ImageBaseUrl or fallback to ImagePath.
 */
export const getResolvedImageUrl = (src: any, fallbackSrc?: string): string => {
    const defaultPlaceholder = `${ImagePath}/default2.png`;

    if (!src) {
        return fallbackSrc || defaultPlaceholder;
    }

    try {
        let sourceString: string;

        // Handle strings
        if (typeof src === "string") {
            sourceString = src.trim();
        }
        // Handle Next.js static imports or objects
        else if (typeof src === "object" && src !== null) {
            sourceString = (src.src || src.url || "").trim();
        }
        // Fallback for everything else
        else {
            sourceString = String(src).trim();
        }

        if (!sourceString) {
            return fallbackSrc || defaultPlaceholder;
        }

        // Rule 1: Absolute URLs (http, https, blob, data)
        if (isAbsoluteUrl(sourceString)) {
            return sourceString;
        }

        // Rule 2: Local public assets
        if (sourceString.startsWith("/assets/")) {
            return sourceString;
        }

        // Rule 3: Explicit ImagePath prefix
        if (sourceString.startsWith(ImagePath)) {
            return sourceString;
        }

        // Special Case: Next.js static media paths (already processed)
        if (sourceString.startsWith("/_next/")) {
            return sourceString;
        }

        // Ensure ImageBaseUrl ends with / for consistency
        const baseUrl = (ImageBaseUrl || "").endsWith("/") ? ImageBaseUrl : `${ImageBaseUrl}/`;

        // Rule 4: Uploads directory (Requirement)
        if (sourceString.startsWith("/uploads/")) {
            // Avoid double slashes if ImageBaseUrl has trailing slash and sourceString has leading slash
            return `${baseUrl}${sourceString.substring(1)}`;
        }

        // Rule 5: Relative paths starting with ./
        if (sourceString.startsWith("./")) {
            return `${baseUrl}${sourceString.replace("./", "")}`;
        }

        // Rule 6: Fix double prefixing for /images/
        // If it starts with /images/ it's likely meant to be in /assets/images/
        if (sourceString.startsWith("/images/")) {
            return `/assets${sourceString}`;
        }

        // Rule 7: Other absolute-looking paths
        if (sourceString.startsWith("/")) {
            return `${ImagePath}${sourceString}`;
        }

        // Rule 8: Simple filenames or paths without leading /
        if (!sourceString.includes("/") && sourceString.includes(".")) {
            return `${baseUrl}${sourceString}`;
        }

        // Default fallback: Prepend baseUrl or ImagePath
        return sourceString.includes("/") ? `${baseUrl}${sourceString.replace(/^\//, "")}` : `${ImagePath}/${sourceString}`;
    } catch (error) {
        console.error("Error resolving image source:", error);
        return fallbackSrc || defaultPlaceholder;
    }
};
