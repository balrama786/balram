/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState, ReactNode } from "react";
import { useGetSettingsQuery } from "@/src/redux/api/settingApi";
import { useAppDispatch, useAppSelector } from "@/src/redux/hooks";
import { setSettings } from "@/src/redux/reducers/settingsSlice";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

const resolveUrl = (url?: string): string => {
  if (!url) return "";
  return url.startsWith("http") ? url : `${API_URL}${url}`;
};

const DEFAULT_FAVICON = "/assets/logos/sidebarLogo.png";

function applyFavicon(href: string) {
  if (typeof window === "undefined") return;
  const links = document.querySelectorAll("link[rel*='icon']");
  if (links.length > 0) {
    links.forEach((link: any) => {
      if (link.href !== href) link.href = href;
    });
  } else {
    const link = document.createElement("link");
    link.rel = "icon";
    link.href = href;
    document.head.appendChild(link);
  }
}

interface DynamicSettingsProviderProps {
  children: ReactNode;
}

const DynamicSettingsProvider = ({ children }: DynamicSettingsProviderProps) => {
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const { data: settingsData, isSuccess } = useGetSettingsQuery();
  const { data: settings, pageTitle } = useAppSelector((state) => state.settings);
  const [mounted, setMounted] = useState(false);
  const { setTheme } = useTheme();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    if (settingsData) {
      dispatch(setSettings(settingsData));
    }
  }, [settingsData, dispatch]);

  useEffect(() => {
    if (mounted && settingsData?.default_theme_mode) {
      const saved = localStorage.getItem("theme");
      if (!saved || saved === "system") {
        setTheme(settingsData.default_theme_mode);
      }
    }
  }, [mounted, settingsData, setTheme]);

  useEffect(() => {
    if (!mounted || !settings || !isSuccess) return;

    const { app_name, app_description, favicon_url } = settings;
    const faviconHref = resolveUrl(favicon_url) || DEFAULT_FAVICON;

    const applyAll = () => {
      const fullTitle = `${pageTitle ? `${pageTitle} | ` : ""}${app_name || "Wapi"} | All-in-One WhatsApp Marketing & Automation Platform with CRM, Campaigns, Live Chat, Lead Generation, Business API SaaS Platform`;
      if (document.title !== fullTitle) document.title = fullTitle;
      if (app_description) {
        let meta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
        if (!meta) {
          meta = document.createElement("meta");
          meta.setAttribute("name", "description");
          document.head.appendChild(meta);
        }
        if (meta.getAttribute("content") !== app_description) {
          meta.setAttribute("content", app_description);
        }
      }
      if (faviconHref) applyFavicon(faviconHref);
    };

    applyAll();
    const observer = new MutationObserver(applyAll);
    observer.observe(document.head, { childList: true, subtree: false });
    const interval = setInterval(applyAll, 1000);

    return () => {
      observer.disconnect();
      clearInterval(interval);
    };
  }, [settings, isSuccess, pathname, mounted, pageTitle]);

  return <>{children}</>;
};

export default DynamicSettingsProvider;
