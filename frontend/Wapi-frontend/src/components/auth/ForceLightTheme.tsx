"use client";

import { useEffect } from "react";
import { useTheme } from "next-themes";

/**
 * Temporarily forces the light theme while this component is mounted.
 * When unmounted (user navigates away from auth pages), the stored theme is restored.
 */
export default function ForceLightTheme() {
  const { setTheme } = useTheme();

  useEffect(() => {
    // Force light on auth pages
    setTheme("light");

    // On cleanup (leaving auth route), restore user's saved preference
    return () => {
      const saved = localStorage.getItem("theme");
      if (saved && saved !== "light") {
        setTheme(saved);
      }
    };
  }, [setTheme]);

  // Renders nothing — purely a side-effect component
  return null;
}
