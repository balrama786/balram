/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useGetAdminTemplatesQuery, useLazyGetAdminTemplateByIdQuery } from "@/src/redux/api/adminTemplateApi";
import { useGetConnectionsQuery } from "@/src/redux/api/whatsappApi";
import CommonHeader from "@/src/shared/CommonHeader";
import { CircleDollarSign, LayoutGrid, Loader2, Shapes, ShoppingBag, Stethoscope, Watch } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { AdminTemplateCard } from "./AdminTemplateCard";
import { SelectWabaModal } from "./list/SelectWabaModal";
import { TemplatePreviewModal } from "./list/TemplatePreviewModal";

const SECTOR_DATA = {
  healthcare: ["appointment_booking", "appointment_reminder", "lab_reports", "prescription_ready", "health_tips"],
  ecommerce: ["order_summary", "order_management", "order_tracking", "new_arrivals", "cart_reminder", "delivery_update", "payment_confirmation", "return_refund"],
  fashion: ["new_collection", "sale_offer", "style_recommendation", "back_in_stock", "order_update"],
  financial_service: ["transaction_alert", "payment_due_reminder", "loan_update", "kyc_update", "policy_update"],
  general: ["customer_feedback", "welcome_message", "promotion", "announcement", "reminder"],
};

const SECTORS = [
  { id: "all", label: "All Templates", icon: LayoutGrid, color: "from-slate-400 to-slate-500" },
  { id: "healthcare", label: "Healthcare", icon: Stethoscope, color: "from-emerald-400 to-emerald-600" },
  { id: "ecommerce", label: "E-Commerce", icon: ShoppingBag, color: "from-blue-400 to-blue-600" },
  { id: "fashion", label: "Fashion", icon: Watch, color: "from-pink-400 to-pink-600" },
  { id: "financial_service", label: "Finance", icon: CircleDollarSign, color: "from-amber-400 to-amber-600" },
  { id: "general", label: "General", icon: Shapes, color: "from-indigo-400 to-indigo-600" },
];

const AdminTemplateLibrary = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const preSelectedWabaId = searchParams.get("wabaId");

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSector, setSelectedSector] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [previewTemplate, setPreviewTemplate] = useState<any>(null);
  const [usingTemplateId, setUsingTemplateId] = useState<string | null>(null);
  const [isWabaModalOpen, setIsWabaModalOpen] = useState(false);

  const {
    data: response,
    isLoading,
    refetch,
  } = useGetAdminTemplatesQuery({
    search: searchQuery || undefined,
    sector: selectedSector === "all" ? undefined : selectedSector,
    template_category: selectedCategory === "all" ? undefined : selectedCategory,
  });
  const [getAdminTemplateById] = useLazyGetAdminTemplateByIdQuery();
  const { data: connectionsResponse } = useGetConnectionsQuery({});

  const templates: any[] = response?.data || [];
  const connections = connectionsResponse?.data || [];

  const handleSectorChange = (sectorId: string) => {
    setSelectedSector(sectorId);
    setSelectedCategory("all");
  };
  const handleRefresh = () => {
    refetch();
    toast.success("Templates refreshed successfully");
  };

  const handleConfirmWabaSelection = async (selectedWabaId: string, templateId?: string) => {
    const idToUse = templateId || usingTemplateId;
    if (!idToUse) return;

    try {
      await getAdminTemplateById(idToUse).unwrap();
      router.push(`/templates/${selectedWabaId}/create?templateId=${idToUse}`);
    } catch {
      toast.error("Failed to load admin template. Please try again.");
    } finally {
      setUsingTemplateId(null);
    }
  };

  const handleUseTemplate = (templateId: string) => {
    if (connections.length === 0) {
      toast.error("No WABA connection found. Please connect a WhatsApp account first.");
      return;
    }

    if (preSelectedWabaId) {
      handleConfirmWabaSelection(preSelectedWabaId, templateId);
      return;
    }

    setUsingTemplateId(templateId);
    setIsWabaModalOpen(true);
  };

  return (
    <div className="sm:p-8 p-5 space-y-8 h-[calc(100vh-2rem)] flex flex-col">
      <CommonHeader backBtn title={t("templates.library_title", "Admin Template Library")} description={t("templates.library_description", "Browse curated templates created by admin. Use any template to start creating your own.")} onSearch={setSearchQuery} searchTerm={searchQuery} searchPlaceholder="Search templates..." onRefresh={handleRefresh} isLoading={isLoading} />

      {/* Sector Filter Bar */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest flex items-center gap-2">
            <LayoutGrid size={16} className="text-primary" />
            Explore by Sector
          </h3>
        </div>

        <div className="relative group/scroll">
          <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar-horizontal snap-x scroll-smooth">
            {SECTORS.map((sector) => {
              const Icon = sector.icon;
              const isActive = selectedSector === sector.id;
              return (
                <button key={sector.id} onClick={() => handleSectorChange(sector.id)} className={`relative flex-none w-44 group cursor-pointer snap-start`}>
                  <div className={`p-4 rounded-lg border h-full w-full flex gap-3 transition-all overflow-hidden relative shadow-sm hover:shadow-xl ${isActive ? "border-primary bg-primary text-white" : "border-slate-200 dark:border-(--card-border-color) bg-white/60 dark:bg-(--card-color) backdrop-blur-md"}`}>
                    <div className={`absolute -right-4 -top-4 w-20 h-20 rounded-full blur-2xl opacity-20 transition-all group-hover:scale-150 ${sector.color}`} />

                    <div className={`w-9 h-9 rounded-2xl flex items-center justify-center transition-all ${isActive ? "bg-white/20 scale-110 shadow-lg" : `bg-linear-to-br ${sector.color} text-white shadow-md group-hover:scale-110`}`}>
                      <Icon size={18} />
                    </div>

                    <div className="space-y-0.5 flex flex-col items-start">
                      <span className={`text-sm font-bold block transition-colors duration-300 ${isActive ? "text-white" : "text-slate-700 dark:text-slate-200"}`}>{sector.label}</span>
                      <span className={`text-[10px] uppercase tracking-wider font-semibold opacity-60 ${isActive ? "text-white" : "text-slate-400"}`}>{sector.id === "all" ? "Library" : "Industry"}</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Category Filter Pills */}
        {selectedSector !== "all" && (
          <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center gap-2 px-1">
              <div className="h-4 w-1 bg-primary rounded-full" />
              <h4 className="text-[13px] font-medium text-slate-400 dark:text-slate-500">Available Categories</h4>
            </div>
            <div className="flex flex-wrap gap-2 pb-2">
              <button onClick={() => setSelectedCategory("all")} className={`px-5 py-2.5 rounded-lg text-xs font-bold transition-all duration-300 border shadow-sm ${selectedCategory === "all" ? "bg-primary dark:bg-(--card-color) text-white dark:text-gray-400 border-primary dark:border-(--card-border-color) scale-105 shadow-md" : "bg-white dark:bg-(--card-color) text-slate-500 border-slate-200 dark:border-(--card-border-color) hover:border-primary hover:text-primary"}`}>
                All Categories
              </button>
              {(SECTOR_DATA[selectedSector as keyof typeof SECTOR_DATA] || []).map((cat) => (
                <button key={cat} onClick={() => setSelectedCategory(cat)} className={`px-5 py-2.5 rounded-lg text-xs font-bold transition-all duration-300 border shadow-sm capitalize ${selectedCategory === cat ? "bg-primary text-white border-primary scale-105 shadow-md" : "bg-white dark:bg-(--page-body-bg) text-slate-500 border-slate-200 dark:border-(--card-border-color) hover:border-primary hover:text-primary"}`}>
                  {cat.split("_").join(" ")}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 px-1 pb-10">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-3">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
            <p className="text-sm text-slate-500 font-medium tracking-wide">Loading admin templates...</p>
          </div>
        ) : templates.length === 0 ? (
          <div className="text-center py-32 bg-white/50 dark:bg-(--card-color) rounded-lg border border-dashed border-slate-200 dark:border-(--card-border-color)">
            <p className="text-sm text-slate-500 dark:text-amber-50">{searchQuery ? "No templates found matching your search." : "No admin templates available yet."}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
            {templates.map((template) => (
              <AdminTemplateCard key={template._id} template={template} onPreview={setPreviewTemplate} onUse={handleUseTemplate} isUsing={usingTemplateId === template._id} />
            ))}
          </div>
        )}
      </div>

      <TemplatePreviewModal isOpen={!!previewTemplate} onClose={() => setPreviewTemplate(null)} template={previewTemplate} />

      <SelectWabaModal
        isOpen={isWabaModalOpen}
        onClose={() => {
          setIsWabaModalOpen(false);
          setUsingTemplateId(null);
        }}
        connections={connections}
        onConfirm={handleConfirmWabaSelection}
      />
    </div>
  );
};

export default AdminTemplateLibrary;
