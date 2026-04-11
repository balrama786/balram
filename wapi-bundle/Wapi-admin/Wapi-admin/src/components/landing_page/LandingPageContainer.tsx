/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/src/elements/ui/button";
import { useGetLandingPageQuery, useUpdateLandingPageMutation } from "@/src/redux/api/landingPageApi";
import CommonHeader from "@/src/shared/CommonHeader";
import { LandingPageData } from "@/src/types/landingPage";
import { CreditCard, HelpCircle, Layers, Layout, MessageSquareQuote, Monitor, PhoneCall, RefreshCw, Rocket, Save } from "lucide-react";
import Can from "../shared/Can";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import ContactForm from "./sections/ContactForm";
import FaqForm from "./sections/FaqForm";
import FeaturesForm from "./sections/FeaturesForm";
import FooterForm from "./sections/FooterForm";
import HeroForm from "./sections/HeroForm";
import PlatformForm from "./sections/PlatformForm";
import PricingForm from "./sections/PricingForm";
import TestimonialsForm from "./sections/TestimonialsForm";

const tabs = [
  {
    id: "hero",
    label: "Hero",
    icon: Rocket,
    description: "Main landing header",
  },
  {
    id: "features",
    label: "Features",
    icon: Layers,
    description: "Highlight key values",
  },
  {
    id: "platform",
    label: "Platform",
    icon: Monitor,
    description: "Showcase platform features",
  },
  {
    id: "pricing",
    label: "Pricing",
    icon: CreditCard,
    description: "Subscription plans",
  },
  {
    id: "testimonials",
    label: "Testimonials",
    icon: MessageSquareQuote,
    description: "Customer feedback",
  },
  {
    id: "faq",
    label: "FAQ",
    icon: HelpCircle,
    description: "Common questions",
  },
  {
    id: "contact",
    label: "Contact",
    icon: PhoneCall,
    description: "Get in touch info",
  },
  {
    id: "footer",
    label: "Footer",
    icon: Layout,
    description: "Social links & legal",
  },
] as const;

type TabId = (typeof tabs)[number]["id"];

const LandingPageContainer = () => {
  const { t } = useTranslation();
  const { data: landingResponse, isLoading, refetch } = useGetLandingPageQuery();
  const [updateLandingPage, { isLoading: isUpdating }] = useUpdateLandingPageMutation();

  const [activeTab, setActiveTab] = useState<TabId>("hero");
  const [formData, setFormData] = useState<LandingPageData | null>(null);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    if (landingResponse?.data) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData(landingResponse.data);
    }
  }, [landingResponse]);

  const handleSectionChange = (section: keyof LandingPageData, sectionData: any) => {
    if (!formData) return;
    setFormData({ ...formData, [section]: sectionData });
    setIsDirty(true);
  };

  const handleSave = async () => {
    if (!formData) return;

    try {
      console.log("Prepare Saving Landing Data...", formData);
      // Prepare payload - extract IDs for plans, testimonials, faqs if they are objects
      const payload: any = JSON.parse(JSON.stringify(formData)); // Deep clone to avoid mutating state

      if (payload.pricing_section && Array.isArray(payload.pricing_section.plans)) {
        payload.pricing_section.plans = payload.pricing_section.plans
          .map((p: any) => {
            if (!p) return null;
            if (typeof p === "string") return p;
            return p?._id?._id || p?._id || p;
          })
          .filter(Boolean);
      }
      if (payload.testimonials_section && Array.isArray(payload.testimonials_section.testimonials)) {
        payload.testimonials_section.testimonials = payload.testimonials_section.testimonials
          .map((t: any) => {
            if (!t) return null;
            if (typeof t === "string") return t;
            return t?._id?._id || t?._id || t;
          })
          .filter(Boolean);
      }
      if (payload.faq_section && Array.isArray(payload.faq_section.faqs)) {
        payload.faq_section.faqs = payload.faq_section.faqs
          .map((f: any) => {
            if (!f) return null;
            if (typeof f === "string") return f;
            return f?._id?._id || f?._id || f;
          })
          .filter(Boolean);
      }
      if (payload.platform_section && Array.isArray(payload.platform_section.items)) {
        payload.platform_section.items = payload.platform_section.items.map((item: any, index: number) => ({
          ...item,
          step: index + 1,
        }));
      }

      console.log("Final Payload for API:", payload);

      const result = await updateLandingPage(payload).unwrap();
      console.log("Update Result:", result);

      setIsDirty(false);
      toast.success("Landing page updated successfully");
      refetch();
    } catch (error: any) {
      console.error("Landing Page Update Crash/Error:", error);
      toast.error(error?.data?.message || error?.message || "Failed to update landing page");
    }
  };

  const renderActiveTab = () => {
    if (!formData) return null;

    switch (activeTab) {
      case "hero":
        return <HeroForm data={formData.hero_section} onChange={(data) => handleSectionChange("hero_section", data)} />;
      case "features":
        return <FeaturesForm data={formData.features_section} onChange={(data) => handleSectionChange("features_section", data)} />;
      case "platform":
        return <PlatformForm data={formData.platform_section || { badge: "", title: "", items: [] }} onChange={(data) => handleSectionChange("platform_section", data)} />;
      case "pricing":
        return <PricingForm data={formData.pricing_section} onChange={(data) => handleSectionChange("pricing_section", data)} />;
      case "testimonials":
        return <TestimonialsForm data={formData.testimonials_section} onChange={(data) => handleSectionChange("testimonials_section", data)} />;
      case "faq":
        return <FaqForm data={formData.faq_section} onChange={(data) => handleSectionChange("faq_section", data)} />;
      case "contact":
        return <ContactForm data={formData.contact_section} onChange={(data) => handleSectionChange("contact_section", data)} />;
      case "footer":
        return <FooterForm data={formData.footer_section} onChange={(data) => handleSectionChange("footer_section", data)} />;
      default:
        return null;
    }
  };

  const activeTabInfo = tabs.find((t) => t.id === activeTab)!;

  return (
    <div className="flex flex-col min-h-full pb-10">
      <CommonHeader title={t("landing_page.title")} description={t("landing_page.description")} onRefresh={refetch} isLoading={isLoading} />

      <div className="flex flex-col [@media(min-width:1421px)]:flex-row gap-8 flex-1 mt-5">
        {/* Left Navigation */}
        <aside className="[@media(min-width:1421px)]:w-[320px] shrink-0">
          <div className="[@media(min-width:1421px)]:sticky [@media(min-width:1421px)]:top-24 space-y-6">
            <div className="bg-white dark:bg-(--card-color) rounded-xl border border-gray-100 dark:border-(--card-border-color) shadow-xl shadow-gray-200/20 dark:shadow-none overflow-hidden p-3">
              <div className="px-5 py-4 mb-2 hidden lg:flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400">{t("landing_page.layout_sections")}</span>
              </div>
              <div className="flex [@media(min-width:1421px)]:flex-col gap-1.5 overflow-x-auto [@media(min-width:1421px)]:overflow-x-visible pb-3 [@media(min-width:1421px)]:pb-0 px-1 snap-x custom-scrollbar -mx-1 [@media(min-width:1421px)]:mx-0">
                {tabs.map((tab) => {
                  const isActive = activeTab === tab.id;
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`
                        flex items-center gap-3 [@media(min-width:1421px)]:gap-4 px-4 [@media(min-width:1421px)]:px-5 py-3 [@media(min-width:1421px)]:py-4 rounded-lg text-left transition-all duration-300 group relative overflow-hidden shrink-0 snap-center [@media(min-width:1421px)]:snap-start
                        ${isActive ? "bg-primary text-white shadow-xl shadow-primary/20" : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-(--dark-body) hover:text-gray-400"}
                      `}
                    >
                      <div
                        className={`
                        w-8 h-8 [@media(min-width:1421px)]:w-10 [@media(min-width:1421px)]:h-10 rounded-lg flex items-center justify-center shrink-0 transition-all duration-500
                        ${isActive ? "bg-white/20 text-white" : "bg-gray-100 dark:bg-(--dark-body) text-gray-400 group-hover:scale-110 group-hover:bg-primary/5 group-hover:text-primary"}
                      `}
                      >
                        <Icon className="w-4 h-4 [@media(min-width:1421px)]:w-5 [@media(min-width:1421px)]:h-5" />
                      </div>
                      <div className="flex-1 min-w-0 pr-2 [@media(min-width:1421px)]:pr-0">
                        <p className={`text-[13px] [@media(min-width:1421px)]:text-[15px] font-bold truncate ${isActive ? "text-white" : ""}`}>{t(`landing_page.tabs.${tab.id}`)}</p>
                        <p className={`hidden [@media(min-width:1421px)]:block text-[10px] truncate uppercase tracking-tight font-medium ${isActive ? "text-white/60" : "text-gray-400"}`}>{t(`landing_page.tabs.${tab.id}_desc`)}</p>
                      </div>
                      {isActive && <div className="absolute right-0 top-0 bottom-0 w-1.5 bg-white/30 hidden [@media(min-width:1421px)]:block" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </aside>

        {/* Form Content Area */}
        <div className="flex-1 min-w-0 flex flex-col">
          {/* Section Header Card */}
          <div className="bg-white dark:bg-(--card-color) p-4 lg:p-5 rounded-lg flex-wrap shadow-xl shadow-gray-200/20 dark:shadow-none border border-gray-100 dark:border-(--card-border-color) mb-6 lg:mb-8 flex flex-col [@media(min-width:1421px)]:flex-row [@media(min-width:1421px)]:items-center justify-between gap-4 lg:gap-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/2 rounded-full -mr-32 -mt-32 hidden [@media(min-width:1421px)]:block" />

            <div className="flex items-center gap-4 lg:gap-6 relative">
              <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-lg bg-primary/10 flex items-center justify-center text-primary shadow-inner shrink-0">
                <activeTabInfo.icon className="w-6 h-6 lg:w-8 lg:h-8" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-0.5 lg:mb-1">
                  <div className="w-1 h-1 rounded-full bg-primary" />
                  <h2 className="text-lg lg:text-2xl font-black text-gray-900 dark:text-gray-100 tracking-tight">
                    {t(`landing_page.tabs.${activeTab}`)} {t("landing_page.configuration")}
                  </h2>
                </div>
                <p className="text-[12px] lg:text-[14px] text-gray-400 font-medium px-1">
                  {t(`landing_page.tabs.${activeTab}_desc`)} {t("landing_page.global_appearance")}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 lg:gap-3 relative w-full [@media(min-width:1421px)]:w-auto">
              {isDirty && (
                <div className="hidden sm:flex items-center gap-1.5 lg:gap-2 text-[10px] lg:text-[11px] font-black uppercase tracking-widest text-primary px-3 lg:px-5 py-2 lg:py-2.5 bg-primary/5 rounded-full border border-primary/10 shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
                  {t("common.draft")}
                </div>
              )}
              <div className="flex-1 [@media(min-width:1421px)]:flex-initial flex items-center gap-2 w-full">
                <Button variant="outline" size="sm" onClick={refetch} className="flex-1 [@media(min-width:1421px)]:flex-initial h-10 lg:h-12 px-4 lg:px-6 gap-2 border-gray-100 dark:bg-page-body dark:border-none rounded-lg font-bold text-gray-500 dark:hover:bg-(--table-hover) hover:bg-gray-50 group">
                  <RefreshCw className={`w-3.5 h-3.5 lg:w-4 group-active:rotate-180 transition-transform ${isLoading ? "animate-spin" : ""}`} />
                  <span className="[@media(min-width:1421px)]:inline">{t("common.refresh")}</span>
                </Button>
                <Can permission="update.landing_page">
                  <Button size="sm" onClick={handleSave} disabled={isUpdating || isLoading} className="flex-1 [@media(min-width:1421px)]:flex-initial h-10 lg:h-12 px-6 lg:px-8 gap-2 lg:gap-3 bg-primary hover:bg-primary/90 text-white shadow-2xl shadow-primary/30 rounded-lg font-black text-[11px] lg:text-[13px] uppercase tracking-wider transition-all active:scale-95 group">
                    {isUpdating ? <div className="w-4 h-4 border border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4 group-hover:-translate-y-px transition-transform" />}
                    {t("common.publish")}
                  </Button>
                </Can>
              </div>
            </div>
          </div>

          <div className="flex-1">
            {isLoading ? (
              <div className="h-80 [@media(min-width:1421px)]:h-150 flex flex-col items-center justify-center bg-white dark:bg-(--card-color) rounded-2xl [@media(min-width:1421px)]:rounded-[3rem] border border-gray-100 dark:border-(--card-border-color) shadow-xl shadow-gray-100/50">
                <div className="relative w-16 h-16 lg:w-20 lg:h-20 mb-6">
                  <div className="absolute inset-0 border-4 border-primary/10 rounded-full" />
                  <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
                <p className="text-[14px] lg:text-[15px] font-bold text-gray-900">Synchronizing...</p>
                <p className="text-[11px] lg:text-[12px] text-gray-400 mt-1">Fetching appearance settings</p>
              </div>
            ) : (
              <div className="bg-white dark:bg-(--card-color) p-4 [@media(min-width:1421px)]:p-8 rounded-lg border border-gray-100 dark:border-(--card-border-color) shadow-2xl shadow-primary/2 dark:shadow-none min-h-80 [@media(min-width:1421px)]:min-h-150 relative">
                <div className="absolute top-10 right-10 opacity-5 pointer-events-none hidden [@media(min-width:1421px)]:block">
                  <activeTabInfo.icon className="w-40 h-40" />
                </div>
                <div className="relative">{renderActiveTab()}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPageContainer;
