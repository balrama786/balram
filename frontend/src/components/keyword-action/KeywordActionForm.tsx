/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/src/elements/ui/button";
import { Input } from "@/src/elements/ui/input";
import { Label } from "@/src/elements/ui/label";
import { cn } from "@/src/lib/utils";
import { ArrowLeft, ArrowRight, Check, Info, Loader2, Plus, Search, Sparkles, X, FileText, Image, Video, Sticker, LayoutTemplate, ShoppingBag, ListOrdered, Type, Eye, Mailbox } from "lucide-react";

import { useGetReplyMaterialsQuery } from "@/src/redux/api/replyMaterialApi";
import { useGetTemplatesQuery } from "@/src/redux/api/templateApi";
import { useGetLinkedCatalogsQuery } from "@/src/redux/api/catalogueApi";
import { useGetChatbotsQuery } from "@/src/redux/api/chatbotApi";
import { useGetSequencesQuery } from "@/src/redux/api/sequenceApi";
import { useGetKeywordActionByIdQuery, useCreateKeywordActionMutation, useUpdateKeywordActionMutation } from "@/src/redux/api/keywordActionApi";
import { useGetCustomFieldsQuery } from "@/src/redux/api/customFieldApi";
import { useAppSelector } from "@/src/redux/hooks";

import { MatchingMethod, KeywordActionReplyType, KeywordActionCreatePayload } from "@/src/types/keyword-action";
import { CONTACT_SYSTEM_FIELDS } from "../campaigns/wizard/types";
import TemplateConfig from "../reply-materials/sequence-step/TemplateConfig";
import { CampaignCard, CarouselProduct, TemplateCarouselCard } from "@/src/types/campaign";
import { MaterialPreviewModal } from "../shared/MaterialPreviewModal";

const MATCHING_METHODS: { value: MatchingMethod; label: string; description: string }[] = [
  { value: "exact", label: "Exact Match", description: "Keyword must match exactly" },
  { value: "contains", label: "Contains", description: "Message must contain the keyword" },
  { value: "partial", label: "Partial Match", description: "Fuzzy match with a threshold %" },
  { value: "starts_with", label: "Starts With", description: "Message must start with keyword" },
  { value: "ends_with", label: "Ends With", description: "Message must end with keyword" },
];

interface ReplyTypeConfig {
  value: KeywordActionReplyType;
  label: string;
  icon: React.ReactNode;
  color: string;
  source: "reply_material" | "template" | "catalog" | "chatbot" | "sequence";
  materialType?: string;
}

const REPLY_TYPES: ReplyTypeConfig[] = [
  { value: "text", label: "Text", icon: <Type size={18} />, color: "text-blue-500", source: "reply_material", materialType: "text" },
  // eslint-disable-next-line jsx-a11y/alt-text
  { value: "media", label: "Image", icon: <Image size={18} />, color: "text-emerald-500", source: "reply_material", materialType: "image" },
  { value: "media", label: "Video", icon: <Video size={18} />, color: "text-purple-500", source: "reply_material", materialType: "video" },
  { value: "media", label: "Document", icon: <FileText size={18} />, color: "text-amber-500", source: "reply_material", materialType: "document" },
  { value: "media", label: "Sticker", icon: <Sticker size={18} />, color: "text-pink-500", source: "reply_material", materialType: "sticker" },
  { value: "template", label: "Template", icon: <LayoutTemplate size={18} />, color: "text-indigo-500", source: "template" },
  { value: "catalog", label: "Catalogue", icon: <ShoppingBag size={18} />, color: "text-orange-500", source: "catalog" },
  { value: "sequence", label: "Sequence", icon: <ListOrdered size={18} />, color: "text-teal-500", source: "sequence" },
  { value: "chatbot", label: "Chatbot", icon: <Sparkles size={18} />, color: "text-rose-500", source: "chatbot" },
];

const STEP_LABELS = ["Keywords", "Reply Material", "Configure"];

const StepIndicator: React.FC<{ current: number; total: number }> = ({ current, total }) => (
  <div className="flex items-center">
    {Array.from({ length: total }, (_, i) => i + 1).map((s) => (
      <React.Fragment key={s}>
        <div className="flex items-center gap-2">
          <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-sm font-black transition-all shrink-0", s < current ? "bg-primary text-white" : s === current ? "bg-primary text-white ring-4 ring-primary/20" : "bg-slate-100 dark:bg-(--dark-body) text-slate-400")}>{s < current ? <Check size={14} strokeWidth={3} /> : s}</div>
          <span className={cn("text-sm font-semibold hidden sm:block", s === current ? "text-primary" : "text-slate-400")}>{STEP_LABELS[s - 1]}</span>
        </div>
        {s < total && <div className={cn("flex-1 h-0.5 mx-4 rounded-full min-w-8", s < current ? "bg-primary" : "bg-slate-100 dark:bg-(--page-body-bg)")} />}
      </React.Fragment>
    ))}
  </div>
);

const PercentageSlider: React.FC<{ value: number; onChange: (v: number) => void }> = ({ value, onChange }) => (
  <div className="space-y-3 p-4 bg-amber-50/60 dark:bg-amber-500/5 rounded-lg border border-amber-100 dark:border-amber-500/20">
    <div className="flex items-center justify-between">
      <Label className="text-xs font-bold text-amber-700 dark:text-amber-400">Match Sensitivity</Label>
      <span className="text-sm font-black text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-500/20 px-2.5 py-1 rounded-lg">{value}%</span>
    </div>
    <div className="relative h-2.5">
      <div className="absolute inset-0 bg-amber-100 dark:bg-amber-900/30 rounded-full overflow-hidden">
        <div className="h-full bg-amber-400 dark:bg-amber-500 rounded-full transition-all" style={{ width: `${value}%` }} />
      </div>
      <input type="range" min={0} max={100} value={value} onChange={(e) => onChange(Number(e.target.value))} className="absolute inset-0 w-full opacity-0 cursor-pointer h-2.5" />
    </div>
    <div className="flex justify-between text-[10px] text-amber-500/70 font-bold">
      <span>0% — Any similar</span>
      <span>100% — Exact</span>
    </div>
  </div>
);
interface KeywordActionFormProps {
  editId?: string;
}

const KeywordActionForm: React.FC<KeywordActionFormProps> = ({ editId }) => {
  const router = useRouter();
  const { selectedWorkspace } = useAppSelector((state) => state.workspace);
  const isBaileys = selectedWorkspace?.waba_type === "baileys";
  const wabaId = selectedWorkspace?.waba_id || "";

  const filteredReplyTypes = REPLY_TYPES.filter((rt) => {
    if (isBaileys && (rt.value === "template" || rt.value === "catalog")) {
      return false;
    }
    return true;
  });
  const isEdit = !!editId;

  const [step, setStep] = useState(1);

  const [keywords, setKeywords] = useState<string[]>([]);
  const [keywordInput, setKeywordInput] = useState("");
  const [matchingMethod, setMatchingMethod] = useState<MatchingMethod>("exact");
  const [partialPercentage, setPartialPercentage] = useState(80);

  const [activeTypeIndex, setActiveTypeIndex] = useState(0); // index into REPLY_TYPES
  const [selectedReplyId, setSelectedReplyId] = useState("");
  const [materialSearch, setMaterialSearch] = useState("");

  const [variablesMapping, setVariablesMapping] = useState<Record<string, string>>({});
  const [mediaUrl, setMediaUrl] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [offerExpirationMinutes, setOfferExpirationMinutes] = useState<number | undefined>();
  const [thumbnailProductRetailerId, setThumbnailProductRetailerId] = useState("");
  const [carouselCardsData, setCarouselCardsData] = useState<CampaignCard[]>([]);
  const [carouselProducts, setCarouselProducts] = useState<CarouselProduct[]>([]);

  const [previewItem, setPreviewItem] = useState<{ type: string; material: any } | null>(null);

  const skip = !wabaId;
  const { data: materialsData, isLoading: loadingMaterials } = useGetReplyMaterialsQuery({ waba_id: wabaId }, { skip });
  const { data: templatesData, isLoading: loadingTemplates } = useGetTemplatesQuery({ waba_id: wabaId, status: "approved" }, { skip });
  const { data: catalogsData, isLoading: loadingCatalogs } = useGetLinkedCatalogsQuery({ waba_id: wabaId }, { skip });
  const { data: chatbotsData, isLoading: loadingChatbots } = useGetChatbotsQuery({ waba_id: wabaId }, { skip });
  const { data: sequencesData, isLoading: loadingSequences } = useGetSequencesQuery({ waba_id: wabaId }, { skip });
  const { data: editData, isLoading: loadingEdit } = useGetKeywordActionByIdQuery(editId || "", { skip: !editId });
  const { data: customFieldsResult } = useGetCustomFieldsQuery({});

  const [createAction, { isLoading: isCreating }] = useCreateKeywordActionMutation();
  const [updateAction, { isLoading: isUpdating }] = useUpdateKeywordActionMutation();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const customFields = customFieldsResult?.data?.fields || [];
  const mappingOptions = useMemo(() => {
    const custom = customFields.map((f: any) => ({ label: `CF: ${f.label}`, value: `cf_${f.name}` }));
    return [...CONTACT_SYSTEM_FIELDS, ...custom];
  }, [customFields]);

  useEffect(() => {
    if (editData?.data) {
      const d = editData.data;
      setKeywords(d.keywords || []);
      setMatchingMethod(d.matching_method || "exact");
      setPartialPercentage(d.partial_percentage || 80);

      const replyObj = d.reply_id as any;
      const type = d.reply_type;
      const replyId = typeof replyObj === "string" ? replyObj : replyObj?._id || "";

      let index = 0;
      if (type === "template") index = REPLY_TYPES.findIndex((r) => r.value === "template");
      else if (type === "catalog") index = REPLY_TYPES.findIndex((r) => r.value === "catalog");
      else if (type === "sequence") index = REPLY_TYPES.findIndex((r) => r.value === "sequence");
      else if (type === "chatbot") index = REPLY_TYPES.findIndex((r) => r.value === "chatbot");
      else if (type === "text") index = REPLY_TYPES.findIndex((r) => r.value === "text");
      else if (type === "media") {
        const materialType = replyObj?.type || "";
        index = REPLY_TYPES.findIndex((r) => r.value === "media" && r.materialType === materialType);
      }

      if (index !== -1) setActiveTypeIndex(index);
      setSelectedReplyId(replyId);

      setVariablesMapping(d.variables_mapping || {});
      setMediaUrl(d.media_url || "");
      setCouponCode(d.coupon_code || "");
      setCarouselCardsData(d.carousel_cards_data || []);
    }
  }, [editData]);

  const activeTypeConfig = REPLY_TYPES[activeTypeIndex];

  const allMaterials = useMemo(() => {
    if (!materialsData?.data) return [];
    const { texts, images, documents, videos, stickers } = materialsData.data;
    return [...texts.items.map((i) => ({ ...i, category: "text" })), ...images.items.map((i) => ({ ...i, category: "image" })), ...documents.items.map((i) => ({ ...i, category: "document" })), ...videos.items.map((i) => ({ ...i, category: "video" })), ...stickers.items.map((i) => ({ ...i, category: "sticker" }))];
  }, [materialsData]);

  const filteredItems = useMemo(() => {
    const s = materialSearch.toLowerCase();
    const cfg = activeTypeConfig;
    switch (cfg.source) {
      case "reply_material":
        return allMaterials.filter((m) => m.category === cfg.materialType && m.name.toLowerCase().includes(s));
      case "template":
        return (templatesData?.data || []).map((t) => ({ ...t, name: t.template_name })).filter((t) => t.name?.toLowerCase().includes(s));
      case "catalog":
        return (catalogsData?.data?.catalogs || []).filter((c) => c.name.toLowerCase().includes(s));
      case "chatbot":
        return (chatbotsData?.data || []).filter((c) => c.name.toLowerCase().includes(s));
      case "sequence":
        return (sequencesData?.data || []).filter((c) => c.name.toLowerCase().includes(s));
      default:
        return [];
    }
  }, [activeTypeConfig, materialSearch, allMaterials, templatesData, catalogsData, chatbotsData, sequencesData]);

  const isLoadingMaterials = loadingMaterials || loadingTemplates || loadingCatalogs || loadingChatbots || loadingSequences;

  const selectedMaterial = useMemo(() => {
    if (!selectedReplyId) return null;

    if (editData?.data?.reply_id && typeof editData.data.reply_id === "object") {
      if ((editData.data.reply_id as any)._id === selectedReplyId) {
        return editData.data.reply_id;
      }
    }

    const cfg = activeTypeConfig;
    switch (cfg.source) {
      case "reply_material":
        return allMaterials.find((item) => item._id === selectedReplyId);
      case "template":
        return (templatesData?.data || []).find((item) => item._id === selectedReplyId);
      case "catalog":
        return (catalogsData?.data?.catalogs || []).find((item) => item._id === selectedReplyId);
      case "chatbot":
        return (chatbotsData?.data || []).find((item) => item._id === selectedReplyId);
      case "sequence":
        return (sequencesData?.data || []).find((item) => item._id === selectedReplyId);
      default:
        return null;
    }
  }, [selectedReplyId, activeTypeConfig, allMaterials, templatesData, catalogsData, chatbotsData, sequencesData, editData]);

  const hasMediaHeader = useMemo(() => {
    if (activeTypeConfig.source !== "template" || !selectedMaterial) return false;
    const components = (selectedMaterial as any).components || [];
    const header = components.find((c: any) => c.type === "HEADER");
    return header?.format === "IMAGE" || header?.format === "VIDEO" || header?.format === "DOCUMENT";
  }, [activeTypeConfig.source, selectedMaterial]);

  const needsStep3 = useMemo(() => {
    if (activeTypeConfig.source !== "template" || !selectedMaterial) return false;

    const components = (selectedMaterial as any).components || [];

    const hasVariables = components.some((c: any) => {
      if (c.text && /\{\{\d+\}\}/.test(c.text)) return true;
      if (c.buttons && c.buttons.some((b: any) => b.text && /\{\{\d+\}\}/.test(b.text))) return true;
      return false;
    });

    const templateType = (selectedMaterial as any).template_type || "";
    const isCarousel = templateType.includes("carousel") || (selectedMaterial as any).carousel_cards?.length > 0;
    const isCatalog = templateType === "catalog";
    const isMarketing = templateType === "coupon" || templateType === "limited_time_offer";

    return hasVariables || hasMediaHeader || isCarousel || isCatalog || isMarketing;
  }, [activeTypeConfig.source, selectedMaterial, hasMediaHeader]);

  const totalSteps = needsStep3 ? 3 : 2;

  const addKeyword = () => {
    const t = keywordInput.trim();
    if (t && !keywords.includes(t)) {
      setKeywords((p) => [...p, t]);
      setKeywordInput("");
    }
  };
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addKeyword();
    }
  };

  const handleMaterialSelect = useCallback(
    (id: string) => {
      setSelectedReplyId(id);
      if (activeTypeConfig.source === "template") {
        const material = (templatesData?.data || []).find((t) => t._id === id);
        if (material) {
          const components = (material as any).components || [];

          const allText = components
            .map((c: any) => {
              let text = c.text || "";
              if (c.buttons) {
                text += " " + c.buttons.map((b: any) => b.text || "").join(" ");
              }
              return text;
            })
            .join(" ");

          const keys = [...new Set(allText.match(/\{\{\d+\}\}/g) || [])].map((m: any) => m.replace(/\{\{|\}\}/g, ""));
          const mapping: Record<string, string> = {};
          keys.forEach((k) => (mapping[k] = ""));
          setVariablesMapping(mapping);

          const marketingType = (material as any)?.template_type || "";
          const templateCards: TemplateCarouselCard[] = (material as any)?.carousel_cards || [];
          const isCarouselMedia = marketingType === "carousel_media" || (marketingType === "carousel" && !templateCards?.[0]?.components?.find?.((c: any) => c.type === "header")?.format?.includes("product"));
          const isCarouselProduct = marketingType === "carousel_product" || (marketingType === "carousel" && !isCarouselMedia);

          if (isCarouselMedia) {
            setCarouselCardsData(
              templateCards.map((tc) => ({
                header: { type: tc.components?.find?.((c: any) => c.type === "header")?.format || "image", link: "" },
                body: { text: "" },
                buttons: (tc.components?.find?.((c: any) => c.type === "buttons")?.buttons || []).map((b: any) => ({
                  type: b.type,
                  text: b.text || "",
                  ...(b.type === "url" ? { url_value: "" } : {}),
                  ...(b.type === "quick_reply" ? { payload: "" } : {}),
                })),
              }))
            );
          }
          if (isCarouselProduct) {
            setCarouselProducts(templateCards.map(() => ({ product_retailer_id: "", catalog_id: "" })));
          }
        }
      } else {
        setVariablesMapping({});
      }
    },
    [activeTypeConfig, templatesData]
  );

  const handleTypeChange = (index: number) => {
    setActiveTypeIndex(index);
    setSelectedReplyId("");
    setMaterialSearch("");
    setVariablesMapping({});
    setCarouselCardsData([]);
    setCarouselProducts([]);
  };

  const handlePreview = (e: React.MouseEvent, item: any) => {
    e.stopPropagation();
    setPreviewItem({ type: activeTypeConfig.source === "reply_material" ? (item.category === "text" ? "ReplyMaterial_text" : `ReplyMaterial_${item.category}`) : activeTypeConfig.source === "template" ? "Template" : activeTypeConfig.source === "catalog" ? "EcommerceCatalog" : activeTypeConfig.source === "chatbot" ? "Chatbot" : "Sequence", material: item });
  };

  const handleSubmit = async () => {
    const payload: KeywordActionCreatePayload = {
      waba_id: wabaId,
      keywords,
      matching_method: matchingMethod,
      ...(matchingMethod === "partial" ? { partial_percentage: partialPercentage } : {}),
      reply_type: activeTypeConfig.value,
      reply_id: selectedReplyId,
      ...(activeTypeConfig.source === "template"
        ? {
            variables_mapping: variablesMapping,
            media_url: mediaUrl || undefined,
            carousel_cards_data: carouselCardsData.length > 0 ? carouselCardsData : undefined,
            coupon_code: couponCode || undefined,
            product_retailer_id: thumbnailProductRetailerId || undefined,
          }
        : {}),
    };

    try {
      if (isEdit) {
        const res = await updateAction({ id: editId!, data: payload }).unwrap();
        toast.success(res.message || "Keyword action updated");
      } else {
        const res = await createAction(payload).unwrap();
        toast.success(res.message || "Keyword action created");
      }
      router.push("/keyword_action");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to save keyword action");
    }
  };

  const handleNext = () => {
    if (step === 1) {
      if (keywords.length > 0) setStep(2);
      else toast.error("Add at least one keyword");
    } else if (step === 2) {
      if (!selectedReplyId) {
        toast.error("Select a reply material");
        return;
      }
      if (needsStep3) setStep(3);
      else handleSubmit();
    } else handleSubmit();
  };

  const isSubmitting = isCreating || isUpdating;

  if (loadingEdit) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <Loader2 size={32} className="animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="mx-auto p-4 sm:p-8 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.push("/keyword_action")} className="h-9 w-9 rounded-xl bg-white dark:bg-(--card-color) border border-slate-200 dark:border-(--card-border-color) shadow-sm">
          <ArrowLeft size={18} />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{isEdit ? "Edit Keyword Action" : "New Keyword Action"}</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Automatically reply to messages matching keywords</p>
        </div>
      </div>

      <div className="bg-white dark:bg-(--card-color) rounded-lg border border-slate-200/60 dark:border-(--card-border-color) p-6 shadow-sm">
        <StepIndicator current={step} total={totalSteps} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-(--card-color) rounded-lg border border-slate-200/60 dark:border-(--card-border-color) shadow-sm overflow-hidden">
          {step === 1 && (
            <div className="sm:p-6 p-4 space-y-7">
              <div>
                <h2 className="text-sm font-medium text-slate-900 dark:text-white">Keywords</h2>
                <p className="text-xs text-slate-400 mt-0.5">Add keywords that will trigger this reply action.</p>
              </div>

              {/* Keyword Tag Input */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-500">Keywords</Label>
                <div className={cn("min-h-10 p-3 rounded-lg border transition-all cursor-text flex flex-wrap gap-2 items-center", "bg-slate-50 dark:bg-(--page-body-bg) focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/10", keywords.length ? "border-primary/20" : "border-slate-200 dark:border-none")} onClick={() => document.getElementById("kw-input")?.focus()}>
                  {keywords.map((kw) => (
                    <span key={kw} className="inline-flex items-center gap-1.5 pl-3 pr-2 py-1.5 rounded-full text-xs font-bold bg-primary text-white">
                      {kw}
                      <button type="button" onClick={() => setKeywords((p) => p.filter((k) => k !== kw))} className="w-4 h-4 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center">
                        <X size={9} strokeWidth={3} />
                      </button>
                    </span>
                  ))}
                  <input id="kw-input" value={keywordInput} onChange={(e) => setKeywordInput(e.target.value)} onKeyDown={handleKeyDown} placeholder={keywords.length === 0 ? "Type a keyword and press Enter or comma..." : "Add another..."} className="flex-1 min-w-32 bg-transparent outline-none text-sm text-slate-700 dark:text-slate-200 placeholder:text-slate-400" />
                </div>
                {keywordInput && (
                  <Button type="button" size="sm" onClick={addKeyword} variant="outline" className="h-8 text-xs rounded-lg gap-1.5">
                    <Plus size={12} /> Add &ldquo;{keywordInput}&rdquo;
                  </Button>
                )}
                <p className="text-sm text-slate-400 flex items-center gap-1.5 mt-1">
                  <Info size={11} /> Press <kbd className="bg-slate-100 dark:bg-(--dark-body) px-1.5 py-0.5 rounded text-[10px] font-bold">Enter</kbd>  to add each keyword.
                </p>
              </div>

              <div className="space-y-3">
                <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Matching Method</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {MATCHING_METHODS.map((m) => (
                    <button key={m.value} type="button" onClick={() => setMatchingMethod(m.value)} className={cn("flex items-start gap-3 p-4 rounded-lg border text-left transition-all", matchingMethod === m.value ? "border-primary bg-primary/5 ring-1 ring-primary/10 shadow-sm" : "border-slate-100 dark:border-(--card-border-color) hover:border-primary/20 hover:bg-slate-50/50 dark:hover:bg-(--table-hover)")}>
                      <div className={cn("w-4.5 h-4.5 rounded-full border-2 flex items-center justify-center mt-0.5 shrink-0 transition-all", matchingMethod === m.value ? "border-primary bg-primary" : "border-slate-300 dark:border-(--card-border-color)")}>{matchingMethod === m.value && <Check size={9} strokeWidth={4} className="text-white" />}</div>
                      <div className="min-w-0">
                        <p className={cn("text-sm font-bold", matchingMethod === m.value ? "text-primary" : "text-slate-800 dark:text-white")}>{m.label}</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">{m.description}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {matchingMethod === "partial" && <PercentageSlider value={partialPercentage} onChange={setPartialPercentage} />}
            </div>
          )}

          {step === 2 && (
            <div className="sm:p-6 p-4 space-y-5">
              <div>
                <h2 className="text-base font-black text-slate-900 dark:text-white">Reply Material</h2>
                <p className="text-xs text-slate-400 mt-0.5">Choose what to send when a keyword is triggered.</p>
              </div>

              <div className="flex items-center gap-2.5 p-3.5 bg-primary/5 rounded-xl border border-primary/10">
                <Sparkles size={16} className="text-primary shrink-0" />
                <p className="text-xs text-primary font-semibold">Select the material to auto-send when any keyword matches.</p>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Reply Type</Label>
                <div className="flex flex-wrap gap-2">
                  {filteredReplyTypes.map((rt) => {
                    const idx = REPLY_TYPES.indexOf(rt);
                    return (
                      <button key={`${rt.value}-${rt.label}`} type="button" onClick={() => handleTypeChange(idx)} className={cn("inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold border transition-all", activeTypeIndex === idx ? "bg-primary text-white border-primary shadow-sm" : "border-slate-200 dark:border-(--card-border-color) text-slate-500 hover:border-primary/30 hover:text-primary hover:bg-primary/5")}>
                        <span className={cn("transition-colors", activeTypeIndex === idx ? "text-white" : rt.color)}>{rt.icon}</span>
                        {rt.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <Input value={materialSearch} onChange={(e) => setMaterialSearch(e.target.value)} placeholder={`Search ${activeTypeConfig.label.toLowerCase()} materials...`} className="pl-10 h-11 rounded-xl border-slate-200 dark:border-(--card-border-color) bg-slate-50 dark:bg-(--dark-body)" />
              </div>

              <div className="space-y-2 max-h-80 overflow-y-auto pr-1 custom-scrollbar">
                {isLoadingMaterials ? (
                  <div className="py-14 flex flex-col items-center gap-2 text-slate-400">
                    <Loader2 size={24} className="animate-spin text-primary" />
                    <span className="text-xs font-medium">Loading materials...</span>
                  </div>
                ) : filteredItems.length === 0 ? (
                  <div className="py-14 text-center space-y-2">
                    <div className="text-slate-300 dark:text-slate-600 flex justify-center">
                      <Mailbox className="w-10 h-10 text-primary" />
                    </div>
                    <p className="text-sm font-medium text-slate-400">No {activeTypeConfig.label.toLowerCase()} materials found</p>
                  </div>
                ) : (
                  filteredItems.map((item: any) => (
                    <button key={item._id} type="button" onClick={() => handleMaterialSelect(item._id)} className={cn("w-full flex items-center justify-between p-4 rounded-lg border transition-all text-left group", selectedReplyId === item._id ? "border-primary bg-primary/5 shadow-sm ring-1 ring-primary/10" : "border-slate-100 dark:border-(--card-border-color) hover:border-primary/30 hover:bg-slate-50/50 dark:hover:bg-(--table-hover)")}>
                      <div className="flex-1 min-w-0 pr-3">
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-sm text-slate-800 dark:text-white truncate">{item.name}</p>
                          <button type="button" onClick={(e) => handlePreview(e, item)} className="p-1 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-primary transition-colors cursor-pointer">
                            <Eye size={18} />
                          </button>
                        </div>
                        {item.category && <span className="text-[10px] uppercase tracking-widest font-bold text-slate-400">{item.category}</span>}
                      </div>
                      <div className={cn("w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-all border", selectedReplyId === item._id ? "bg-primary border-primary" : "border-slate-200 dark:border-slate-700")}>{selectedReplyId === item._id && <Check size={11} strokeWidth={4} className="text-white" />}</div>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}

          {step === 3 && selectedMaterial && (
            <div className="sm:p-6 p-4 space-y-5">
              <div>
                <h2 className="text-base font-black text-slate-900 dark:text-white">Configure Template</h2>
                <p className="text-xs text-slate-400 mt-0.5">Map variables and configure options for this template.</p>
              </div>

              <div className="p-3.5 bg-slate-50 dark:bg-(--page-body-bg) rounded-lg border border-slate-100 dark:border-none flex items-center gap-3">
                <LayoutTemplate size={16} className="text-indigo-500 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-slate-800 dark:text-white">{(selectedMaterial as any).name}</p>
                  <p className="text-sm text-slate-400">Selected template</p>
                </div>
              </div>

              <TemplateConfig template={selectedMaterial} wabaId={wabaId} variablesMapping={variablesMapping} onVariableChange={(key, val) => setVariablesMapping((prev) => ({ ...prev, [key]: val }))} mediaUrl={mediaUrl} onMediaUrlChange={setMediaUrl} hasMediaHeader={hasMediaHeader} couponCode={couponCode} onCouponCodeChange={setCouponCode} offerExpirationMinutes={offerExpirationMinutes} onOfferExpirationMinutesChange={setOfferExpirationMinutes} thumbnailProductRetailerId={thumbnailProductRetailerId} onThumbnailProductRetailerIdChange={setThumbnailProductRetailerId} carouselCardsData={carouselCardsData} onCarouselCardsDataChange={setCarouselCardsData} carouselProducts={carouselProducts} onCarouselProductsChange={setCarouselProducts} mappingOptions={mappingOptions} />
            </div>
          )}

          <div className="sm:px-6 px-4 py-4 border-t border-slate-100 dark:border-(--card-border-color) bg-slate-50/50 dark:bg-(--card-color) flex items-center gap-3">
            <Button variant="outline" onClick={step === 1 ? () => router.push("/keyword_action") : () => setStep((s) => (s - 1) as any)} className="flex-1 h-11 rounded-lg font-bold">
              {step === 1 ? (
                "Cancel"
              ) : (
                <>
                  <ArrowLeft size={16} className="mr-1.5" /> Back
                </>
              )}
            </Button>
            <Button onClick={handleNext} disabled={isSubmitting || (step === 2 && isLoadingMaterials)} className="flex-1 h-11 rounded-lg bg-primary text-white font-bold shadow-lg shadow-primary/20 active:scale-95 transition-all">
              {isSubmitting ? (
                <Loader2 className="animate-spin" size={18} />
              ) : step === totalSteps ? (
                <>
                  <Check size={16} className="mr-1.5" />
                  {isEdit ? "Update Action" : "Create Action"}
                </>
              ) : (
                <>
                  Next <ArrowRight size={16} className="ml-1.5" />
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white dark:bg-(--card-color) rounded-lg border border-slate-200/60 dark:border-(--card-border-color) p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-black text-slate-500">Summary</h3>

            <div className="space-y-1.5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Keywords</p>
              {keywords.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {keywords.map((kw) => (
                    <span key={kw} className="px-2.5 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary">
                      {kw}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">No keywords yet</p>
              )}
            </div>

            <div className="space-y-1.5">
              <p className="text-sm font-medium text-slate-400">Matching</p>
              <p className="text-sm font-bold text-slate-700 dark:text-slate-300 capitalize">
                {MATCHING_METHODS.find((m) => m.value === matchingMethod)?.label || matchingMethod}
                {matchingMethod === "partial" && <span className="ml-1.5 text-amber-500">({partialPercentage}%)</span>}
              </p>
            </div>

            {selectedReplyId && (
              <div className="space-y-1.5">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Reply</p>
                <div className="flex items-center gap-2">
                  <span className={cn("shrink-0", activeTypeConfig.color)}>{activeTypeConfig.icon}</span>
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-300 truncate">{(selectedMaterial as any)?.name || "—"}</p>
                </div>
              </div>
            )}
          </div>

          <div className="bg-primary/5 dark:bg-primary/10 rounded-lg border border-primary/10 p-4 space-y-2">
            <div className="flex items-center gap-2">
              <Sparkles size={14} className="text-primary" />
              <p className="text-xs font-black text-primary uppercase tracking-wider">Tips</p>
            </div>
            <ul className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400 list-disc list-inside leading-relaxed">
              <li>Add multiple keywords for broader coverage</li>
              <li>
                Use <strong>Partial Match</strong> for typo tolerance
              </li>
              <li>Templates support variable substitution</li>
            </ul>
          </div>
        </div>
      </div>
      {previewItem && <MaterialPreviewModal isOpen={!!previewItem} onClose={() => setPreviewItem(null)} type={previewItem.type} material={previewItem.material} />}
    </div>
  );
};

export default KeywordActionForm;
