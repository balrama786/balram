/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Skeleton } from "@/src/elements/ui/skeleton";
import { useAppDispatch, useAppSelector } from "@/src/redux/hooks";
import { setSidebarToggle } from "@/src/redux/reducers/layoutSlice";
import { MenuItem, SidebarProps } from "@/src/types/components";
import { setPageTitle } from "@/src/redux/reducers/settingSlice";
import { ChevronDown, ChevronLeft, ChevronRight, Globe, Mail, Menu, X } from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { menuItems } from "../data/components";

const SidebarSkeleton = ({ isVisuallyExpanded }: { isVisuallyExpanded: boolean }) => (
  <div className={`p-3 space-y-4 ${!isVisuallyExpanded ? "items-center flex flex-col" : ""}`}>
    {[1, 2].map((i) => (
      <div key={i} className={`flex items-center gap-3 w-full ${!isVisuallyExpanded ? "justify-center" : "px-3"}`}>
        <Skeleton className="h-9 w-9 rounded-lg shrink-0" />
        {isVisuallyExpanded && <Skeleton className="h-5 flex-1 rounded-md" />}
      </div>
    ))}
  </div>
);

const AgentSidebarCard = ({ isVisuallyExpanded, user }: { isVisuallyExpanded: boolean; user: any }) => {
  const { app_email } = useAppSelector((state) => state.setting);
  if (!isVisuallyExpanded) return null;
  return (
    <div className="mx-4 mb-8 p-5 rounded-2xl bg-[#f8fafc] dark:bg-white/2 border border-slate-100 dark:border-white/5 relative overflow-hidden group animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col gap-4">
        {/* Profile Section */}
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-white/5">
          <div className="w-10 h-10 rounded-xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary font-bold text-lg">{user?.name?.charAt(0).toUpperCase() || "A"}</div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-slate-800 dark:text-white truncate">{user?.name || "Agent"}</p>
            <div className="flex items-center gap-1.5">
              <p className="text-[10px] font-medium text-slate-400">{user?.email || "Support Specialist"}</p>
            </div>
          </div>
        </div>

        {/* Support Info */}
        <div className="space-y-3">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-slate-400">
              <Mail size={12} />
              <span className="text-[9px] font-black uppercase tracking-widest">Official Support</span>
            </div>
            <p className="text-[11px] font-medium text-slate-700 dark:text-slate-300">{app_email}</p>
          </div>

          <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-white/5">
            <div className="flex items-center gap-2">
              <Globe size={12} className="text-primary" />
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">System Status</span>
            </div>
            <span className="text-[9px] font-bold text-primary bg-primary/20 px-2 py-0.5 rounded-full">Operational</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const Sidebar = ({ onMenuClick }: SidebarProps) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const contactId = searchParams.get("contact_id");
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const { sidebarToggle } = useAppSelector((state) => state.layout);
  const { theme } = useTheme();
  const { logo_light_url, logo_dark_url, sidebar_light_logo_url, sidebar_dark_logo_url, app_name } = useAppSelector((state) => state.setting);
  const { user } = useAppSelector((state) => state.auth);
  const role = user?.role;
  const isAgent = role === "agent";

  const { userSetting } = useAppSelector((state) => state.setting);
  const restApiEnabled = userSetting?.data?.features?.rest_api;
  const { selectedWorkspace } = useAppSelector((state) => state.workspace);
  const isBaileys = selectedWorkspace?.waba_type === "baileys";

  const restrictedPaths = ["/templates", "/campaigns", "/orders", "/catalogues", "/templates_library", "/webhooks"];

  const filteredMenuItems = isAgent
    ? menuItems.filter((item) => item.label === "sidebar.chat" || item.label === "sidebar.tasks").map((item) => (item.label === "sidebar.tasks" ? { ...item, path: "/tasks", section: undefined, order: 3 } : item))
    : menuItems.filter((item) => {
        if (item.path !== "/tasks" && (item.path !== "/developer" || restApiEnabled)) {
          if (isBaileys && restrictedPaths.some((p) => item.path.startsWith(p))) {
            return false;
          }
          return true;
        }
        return false;
      });

  const sections = ["sidebar.integrations", "sidebar.auto_responses", "sidebar.my_subscription", "sidebar.marketing"];
  const filteredSections = isAgent ? [] : sections;
  const [isHovered, setIsHovered] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleResize = () => {
      if (window.innerWidth >= 1025) {
        setIsMobileOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    const activeItem = filteredMenuItems.find((item) => isPathActive(item.path));
    if (activeItem) {
      dispatch(setPageTitle(t(activeItem.label)));
    }
  }, [pathname, filteredMenuItems, t, dispatch]);

  const isVisuallyExpanded = mounted ? !sidebarToggle || isHovered || isMobileOpen : false;

  const sidebarLogo = useMemo<string | null>(() => {
    if (!mounted) return null;

    const isDark = theme === "dark";
    const API_URL = process.env.NEXT_PUBLIC_STORAGE_URL ?? "";
    const resolveUrl = (url?: string) => {
      if (!url) return "";
      return url.startsWith("http") ? url : `${API_URL}${url}`;
    };

    if (isVisuallyExpanded) {
      const url = isDark ? logo_dark_url : logo_light_url;
      return resolveUrl(url) || "/assets/logos/logo1.png";
    }

    const url = isDark ? sidebar_dark_logo_url : sidebar_light_logo_url;
    return resolveUrl(url) || "/assets/logos/logo1.png";
  }, [mounted, theme, isVisuallyExpanded, logo_light_url, logo_dark_url, sidebar_light_logo_url, sidebar_dark_logo_url]);

  const [openSections, setOpenSections] = useState<string[]>(["sidebar.integrations", "sidebar.auto_responses", "sidebar.my_subscription", "sidebar.marketing"]);

  const toggleSection = (section: string) => {
    setOpenSections((prev) => (prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]));
  };

  const handleItemClick = (item: MenuItem) => {
    router.push(item.path);
    if (onMenuClick) onMenuClick(t(item.label));
    setIsMobileOpen(false);
  };

  const isPathActive = (path: string) => {
    if (pathname.startsWith("/campaigns/create") && contactId) {
      if (path === "/chat") return true;
      if (path === "/campaigns") return false;
    }

    if (pathname.startsWith("/tasks") && path === "/agents") {
      return true;
    }

    if (pathname === path) return true;
    if (pathname.length > 1 && path.length > 1 && pathname.startsWith(path + "/")) return true;
    if (path === "/templates" && pathname.startsWith("/templates_library")) return true;
    return false;
  };

  const renderMenuItem = (item: MenuItem) => {
    const isActive = isPathActive(item.path);

    return (
      <div key={item.label} className="relative group">
        <div
          onClick={() => handleItemClick(item)}
          className={`
            w-full flex items-center gap-3 rounded-lg transition-all duration-300 mb-1 cursor-pointer
            ${isVisuallyExpanded ? "px-3 py-2.5" : "px-0 py-3 justify-center"}
            ${isActive ? "bg-(--light-primary) dark:bg-primary text-white scale-[1.02]" : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-(--table-hover) hover:translate-x-1"}
          `}
        >
          <span className={`${!isActive ? "text-slate-600 dark:text-amber-50" : "text-primary dark:text-white"} shrink-0`}>{item.icon}</span>
          {isVisuallyExpanded && <span className={`font-medium text-sm truncate ${isActive ? "text-primary dark:text-white" : "text-slate-700 dark:text-white"}`}>{t(item.label)}</span>}
        </div>

        {/* Tooltip in collapsed mode */}
        {!isVisuallyExpanded && (
          <span
            className="absolute left-14 rtl:right-14 rtl:left-auto top-1/2 -translate-y-1/2 
            bg-gray-900 text-white text-xs px-2 py-1 rounded 
            opacity-0 group-hover:opacity-100 whitespace-nowrap z-50 pointer-events-none transition-opacity shadow-lg"
          >
            {t(item.label)}
          </span>
        )}
      </div>
    );
  };

  const sidebarContent = (
    <div className="h-full flex flex-col bg-white dark:bg-(--card-color) border-r border-gray-200 dark:border-(--card-border-color)" onMouseEnter={() => sidebarToggle && setIsHovered(true)} onMouseLeave={() => sidebarToggle && setIsHovered(false)}>
      {/* Logo */}
      <div className={`flex items-center justify-center h-18 border-b border-gray-200 dark:border-(--card-border-color) transition-all duration-300 ${isVisuallyExpanded ? "px-6" : "px-2"}`}>
        <div className={`flex items-center w-full overflow-hidden ${isVisuallyExpanded ? "justify-between" : "justify-center"}`}>
          <div className="flex items-center gap-3 overflow-hidden">
            {sidebarLogo === null ? (
              /* Loading skeleton while settings fetch */
              <div className="h-10 w-28 bg-gray-200 dark:bg-white/10 animate-pulse rounded-md" />
            ) : (
              <Image src={sidebarLogo} alt={app_name || "logo"} width={140} height={40} unoptimized className={`max-h-10 object-contain transition-all duration-300 ${isVisuallyExpanded ? "w-auto" : "w-full max-w-10"}`} />
            )}
          </div>

          {/* Desktop Toggle Button */}
          {isVisuallyExpanded && (
            <div className="ml-2 rtl:mr-2 rtl:ml-0 text-gray-500 hover:text-green-600 transition-colors hidden min-[1025px]:block" onClick={() => dispatch(setSidebarToggle())}>
              {!sidebarToggle ? <ChevronLeft size={20} className="rtl:rotate-180" /> : <ChevronRight size={20} className="rtl:rotate-180" />}
            </div>
          )}

          {/* Mobile Close Button */}
          <div className="ml-2 rtl:mr-2 rtl:ml-0 text-gray-500 hover:text-red-500 transition-colors min-[1025px]:hidden cursor-pointer" onClick={() => setIsMobileOpen(false)}>
            <X size={20} />
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <nav className={`flex-1 overflow-y-auto p-3 space-y-1 custom-scrollbar ${!isVisuallyExpanded ? "overflow-x-hidden" : ""}`}>
        {!mounted || !user ? (
          <SidebarSkeleton isVisuallyExpanded={isVisuallyExpanded} />
        ) : (
          <>
            {/* Top level items (before sections) */}
            {filteredMenuItems
              .filter((item) => !item.section && item.order < 4)
              .sort((a, b) => a.order - b.order)
              .map(renderMenuItem)}

            {/* Sectioned items */}
            {filteredSections.map((section) => {
              const sectionItems = filteredMenuItems.filter((item) => item.section === section);
              if (sectionItems.length === 0) return null;
              const isOpen = openSections.includes(section);

              return (
                <div key={section} className="mb-2">
                  {isVisuallyExpanded ? (
                    <>
                      <div onClick={() => toggleSection(section)} className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-slate-400 dark:text-gray-400 dark:hover:text-gray-300 transition-colors cursor-pointer">
                        <span className="truncate">{t(section)}</span>
                        <ChevronDown size={16} className={`shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
                      </div>
                      <div
                        className={`
                          space-y-1 overflow-hidden transition-all duration-300
                          ${isOpen ? "max-h-96 opacity-100 mt-1" : "max-h-0 opacity-0"}
                        `}
                      >
                        {sectionItems.sort((a, b) => a.order - b.order).map(renderMenuItem)}
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Show divider only before first section item */}
                      <div className="my-2 border-t border-gray-100 dark:border-gray-800" />
                      {/* Show all section items in collapsed mode */}
                      <div className="space-y-1">{sectionItems.sort((a, b) => a.order - b.order).map(renderMenuItem)}</div>
                    </>
                  )}
                </div>
              );
            })}

            {/* Bottom level items (after sections) */}
            {filteredMenuItems
              .filter((item) => !item.section && item.order >= 15)
              .sort((a, b) => a.order - b.order)
              .map(renderMenuItem)}
          </>
        )}
      </nav>

      {isAgent && <AgentSidebarCard isVisuallyExpanded={isVisuallyExpanded} user={user} />}
    </div>
  );

  return (
    <>
      {!isMobileOpen && (
        <div onClick={() => setIsMobileOpen(!isMobileOpen)} className="fixed top-4 left-4 rtl:right-4 rtl:left-auto z-101 p-2 rounded-lg bg-white dark:bg-(--page-body-bg) shadow-lg border border-gray-200 dark:border-none min-[1025px]:hidden cursor-pointer">
          <Menu size={24} />
        </div>
      )}

      {isMobileOpen && <div className="min-[1025px]:hidden fixed inset-0 bg-black/50 z-100" onClick={() => setIsMobileOpen(false)} />}

      <aside
        className={`
          fixed top-0 left-0 rtl:right-0 rtl:left-auto h-full z-101 shrink-0
          transform transition-all duration-300 ease-in-out
          ${isVisuallyExpanded ? "w-66.5" : "w-20"}
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full rtl:translate-x-full min-[1025px]:translate-x-0 min-[1025px]:rtl:translate-x-0"}
        `}
      >
        {sidebarContent}
      </aside>
    </>
  );
};

export default Sidebar;
